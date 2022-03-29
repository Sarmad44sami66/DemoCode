
import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, FlatList, Pressable, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import AppStyles from '../utils/styles'
import UploadProfile from '../assets/images/uploadProfile.svg'
import { COLORS } from '../utils/colors';
import SFButton from '../components/SFButton';
import AppLogo from '../assets/images/AppLogoBlue.svg';
import WelcomeTick from '../assets/images/welcome_tick.svg';
import { NavigationActions } from '@react-navigation/native';
import fontFamily from '../assets/fonts';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setUserCredentials, setUserProfileImage } from '../redux/actions/userSession';

// const resetAction = NavigationActions.reset({
//     index: 0,
//     actions: [NavigationActions.navigate({ routeName: 'Main' })],
//   });

const WelcomeScreen = (props) => {
    const { navigation, route } = props;
    let userData = route.params?.userData || {};
    const dispatch = useDispatch();

    console.log("userData====>>>", userData)

    return (
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <View style={{ marginTop: 40 }}>
                    <AppLogo style={styles.logo} />
                    <WelcomeTick style={styles.welcomeTick} />
                </View>
                <Text style={styles.allAboutText}>WELCOME</Text>
                <SFButton
                    hideIcon
                    onPress={() => {
                        // navigation.replace('AppStack')
                        dispatch(setUser(userData));
                        dispatch(setUserProfileImage(userData.data.profile_picture));
                        navigation.navigate('LoginScreen')
                    }}
                    isFlat
                    style={styles.sfbutton}
                    textStyle={{ marginTop: 4, fontFamily: fontFamily.PoppinsMedium }} >
                    {'GET STARTED'}
                </SFButton>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.appWhite,
    },
    logo: {
        marginBottom: 20,
        alignSelf: "center",
    },
    welcomeTick: {
        marginBottom: 30,
        marginTop: 100,
        alignSelf: "center"
    },
    allAboutText: {
        fontSize: 25,
        color: COLORS.appTitleBlue,
        marginBottom: 20,
        fontFamily: fontFamily.PoppinsBold,
        textAlign: 'center',
    },
    sfbutton: {
        marginTop: 35,
        width: '80%',
        alignSelf: "center"
    },

});

export default WelcomeScreen;