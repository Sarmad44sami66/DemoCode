import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    StatusBar,
    Platform
} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const uniqueId = DeviceInfo.getUniqueId();
const brand = DeviceInfo.getBrand();
const model = DeviceInfo.getModel();
const {height, width} = Dimensions.get('window');

const resetActionToLogin = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LoginORSignUp020'})],
});
const resetActionToHome = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'MainButtomTab'})],//MainButtomTab
});
export default class SplashScreen010 extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('light-content');
        StatusBar.setBackgroundColor('#50555B');
        console.disableYellowBox = true;
        this.state = {
            loading: false,
        }
        OneSignal.init("ZTBjNzJhNDMtN2Q0YS00MzQ0LTg3NGMtNDAwOTlkYzAyYzJl");

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
    }

    onIds(device) {
        console.log('Device info: ', device);
        Preference.set(mystorage.ONESIGNAL_USER_ID, device.userId);
        Preference.set(mystorage.NOTIF_TOKEN, device.pushToken);
        //Preference.set(mystorage.NOTIF_TOKEN, '81e1a1c6b4aaf4d59c18c8e0c6d51b9e96d7262fdd74c7c2ac5aaf5812028910');
        Preference.set(mystorage.DEVICE_UNIQUE_ID, uniqueId);
        Preference.set(mystorage.DEVICE_BRAND, brand);
        Preference.set(mystorage.DEVICE_MODEL, model);
    }

    componentWillMount(){
        if(Platform.OS == 'ios'){
            if (Preference.get(mystorage.IS_LOGGED_IN))
                this.props.navigation.dispatch(resetActionToHome);
            else
                this.props.navigation.dispatch(resetActionToLogin);
        }
    }

    componentDidMount() {
        if(Platform.OS == 'android'){
            setTimeout(() => {
                if (Preference.get(mystorage.IS_LOGGED_IN))
                    this.props.navigation.dispatch(resetActionToHome);
                else
                    this.props.navigation.dispatch(resetActionToLogin);
            }, 3000)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoTextContainer}>
                    <Image source={require('../../assets/images/logo_white.png')} style={styles.logo}/>
                </View>
                <Text style={styles.versionTextStyle}>
                    {'Build Version: 4.5\nDate: 19-02-2020'}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        backgroundColor: "#50555B",
        alignItems: 'center',
        justifyContent: "center",
    },
    logoTextContainer: {
        width: '75%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        resizeMode: 'contain',
        width: '100%',
    },
    versionTextStyle: {
        width: '100%',
        textAlign: 'center',
        position: 'absolute',
        bottom: 20,
        fontFamily: 'HelveticaNeue-Medium',
        color: '#ffffff60',
        fontSize: 12,
    }
});

