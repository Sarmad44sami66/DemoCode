import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { REGISTRATION056_PROP_CHANGED, REGISTRATION056_PROP_CLEAR, Registration0532_Api_Call, Registration0561_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
const uncheckIcon = require('../../assets/icons/rounded_uncheck.png')
const checkedIcon = require('../../assets/icons/rounded_check.png');
const {height, width} = Dimensions.get('window');

class Registration056 extends Component {

    componentDidMount(){
        this.checkInternet();
    }

    componentWillUnmount(){
        this.props.propsClear(REGISTRATION056_PROP_CLEAR)
    }

    checkInternet() {    
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(REGISTRATION056_PROP_CHANGED, "isConnected", state.isConnected);
        });
        subscribe();
    }

    onNextButtonPress(){
        if(this.props.EIN == '' || this.props.EIN.length == 10){
            console.log('\n\n\nAPI----->>>>>')
            this.props.propChanged(REGISTRATION056_PROP_CHANGED, "loading", true);
            if(this.props.isConnected){
                var details = {
                    ein: this.props.EIN,
                };
                var formBody = [];
                for (var property in details) {
                    var encodedKey = encodeURIComponent(property);
                    var encodedValue = encodeURIComponent(details[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");
                const {Registration0561_Api_Call} = this.props;
                Registration0561_Api_Call(
                    formBody,
                    this.onSuccess,
                    this.onError
                );
            } else {alert('Please check your internet')}
        } else alert('An EIN should have 9 digits\n it\'s optional so you can let this field empty')
    }

    onSuccess = (response)=> {
        console.log('\n\nEIN Success: ' + JSON.stringify(response.id));
        if(response.id){
            var details = {
                additional_business_screen: true,
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            const {Registration0532_Api_Call} = this.props;
            Registration0532_Api_Call(
                formBody,
                onSuccess = (response2)=> {
                    this.props.propChanged(REGISTRATION056_PROP_CHANGED, "loading", false)
                    console.log('\n\nCode is valid: ' + JSON.stringify(response2.id));
                    if(response2.id){
                        this.props.navigation.navigate('Registration057')
                    }
                },
                onError = (error) => {
                    this.props.propChanged(REGISTRATION056_PROP_CHANGED, "loading", false);
                    let errors = ''
                    if(error.detail){
                        errors += error.detail + '\n'
                    } else {
                        errors += error + '\n'
                    }
                    if(errors.length > 0)
                        alert(errors)
                }
            );
        }
    }
    onError = (error) => {
        console.log('\n\nEIN error: ' + JSON.stringify(error));
        this.props.propChanged(REGISTRATION056_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        } else {
            errors += JSON.stringify(error) + '\n'
        }
        if(errors.length > 0)
            alert(errors)
    }

    renderCheckOrUncheckIcon(index) {
        if(this.props.selectedIndex === index) {
            return checkedIcon;
        } else {
            return uncheckIcon;
        }
    }

    renderRadioButtons() {
        return this.props.radioOptions.map((item, index)=>{
            return (
                <TouchableOpacity onPress={()=>{
                    this.props.propChanged(REGISTRATION056_PROP_CHANGED, "selectedIndex", index);
                    if (index == 1){
                        this.props.propChanged(REGISTRATION056_PROP_CHANGED, "selectedIndex", 0);
                        alert('Currently only the credit card payment is available.')
                    }
                }}>
                    <View style={{flexDirection: 'row',alignItems: 'center', marginTop: index === 0 ? 0: 15}}>
                        <Image source={this.renderCheckOrUncheckIcon(index)} style={{height: 25, width: 25}} resizeMode={'contain'}/>
                        <Text style={{fontFamily: 'HelveticaNeue-Medium', color: 'black', fontSize: 15, marginLeft: 20}}>{item.label}</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    }

    renderDots() {
        const activeDot = require('../../assets/icons/dot-active.png');
        const inactiveDot = require('../../assets/icons/dot-inactive.png');
        const sizeActive = 10
        const imageActive = this.renderCarousel(activeDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        const imageInactive = this.renderCarousel(inactiveDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {imageInactive}
                {imageInactive}
                {imageInactive}
                {imageInactive}
                {imageActive}
            </View>
        )
    }

    renderCarousel(imageSource, styles){
        return(
            <View style={{width: 20, height: 15, alignItems: 'center', justifyContent: "center"}}>
                <Image
                    source={imageSource}
                    style={styles}/>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 20}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.props.navigation.goBack()}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            {this.renderDots()}
                        </View>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                                          onPress={()=>{this.onNextButtonPress()}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginEnd: 5}}>Next</Text>
                            <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView
                        innerRef={ref => {this.scroll = ref}}
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow:1}}
                        style={{flex:1, width:width}}>
                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{justifyContent:"center", alignItems: 'center', width:"80%"}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 24, marginBottom: 40}}>{'Additional business\ninfo'}</Text>
                                <View style={styles.forminputContainer}>
                                    <TextInput
                                        style={styles.inputText}
                                        value={this.props.EIN}
                                        keyboardType={'number-pad'}
                                        onChangeText={(text) => {
                                            if (this.props.EIN.length < text.length && text.length == 2) {
                                                text += '-';
                                            }
                                            this.props.propChanged(REGISTRATION056_PROP_CHANGED, "EIN", text);
                                        }}
                                        placeholder={'Employer Identification Number - EIN'}
                                        placeholderTextColor={'#9A9A9A'}
                                        maxLength={10}
                                        scrollEnabled={false}/>
                                </View>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 24, marginTop: 40}}>{'Preferred payment\nmethod'}</Text>
                            </View>
                            <View style={{alignSelf: 'center', marginTop: 50}}>
                                {this.renderRadioButtons()}
                            </View>
                            <Text style={{fontFamily: 'HelveticaNeue-Roman', textAlign: 'center', fontSize: 14, marginTop: 40}}>
                                {'*To user ACH as your preferred payment\nmethod, you need to verify it using our\nthird party payment provider Plaid'}
                            </Text>
                        </View>
                        <View style={{flex:1}}/>
                        <View style={styles.navigationButtonsContainer}>
                            <TouchableOpacity
                                style={styles.navigationButton}
                                onPress={()=>{this.onNextButtonPress()}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Next</Text>
                            </TouchableOpacity>
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
        marginTop: 30,
        marginBottom: 70
    },
    navigationButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 10,
        height: 55,
        width: '100%',
    },
    selectImage:{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 120,
        marginTop: 30,
        marginBottom: 90,
        width: '50%',
        backgroundColor:'#00000000',
        borderWidth: 1
    },
    forminputContainer: {
        height: 40,
        borderBottomColor: '#000000',
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

const mapStateToProps = ({Registration056State}) => {
    const {loading, EIN, radioOptions, icon, selectedIndex, isConnected} = Registration056State;
    return {loading, EIN, radioOptions, icon, selectedIndex, isConnected};
};

export default connect(mapStateToProps, {Registration0532_Api_Call, Registration0561_Api_Call, propChanged, propsClear})(Registration056)