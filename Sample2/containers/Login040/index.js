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
    Alert,
    Keyboard
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { connect } from 'react-redux'
import {NavigationActions, StackActions} from "react-navigation";
import { LOGIN040_PROP_CHANGED, LOGIN040_PROP_CLEAR, Login0401_Api_Call, Login0402_Api_Call} from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainButtomTab' })],
});
const {height, width} = Dimensions.get('window');

class Login040 extends Component {

    componentDidMount(){
        this.checkInternet();
    }

    componentWillUnmount(){
        this.props.propsClear(LOGIN040_PROP_CLEAR)
    }

    checkInternet() {
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(LOGIN040_PROP_CHANGED, "isConnected", state.isConnected);
        });
        subscribe();
    }

    validateForm() {
        if (this.props.email === '') {
            alert("Email field is required");
            return false;
        } else if ((/^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/).test(this.props.email) == false) {
            alert("Invalid Email Format");
            return false;
        } else if (this.props.password === "") {
            alert("Password field is required");
            return false;
        } else if (this.props.password.length < 6) {
            alert("Password should contain at least 6 characters");
            return false;
        } else {
            return true;
        }
    }

    onLoginPressed() {
        if (!this.validateForm()) {
            return false;
        } else {
            if(this.props.isConnected){
                this.props.propChanged(LOGIN040_PROP_CHANGED, "loading", true);
                console.log("\n\n\n\n Login clicked: ")
                var details = {
                    username: this.props.email,
                    password: this.props.password,
                };
                var formBody = [];
                for (var property in details) {
                    var encodedKey = encodeURIComponent(property);
                    var encodedValue = encodeURIComponent(details[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");
                console.log("\n\n\n\nform body: " + formBody)
                const {Login0401_Api_Call} = this.props;
                Login0401_Api_Call(
                    formBody,
                    this.onSuccess,
                    this.onError
                );
            } else {alert('Please check your internet')}
        }
        Keyboard.dismiss();
    }

    onSuccess = (response) => {
        if (response.key && response.key.length > 0) {
            console.log('TokenKey: ' + JSON.stringify(response.key));
            Preference.set(mystorage.DATA_OBJECT, response)
            // let Route = 'MainButtomTab';
            // this.props.navigation.navigate(Route);
            const profile = response.profile;
            console.log('Profile: ' + JSON.stringify(response.profile));
            if(profile){
                let Route = ''
                if(!profile.email_validation_screen){
                    Route = 'Registration051';
                } else if(!profile.type_business_screen){
                    Route = 'Registration052';
                } else if(!profile.contact_info_screen){
                    Route = 'Registration053';
                } else if(!profile.business_info_screen){
                    Route = 'Registration053';
                // } else if(!profile.logo_screen){
                //     Route = 'Registration054';
                }
                if(Route === ''){
                    Preference.set(mystorage.IS_LOGGED_IN, true)
                    this.getCardInfoAPICall()
                } else {
                    this.props.propChanged(LOGIN040_PROP_CHANGED, "loading", false);
                    Alert.alert(
                        'Alert',
                        'Please complete your registration process.',
                        [
                            {text: 'Ok', onPress: () => {this.props.navigation.navigate(Route)}},
                        ],
                        {cancelable: true},
                    );
                }
            }
        }
    }
    onError = (error) => {
        this.props.propChanged(LOGIN040_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.non_field_errors){
            errors += error.non_field_errors[0] + '\n'
        }
        if(errors.length > 0)
            alert(errors)
    }

    getCardInfoAPICall = () => {
        if(this.props.isConnected){
            const {Login0402_Api_Call} = this.props;
            Login0402_Api_Call(
                onSuccess = (response) => {
                    this.props.propChanged(LOGIN040_PROP_CHANGED, "loading", false);
                    console.log("Cards: " + JSON.stringify(response.data.data[0]))
                    if(response.data){
                        Preference.set(mystorage.CARD_PRIMARY, 0)
                        Preference.set(mystorage.CARD_LIMIT, response.data.data.length);
                        Preference.set(mystorage.CARD_OBJECT, response.data.data || '');
                        Preference.set(mystorage.IS_LOGGED_IN, true);
                        this.props.navigation.dispatch(resetAction)
                    }
                },
                onError = (error) => {
                    this.props.propChanged(LOGIN040_PROP_CHANGED, "loading", false);
                    let errors = ''
                    if(error.non_field_errors){
                        errors += error.non_field_errors[0] + '\n'
                    }
                    if(errors.length > 0)
                        alert(errors)
                }
            );
        } else {alert('Please check your internet')}
    }

    renderMainText() {
        return (
            <Text style={{
                fontFamily: 'HelveticaNeue-Medium',
                color: 'black',
                fontSize: 24,
                marginTop: 2,
                fontWeight: '600',
                textAlign: 'center',
                lineHeight: 30
            }}>
                Welcome back to {`\n`} HireApp
            </Text>
        )
    }

    renderForm() {
        return (
            <View style={{marginTop: 40, width: '80%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.forminputContainer}>
                    <TextInput
                        style={styles.inputText}
                        value={this.props.email}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                            this.props.propChanged(LOGIN040_PROP_CHANGED, "email", text.split(' ').join(''));
                        }}
                        placeholder={'Email address'}
                        placeholderTextColor={'#7d7d7d'}
                        scrollEnabled={false}/>
                </View>
                <View style={styles.forminputContainer}>
                    <TextInput
                        style={styles.inputText}
                        value={this.props.password}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            this.props.propChanged(LOGIN040_PROP_CHANGED, "password", text);
                        }}
                        placeholder={'Password'}
                        placeholderTextColor={'#7d7d7d'}
                        scrollEnabled={false}/>
                </View>
                <TouchableOpacity style={{width: '100%', marginTop:25}}
                                  onPress={()=>{this.props.navigation.navigate('Login041')}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'right', fontSize: 16}}>{'Forgot password?'}</Text>
                </TouchableOpacity>
            </View>
        )
    }



    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={{
                        width: width,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        marginBottom: 30
                    }}>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            marginStart: 10
                        }}>
                            <TouchableOpacity
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                onPress={() => {
                                    this.props.navigation.goBack()
                                }}>
                                <Image source={require('../../assets/icons/back_arrow.png')}
                                       style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{
                                    fontFamily: 'HelveticaNeue-Medium',
                                    color: '#007AFF',
                                    fontSize: 17,
                                    marginStart: 5
                                }}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginEnd: 10
                        }}
                                          onPress={() => {
                                              this.onLoginPressed()
                                          }}>
                            <Text style={{
                                fontFamily: 'HelveticaNeue-Medium',
                                color: '#007AFF',
                                fontSize: 17,
                                marginEnd: 5
                            }}>Login</Text>
                            <Image source={require('../../assets/icons/next_arrow.png')}
                                   style={{resizeMode: 'contain', width: 20, height: 20}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                        <KeyboardAwareScrollView
                            innerRef={ref => {this.scroll = ref}}
                            keyboardShouldPersistTaps='handled'
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{flexGrow:1}}
                            style={{flex:1, width: width}}>
                            <View style={{flex:1, width: '100%', height: '100%', alignItems: 'center'}}>
                                {this.renderMainText()}
                                {this.renderForm()}
                                <View style={{flexGrow:1}}/>
                                <View style={styles.navigationButtonsContainer}>
                                    <TouchableOpacity
                                        style={styles.navigationButton}
                                        onPress={() => {
                                            this.onLoginPressed()
                                        }}>
                                        <Text style={{
                                            fontFamily: 'HelveticaNeue-Light',
                                            fontSize: 16,
                                            color: '#fff'
                                        }}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
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
        justifyContent: "center",
    },
    navigationButtonsContainer:{
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom:70
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
        height: 40,
        borderBottomColor: '#4d4d4d',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 10
    },
    inputText: {
        fontSize: 18,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
        width: '90%',
        height: 40,
        paddingBottom: 0,
    },
});

const mapStateToProps = ({Login040State}) => {
    const {loading, email, password, isConnected} = Login040State;
    return {loading, email, password, isConnected};
};

export default connect(mapStateToProps, {Login0401_Api_Call, Login0402_Api_Call, propChanged, propsClear})(Login040)
