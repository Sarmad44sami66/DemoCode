import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Platform
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import moment from 'moment';
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { REGISTRATION054_PROP_CHANGED, RPOFILESCREEN200_PROP_CHANGED, REGISTRATION054_PROP_CLEAR, Registration0541_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
const {height, width} = Dimensions.get('window');

class ProfileScreen202 extends Component {

    componentDidMount(){
        this.checkInternet();
    }

    componentWillUnmount(){
        this.props.propsClear(REGISTRATION054_PROP_CLEAR)
    }

    checkInternet() {
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(REGISTRATION054_PROP_CHANGED, "isConnected", state.isConnected);
        });
        subscribe();
    }

    onUploadImageButtonPress(){
        this.props.propChanged(REGISTRATION054_PROP_CHANGED, "loading", true)
        if(this.props.isConnected){
            let requestBody = new FormData();
            requestBody.append("logo", this.props.imageSource)
            const {Registration0541_Api_Call} = this.props;
            Registration0541_Api_Call(
                requestBody,
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response)=> {
        console.log("Success1")
        this.props.propChanged(REGISTRATION054_PROP_CHANGED, "loading", false);
        if (response.id) {
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "businessLogo", response.logo);
            this.props.screenIDHandler(201);
        }
    }
    onError = (error) => {
        this.props.propChanged(REGISTRATION054_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        } else {
            errors += JSON.stringify(error) + '\n'
        }
        if(errors.length > 0)
            alert(errors)
    }

    selectImageButtonPress(){
        let checkConst = '';
        let platformConst = Platform.OS;
        if(platformConst === 'ios'){
            checkConst = PERMISSIONS.IOS.PHOTO_LIBRARY
        } else if (platformConst === 'android') {
            checkConst = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        } else return;
        console.log(checkConst)
        Permissions.check(checkConst)
            .then(result => {
                this.handleResults(result, checkConst)
            }).catch(error => {
                // …
            });
    }

    handleResults = (result, checkConst, count = 1) =>{
        if(count == 3){
            return
        }
        switch (result) {
            case RESULTS.UNAVAILABLE:
                console.log('This feature is not available (on this device / in this context)',);
                break;
            case RESULTS.DENIED:
                Permissions.request(checkConst).then(result => {
                    this.handleResults(result, checkConst, count + 1)
                });
                console.log('The permission has not been requested / is denied but requestable',);
                break;
            case RESULTS.GRANTED:
                this.handleChoosePhoto();
                break;
            case RESULTS.BLOCKED:
                Permissions.openSettings().catch(() => console.warn('cannot open settings'));
                console.log('The permission is denied and not requestable anymore');
                break;
        }
    }

    handleChoosePhoto() {
        ImagePicker.openPicker({
            width: 810,
            height: 330,
            mediaType: 'photo',
            includeBase64: false,
            cropping: true,
            compressImageQuality: 0.9,
        }).then(image => {
            const source = { uri: image.path, name: moment().format("x") + '.jpg', type: 'image/jpeg' };
            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.props.propChanged(REGISTRATION054_PROP_CHANGED, "imageSource", source);
            this.props.propChanged(REGISTRATION054_PROP_CHANGED, "isImageAttached", true);
        });
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 55, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#F8F8F8'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                onPress={()=>{this.props.screenIDHandler(201)}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, textAlign: 'center'}}>{'Change photo'}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}>
                        </View>
                    </View>
                    <KeyboardAwareScrollView
                        innerRef={ref => {this.scroll = ref}}
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow:1}}
                        style={{flex:1, width:width}}>
                        <View style={{flexGrow:1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{justifyContent:"center", alignItems: 'center', width:"80%"}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 24, marginTop: 30}}>
                                    {'Please upload a image that will represent your business. It could be your logo.'}
                                </Text>
                            </View>
                            <View style={styles.selectImage}>
                                {this.props.isImageAttached ?
                                    <TouchableOpacity
                                        style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}
                                        onPress={()=>{this.selectImageButtonPress()}}>
                                        <Image source={this.props.imageSource} resizeMode={"stretch"} style={{borderRadius: 10, width: '100%', height: '100%'}}/>
                                        <View style={{backgroundColor: '#007AFF', borderRadius:5, padding:5, position: 'absolute',}}>
                                            <Text style={{fontFamily: 'HelveticaNeue-bold', fontSize: 12, color: '#fff'}}>{'Change photo'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}
                                        onPress={()=>{this.selectImageButtonPress()}}>
                                        <Text style={{fontFamily: 'HelveticaNeue-Medium', fontSize: 15, color: '#000'}}>{'Select image'}</Text>
                                        <Text style={{fontFamily: 'HelveticaNeue-Roman', fontSize: 11, color: '#000', textAlign: 'center',marginTop:20}}>{'Recommended resolution\n2700x1100 px'}</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity
                                    style={[styles.navigationButton,{}]}
                                    disabled={!this.props.isImageAttached}
                                    onPress={()=>{
                                        this.onUploadImageButtonPress()
                                    }}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Upload image</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <ProgressBar visible={this.props.loading}/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        backgroundColor: "#fff",
        justifyContent: "flex-start",
    },
    navigationButtonsContainer:{
        width: '70%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 70,
    },
    selectImage:{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 85,
        marginTop: 50,
        width: '50%',
        backgroundColor:'#00000000',
        borderWidth: 1
    },
    navigationButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 10,
        height: 55,
        width: '100%',
    },
    forminputContainer: {
        height: 40,
        borderBottomColor: '#4d4d4d',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 8,
        width: "100%",
    },
    inputText:{
        fontSize: 16,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
        height:40,
        width: "100%",
        paddingBottom:2,
    },
});

const mapStateToProps = ({Registration054State, ProfileScreen200State}) => {
    const {loading, isImageAttached, imageSource, isConnected} = Registration054State;
    const {businessLogo} = ProfileScreen200State;
    return {loading, businessLogo, isImageAttached, imageSource, isConnected};
};

export default connect(mapStateToProps, { Registration0541_Api_Call, propChanged, propsClear})(ProfileScreen202)
