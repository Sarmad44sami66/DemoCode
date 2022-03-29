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
    Keyboard,Alert
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { connect } from 'react-redux'
import { LOGIN041_PROP_CHANGED, LOGIN041_PROP_CLEAR, Login0411_Api_Call} from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
const {height, width} = Dimensions.get('window');

class Login041 extends Component {

    componentDidMount(){
        this.checkInternet();
    }

    componentWillUnmount(){
        this.props.propsClear(LOGIN041_PROP_CLEAR)
    }

    checkInternet() {    
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(LOGIN041_PROP_CHANGED, "isConnected", state.isConnected);
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
        } else {
            return true;
        }
    }

    onResetPassword() {
        Keyboard.dismiss();
        if (!this.validateForm()) {
            return false;
        } else {
            if(this.props.isConnected){
                this.props.propChanged(LOGIN041_PROP_CHANGED, "loading", true);
                const {Login0411_Api_Call} = this.props;
                Login0411_Api_Call(
                    { 
                        email: this.props.email,
                    },
                    this.onSuccess,
                    this.onError
                );
            } else {alert('Please check your internet')}
        }
    }

    onSuccess = (response)=> {
        if(response.email){
            this.props.propChanged(LOGIN041_PROP_CHANGED, "loading", false);
            this.props.navigation.goBack()
        }
    }

    onError = (error) => {
        this.props.propChanged(LOGIN041_PROP_CHANGED, "loading", false);
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

    renderMainText() {
        return (
            <Text style={{
                fontFamily: 'HelveticaNeue-Medium',
                color: 'black',
                fontSize: 24,
                marginTop: 20,
                fontWeight: '600',
                textAlign: 'center',
                lineHeight: 30
            }}>
                {'To reset your password,\nplease enter your email\naddress'}
            </Text>
        )
    }

    renderForm() {
        return (
            <View style={{marginTop: 60, width: '80%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.forminputContainer}>
                    <TextInput
                        style={styles.inputText}
                        value={this.props.email}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                            this.props.propChanged(LOGIN041_PROP_CHANGED, "email", text);
                        }}
                        placeholder={'Email address'}
                        placeholderTextColor={'#7d7d7d'}
                        scrollEnabled={false}/>
                </View>
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
                    </View>
                    <View style={{flex: 1}}>
                        <KeyboardAwareScrollView
                            innerRef={ref => {this.scroll = ref}}
                            keyboardShouldPersistTaps='handled'
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{flexGrow:1}}
                            style={{flex:1, width:width}}>
                            <View style={{flex:1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                {this.renderMainText()}
                                {this.renderForm()}
                                <View style={{flexGrow:1}}/>
                                <View style={styles.navigationButtonsContainer}>
                                    <TouchableOpacity
                                        style={styles.navigationButton}
                                        onPress={() => {
                                            this.onResetPassword()
                                        }}>
                                        <Text style={{
                                            fontFamily: 'HelveticaNeue-Light',
                                            fontSize: 16,
                                            color: '#fff'
                                        }}>Reset password</Text>
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

const mapStateToProps = ({Login041State}) => {
    const {loading, email, isConnected} = Login041State;
    return {loading, email, isConnected};
};

export default connect(mapStateToProps, {Login0411_Api_Call, propChanged, propsClear})(Login041)