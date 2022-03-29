import React, { useState,useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList,Keyboard, Pressable, Image, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import Header from '../components/Header';
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ContactUsHeader from '../components/ContactUsHeader';
import AppStyles from '../utils/styles'
import fontFamily from '../assets/fonts';
import Loader from '../components/Loader';
import {
    forgetPasswordAPI,
} from '../api/methods/auth';
import Toast from 'react-native-simple-toast';



const ForgotPassword = (props) => {
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            setKeyboardVisible(true); // or some other action
          }
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            setKeyboardVisible(false); // or some other action
          }
        );
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
          };
        }, []);

    const [email, setEmail] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const forgetPassword = async () => {
        if (email == '') {
            Toast.show('Email Required');
            return
        }
        let formData = new FormData();
        formData.append('user_type', 'user');
        formData.append('email', email);

        setShowLoader(true);
        try {
            const response = await forgetPasswordAPI(formData);
            setShowLoader(false);
            if (JSON.stringify(response.status) == 200) {
                Toast.show(response.data.message);
                props.navigation.navigate('OTPVerify',{userEmail: email});
            } else {
                Toast.show(response.data.error.message);
            }
        } catch (error) {
            setShowLoader(false);
            Toast.show(error.response.data.error.message);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ContactUsHeader
                headerText={'Forgot Password'}
                backPress={() => { props.navigation.goBack() }}
            />

            <StatusBar backgroundColor={COLORS.appLightBlue} />
            <SafeAreaView style={styles.container}>
                <Text style={styles.allAboutText}>Change your password</Text>
                <Text style={styles.enterPasswordText}>Enter your email below linked to your Sportfolio account and we will send an email to help resolve this issue</Text>
                <Text style={styles.passwordInputText}>Email</Text>
                <TextInput style={[AppStyles.authInput, { marginTop: 0, marginHorizontal: 20 }]}
                    placeholder={'Email*'}
                    value={email}
                    onChangeText={(text) => setEmail(text.trim())}
                    placeholderTextColor={COLORS.appAccentGreyDark} />
               {! isKeyboardVisible && <View style={{ position: "absolute", bottom: 30, alignItems: "center",width:'100%' }}>
                    {/* <Pressable style={styles.marketingView}>
                        <Text style={styles.marketingText}>CANCEL</Text>
                    </Pressable> */}
                    <Pressable onPress={() => { forgetPassword() }} style={styles.marketingView2}>
                        <Text style={[styles.marketingText, { color: COLORS.appWhite }]}>CONFIRM</Text>
                    </Pressable>
                </View>}
            </SafeAreaView>
            <Loader visible={showLoader} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.appWhite,
        paddingBottom: 10
    },
    allAboutText: {
        fontSize: 18,
        color: COLORS.appTitleBlue,
        margin: 20,
        fontFamily: fontFamily.PoppinsBold,
        marginBottom: 10
    },
    enterPasswordText: {
        color: COLORS.appAccentGreyDark,
        width: '85%',
        marginLeft: 20
    },
    passwordInputText: {
        color: COLORS.appDarkBlue,
        fontFamily: fontFamily.PoppinsMedium,
        marginLeft: 20,
        fontSize: 18,
        marginTop: 20
    },
    marketingView: {
        width: "50%",
        height: 60,
        backgroundColor: COLORS.appWhite,
        borderWidth: 1,
        borderColor: COLORS.appAccentBlue,
        justifyContent: 'center'
    },
    marketingView2: {
        width: "80%",
        height: 60,
        backgroundColor: COLORS.appAccentBlue,
        justifyContent: 'center',
        borderRadius:10
    },
    marketingText: {
        color: COLORS.appAccentBlue,
        fontFamily: fontFamily.PoppinsRegular,
        fontSize: 16,
        textAlign: "center"
    },
    forwardArrow: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        alignSelf: "center",
        tintColor: COLORS.appAccentBlue
    }
})

export default ForgotPassword;