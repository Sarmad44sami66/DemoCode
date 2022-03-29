// Prelogin Stack

import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import LandingScreen from '../screen/LandingScreen'
import OnBoardingScreen from '../screen/OnBoardingScreen';
import LoginScreen from '../screen/LoginScreen';
import SignupScreen from '../screen/SignupScreen';
import AllAboutScreen from '../screen/AllAboutScreen';
import WelcomeScreen from '../screen/WelcomeScreen';
import ForgotPassword from '../screen/ForgotPassword';
import OTPVerify from '../screen/OTPVerify';
import TermsOfUse from '../screen/TermsOfUse';
import { useSelector, useDispatch } from 'react-redux';
import PrivacyPolicy from '../screen/PrivacyPolicy';

const Stack = createStackNavigator();

const AuthStack = () => {
    const { isSignedIn, currentUser,userEmail,userPassword,IsBoardingVisited } = useSelector((state) => state.userSession);
    console.log('my user daata=====>',IsBoardingVisited)
    return (
        <Stack.Navigator
            initialRouteName = {IsBoardingVisited ? "LoginScreen" : "LandingScreen"}
            screenOptions = {{ cardStyle: { backgroundColor: 'white' } }}>
            <Stack.Screen
                name = 'LandingScreen'
                component = {LandingScreen}
                options = {{ headerShown:false }}/>
            <Stack.Screen
                name = 'OnBoardingScreen'
                component = {OnBoardingScreen}
                options = {{ headerShown:false }}/>
            <Stack.Screen
                name = 'LoginScreen'
                component = {LoginScreen}
                options = {{ headerShown:false }}/>
            <Stack.Screen
                name = 'SignupScreen'
                component = {SignupScreen}
                options = {{ headerShown:false }}/>
            <Stack.Screen
                name = 'AllAboutScreen'
                component = {AllAboutScreen}
                options = {{ headerShown:false }}/>
            <Stack.Screen
                name = 'WelcomeScreen'
                component = {WelcomeScreen}
                options = {{ headerShown:false }}/>
            <Stack.Screen
                name = 'ForgotPassword'
                component = {ForgotPassword}
                options = {{ headerShown:false }}/>
            <Stack.Screen
                name = 'OTPVerify'
                component = {OTPVerify}
                options = {{ headerShown:false }}/>
            <Stack.Screen
                name = 'TermsOfUse'
                component = {TermsOfUse}
                options = {{ headerShown:false }}/>
            <Stack.Screen
                name = 'PrivacyPolicy'
                component = {PrivacyPolicy}
                options = {{ headerShown:false }}/>
        </Stack.Navigator>
    )
}

export default AuthStack;