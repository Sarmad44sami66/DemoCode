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
    Keyboard,
    Platform
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import RNPasswordStrengthMeter from 'react-native-password-strength-meter';
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { REGISTRATION050_PROP_CHANGED, REGISTRATION050_PROP_CLEAR, Registration0501_Api_Call, Registration0502_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const {height, width} = Dimensions.get('window');

const showEye = require('../../assets/icons/show_password.png')
const hideEye = require('../../assets/icons/hide_password.png')

class Registration050 extends Component {

    componentDidMount(){
        this.checkInternet();
    }

    componentWillUnmount(){
        this.props.propsClear(REGISTRATION050_PROP_CLEAR)
    }

    checkInternet() {
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(REGISTRATION050_PROP_CHANGED, "isConnected", state.isConnected);
        });
        subscribe();
    }

    renderDots() {
        const activeDot = require('../../assets/icons/dot-active.png');
        const inactiveDot = require('../../assets/icons/dot-inactive.png');
        const sizeActive = 10
        const imageActive = this.renderCarousel(activeDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        const imageInactive = this.renderCarousel(inactiveDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {imageActive}
                {imageInactive}
                {imageInactive}
                {imageInactive}
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

    onSuccess = (response) => {
        if (response.key && response.key.length > 0) {
            console.log('TokenKey: ' + JSON.stringify(response.key));
            Preference.set(mystorage.USER_EMAIL, this.props.email)
            Preference.set(mystorage.DATA_OBJECT, response)
            var details = {
                unique_id: Preference.get(mystorage.DEVICE_UNIQUE_ID),
                onesignal_user_id: Preference.get(mystorage.ONESIGNAL_USER_ID),
                notif_token: Preference.get(mystorage.NOTIF_TOKEN),
                brend: Preference.get(mystorage.DEVICE_BRAND),
                model: Preference.get(mystorage.DEVICE_MODEL),
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            const {Registration0502_Api_Call} = this.props;
            Registration0502_Api_Call(
                formBody,
                onSuccess = (response2)=> {
                    Preference.set(mystorage.USER_EMAIL, this.props.email)
                    console.log('\n\nOnSuccess 2nd API Response: ' + JSON.stringify(response2));
                    this.props.propChanged(REGISTRATION050_PROP_CHANGED, "loading", false);
                    this.props.navigation.navigate('Registration051')
                },
                onError = (error) => {
                    this.props.propChanged(REGISTRATION050_PROP_CHANGED, "loading", false);
                    let errors = ''
                    if(error.detail){
                        errors += error.detail + '\n'
                    } else {
                        errors += error + '\n'
                    }
                    if(errors.length > 0)
                        alert(errors)
                    else alert(error);
                }
            );
        }
    }
    onError = (error) => {
        this.props.propChanged(REGISTRATION050_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.username){
            errors += error.username[0] + '\n'
        }
        if(error.email){
            errors += error.email[0] + '\n'
        }
        if(error.password1){
            errors += error.password1[0] + '\n'
        }
        if(error.non_field_errors){
            errors += error.non_field_errors[0] + '\n'
        }
        if(errors.length > 0)
            alert(errors)
        else alert(error);
    }

    onNextButtonPress(){
        if (!this.checkFields()) {
            return false;
        } else {
            console.log("isConnected: " + this.props.isConnected)
            if(this.props.isConnected){
                this.props.propChanged(REGISTRATION050_PROP_CHANGED, "loading", true);
                const {Registration0501_Api_Call} = this.props;
                Registration0501_Api_Call(
                    {
                        username: this.props.email,
                        email: this.props.email,
                        password1: this.props.password,
                        password2: this.props.repeatPassowrd,
                        form: 'Employer'
                    },
                    this.onSuccess,
                    this.onError
                );
            } else {alert('Please check your internet')}
        }
        Keyboard.dismiss();
    }

    checkFields() {
        if (this.props.email === "") {
            alert("Email field is required");
            return false;
        } else if ((/^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/).test(this.props.email) == false) {
            alert("Invalid Email Format");
            return false;
        } else if (this.props.password === "") {
            alert("Password field is required");
            return false;
        }
        // else if (!this.validatePassword(this.props.password)) {
        //     alert("A password should have at least 6 characters, a capital letter as the first letter and a number");
        //     return false;
        // }
        else if (this.props.repeatPassowrd === "") {
            alert("Confirm password field is required");
            return false;
        } else if (!(this.props.password === this.props.repeatPassowrd)) {
            alert("Confirm password not match");
            return false;
        } else
            return true;
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 30}}>
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.props.navigation.navigate('LoginORSignUp020')}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            {this.renderDots()}
                        </View>
                        <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
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
                        <View style={{flex:1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{justifyContent:"center", alignItems: 'center', width:"80%"}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 24, marginBottom: 60}}>{'Create your\nHireApp account:'}</Text>
                                <View style={styles.forminputContainer}>
                                    <TextInput
                                        style={styles.inputText}
                                        value={this.props.email}
                                        autoCapitalize={'none'}
                                        onChangeText={(text) => {
                                            const {propChanged} = this.props;
                                            propChanged(REGISTRATION050_PROP_CHANGED, "email", text.split(' ').join(''));
                                        }}
                                        placeholder={'Enter email address'}
                                        placeholderTextColor={'#9A9A9A'}
                                        scrollEnabled={false}/>
                                </View>
                                <View style={[styles.forminputContainer,{borderBottomWidth: 0, marginTop: Platform.OS == 'ios' ? 25 : 20}]}>
                                    <RNPasswordStrengthMeter
                                        containerWrapperStyle={styles.containerWrapperStyle}
                                        inputWrapperStyle={styles.inputWrapperStyle}
                                        wrapperStyle={{width: "100%"}}
                                        barContainerStyle={{width: 200}}
                                        barStyle={{width: 200}}
                                        imageWrapperStyle={styles.imageWrapperStyle}
                                        imageStyle={styles.InputIcon}
                                        inputStyle={styles.inputText}
                                        value={this.props.password}
                                        inputProps={{
                                            placeholder: 'Password',
                                            placeholderTextColor: '#9A9A9A',
                                            scrollEnabled: false,
                                            secureTextEntry: this.props.showPassword,
                                        }}
                                        passwordProps={{
                                            width: width*0.8,
                                            wrapperStyle:{
                                                width: "100%",
                                                alignItems: 'center',
                                            },
                                        }}
                                        onChangeText={(text) => {
                                            const {propChanged} = this.props;
                                            propChanged(REGISTRATION050_PROP_CHANGED, "password", text);
                                        }}
                                        meterType="bar"
                                    />
                                </View>
                                <View style={[styles.forminputContainer,{borderBottomWidth: 0, marginTop:10}]}>
                                    <RNPasswordStrengthMeter
                                        containerWrapperStyle={styles.containerWrapperStyle}
                                        inputWrapperStyle={styles.inputWrapperStyle}
                                        wrapperStyle={{width: "100%"}}
                                        barContainerStyle={{width: 200}}
                                        barStyle={{width: 200}}
                                        imageWrapperStyle={styles.imageWrapperStyle}
                                        imageStyle={styles.InputIcon}
                                        inputStyle={styles.inputText}
                                        value={this.props.repeatPassowrd}
                                        inputProps={{
                                            placeholder:'Repeat password',
                                            placeholderTextColor: '#9A9A9A',
                                            scrollEnabled:false,
                                            secureTextEntry: this.props.showRepeatPassword,
                                        }}
                                        passwordProps={{
                                            width: width*0.8,
                                            wrapperStyle:{
                                                width: "100%",
                                                alignItems: 'center',
                                            },
                                        }}
                                        onChangeText={(text) => {
                                            const {propChanged} = this.props;
                                            propChanged(REGISTRATION050_PROP_CHANGED, "repeatPassowrd", text);
                                        }}
                                        meterType="bar"
                                    />
                                </View>
                                <Text style={{color:'#000', textAlign: 'center', fontSize: 16, width:270, marginTop: 100, lineHeight:22}}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light'}}>{'By creating an account you\nagree to HireApp\'s '}</Text>
                                    <Text style={{fontFamily: 'HelveticaNeue-Bold', }} onPress={() => {this.props.navigation.navigate('Terms060')}}>{'Terms of\nService'}</Text>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light',}}>{' and '}</Text>
                                    <Text style={{fontFamily: 'HelveticaNeue-Bold', }} onPress={() => {this.props.navigation.navigate('Terms061')}}>{'Privacy Policy'}</Text>
                                </Text>
                            </View>
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity 
                                    style={styles.navigationButton}
                                    onPress={()=>{this.onNextButtonPress()}}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Next</Text>
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
        alignItems: 'center',
        justifyContent: "flex-start",
    },
    navigationButtonsContainer:{
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 70,
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
        width: "100%",
        flexDirection: 'row',
        borderBottomColor: '#4d4d4d',
        borderBottomWidth: 1,
        // backgroundColor: 'gray'
    },
    containerWrapperStyle: {
        alignItems: 'center',
        width: "100%",
        marginVertical: 0,
        height: 60
    },
    inputWrapperStyle:  {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#4d4d4d',
        paddingBottom: 5,
        marginVertical: 5,
        marginHorizontal: 10,
        paddingRight: 30,
    },
    inputText:{
        fontSize: 18,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
        width: '90%' ,
    },
    imageWrapperStyle: {
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    InputIcon: {
        resizeMode: 'contain',
        width: '80%',
        height: '80%',
        marginRight: 5
    },
});

const mapStateToProps = ({Registration050State}) => {
    const {loading, email, password, showPassword, repeatPassowrd, showRepeatPassword, isConnected} = Registration050State;
    return {loading, email, password, showPassword, repeatPassowrd, showRepeatPassword, isConnected};
};

export default connect(mapStateToProps, {Registration0501_Api_Call, Registration0502_Api_Call, propChanged, propsClear})(Registration050)

