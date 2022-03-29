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
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { REGISTRATION051_PROP_CHANGED, REGISTRATION051_PROP_CLEAR, Registration0511_Api_Call, Registration0512_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const {height, width} = Dimensions.get('window');

class Registration051 extends Component {

    componentDidMount(){
        this.checkInternet(this.verificationEmailAPICall);
        console.log(
            "\n\n\nUSER_ID: " + Preference.get(mystorage.USER_ID) +
            "\nNOTIF_TOKEN: " + Preference.get(mystorage.NOTIF_TOKEN) +
            "\nONESIGNAL_USER_ID: " + Preference.get(mystorage.ONESIGNAL_USER_ID) +
            "\nDEVICE_BRAND: " + Preference.get(mystorage.DEVICE_BRAND) +
            "\nDEVICE_MODEL: " + Preference.get(mystorage.DEVICE_MODEL) +
            "\nDEVICE_UNIQUE_ID: " + Preference.get(mystorage.DEVICE_UNIQUE_ID) +
            "\nSER_EMAIL: " + Preference.get(mystorage.USER_EMAIL)
        )
    }

    checkInternet(callback = null) {    
        const subscribe = NetInfo.addEventListener(state => {
            console.log("subscribe Connection type", state.type);
            console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(REGISTRATION051_PROP_CHANGED, "isConnected", state.isConnected);             
            if(callback && typeof callback == 'function'){
                setTimeout(()=>{
                    callback()
                },500)
            }
        });
        subscribe();
    }

    componentWillUnmount(){
        this.props.propsClear(REGISTRATION051_PROP_CLEAR)
    }

    verificationEmailAPICall = () => {
        this.props.propChanged(REGISTRATION051_PROP_CHANGED, "loading", true);
        if(this.props.isConnected){
            var details = {
                email: Preference.get(mystorage.USER_EMAIL),
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            const {Registration0511_Api_Call} = this.props;
            Registration0511_Api_Call(
                formBody,
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response) => {
        this.props.propChanged(REGISTRATION051_PROP_CHANGED, "loading", false);
        if (response.code) {
            console.log("\n\n\n\nCode: " + response.code);
            //alert('Varification has been sent to your email.')
        }
    }
    onError = (error) => {
        console.log('Error: ' + JSON.stringify(error))
        this.props.propChanged(REGISTRATION051_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        }
        if(errors.length > 0)
            alert(errors);
        else alert(error)
    }

    onTextLengthCompleted(text){
        this.props.propChanged(REGISTRATION051_PROP_CHANGED, "loading", true);
        console.log("\n\n\n\nCode: " + text)
        var details = {
            code: text
        };
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        const {Registration0512_Api_Call} = this.props;
        Registration0512_Api_Call(
            formBody,
            onSuccess = (response)=> {
                this.props.propChanged(REGISTRATION051_PROP_CHANGED, "loading", false)
                console.log('\n\nCode is valid: ' + JSON.stringify(response.code_is_valid));
                if(response.code_is_valid){
                    this.props.navigation.navigate('Registration052')
                } else { 
                    this.props.propChanged(REGISTRATION051_PROP_CHANGED, "inputCode", '');
                    alert('Code is not valid.') 
                }
            },
            onError = (error) => {
                this.props.propChanged(REGISTRATION051_PROP_CHANGED, "loading", false);
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

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 30}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.props.navigation.goBack()}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{justifyContent:"center", alignItems: 'center', width:width}}>
                        <View style={{justifyContent:"center", alignItems: 'center', width:"80%"}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 24, marginBottom: 40}}>{'We have sent you\nan email with the\nverification code'}</Text>
                            <View style={styles.forminputContainer}>
                                <TextInput
                                    style={styles.inputText}
                                    value={this.props.inputCode}
                                    keyboardType={'number-pad'}
                                    onChangeText={(text) => {
                                        this.props.propChanged(REGISTRATION051_PROP_CHANGED, "inputCode", text);
                                        if(text.length == 4) {
                                            this.onTextLengthCompleted(text);
                                        }
                                    }}
                                    maxLength={4}
                                    placeholder={'Enter verification code'}
                                    placeholderTextColor={'#9A9A9A'}
                                    scrollEnabled={false}/>
                            </View>
                            <TouchableOpacity style={{width: 200, height: 20, marginTop: 20}}
                                              onPress={()=>{
                                                this.verificationEmailAPICall();
                                              }}>
                                <Text style={{fontFamily: 'HelveticaNeue-Roman', color:'#000', textAlign: 'center', fontSize: 16}}>Resend email</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        alignItems: 'center',
        justifyContent: "flex-start",
    },
    forminputContainer: {
        width: "90%",
        height: 38,
        borderBottomColor: '#4d4d4d',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 20
    },
    inputText:{
        fontSize: 17,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
        width: '90%' ,
        height:40,
        paddingBottom:2,
    },
});

const mapStateToProps = ({Registration051State}) => {
    const {loading, inputCode, isConnected} = Registration051State;
    return {loading, inputCode, isConnected};
};

export default connect(mapStateToProps, {Registration0511_Api_Call, Registration0512_Api_Call, propChanged, propsClear})(Registration051)