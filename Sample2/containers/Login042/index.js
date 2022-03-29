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
    ScrollView,
} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import RNPasswordStrengthMeter from 'react-native-password-strength-meter';
import { connect } from 'react-redux'
import {
    LOGIN042_PROP_CHANGED,
    LOGIN042_PROP_CLEAR,
    Login0421_Api_Call,
    REGISTRATION050_PROP_CHANGED
} from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
const {height, width} = Dimensions.get('window');
const showEye = require('../../assets/icons/show_password.png')
const hideEye = require('../../assets/icons/hide_password.png')
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LoginORSignUp020'})],
});

class Login042 extends Component {

    componentDidMount(){
        this.checkInternet();
    }

    componentWillUnmount(){
        this.props.propsClear(LOGIN042_PROP_CLEAR)
    }

    checkInternet() {
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(LOGIN042_PROP_CHANGED, "isConnected", state.isConnected);
        });
        subscribe();
    }

    onResetPassword(){
        if (!this.checkFields()) {
            return false;
        } else {
            if(this.props.isConnected){
                this.props.propChanged(LOGIN042_PROP_CHANGED, "loading", true);
                const {Login0421_Api_Call} = this.props;
                Login0421_Api_Call(
                    {
                        password: this.props.password,
                    },
                    this.onSuccess,
                    this.onError
                );
            } else {alert('Please check your internet')}
        }
    }

    onSuccess = (response)=> {
        if(response){
            this.props.propChanged(LOGIN042_PROP_CHANGED, "loading", false);
            this.props.navigation.dispatch(resetAction);
        }
    }

    onError = (error) => {
        this.props.propChanged(LOGIN042_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        }
        if(errors.length > 0)
            alert(errors)
    }

    checkFields() {
        if (this.props.password === "") {
            alert("Password field is required");
            return false;
        } else if (this.props.repeatPassowrd === "") {
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
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                onPress={()=>{
                                    this.props.navigation.dispatch(resetAction);
                                }}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView 
                        contentContainerStyle={{flexGrow:1, justifyContent:"flex-start", alignItems: 'center', width:width}}>
                        <View style={{flexGrow:1, justifyContent:"center", alignItems: 'center', width:"80%", marginTop: 100}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 24, marginBottom: 20}}>{'Enter your new\npassword for your\naccount'}</Text>
                            <View style={[styles.forminputContainer,{borderBottomWidth: 0}]}>
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
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity 
                                    style={styles.navigationButton}
                                    onPress={()=>{this.onResetPassword()}}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Reset password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
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
        marginTop: 50,
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

const mapStateToProps = ({Login042State}) => {
    const {loading, password, showPassword, repeatPassowrd, showRepeatPassword, isConnected} = Login042State;
    return {loading, password, showPassword, repeatPassowrd, showRepeatPassword, isConnected};
};

export default connect(mapStateToProps, {Login0421_Api_Call, propChanged, propsClear})(Login042)
