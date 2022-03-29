import React from 'react';
import {StyleSheet, Image} from "react-native";
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import SplashScreen010 from './containers/SplashScreen010';
import LoginORSignUp020 from "./containers/LoginORSignUp020";
import Tutorial030 from "./containers/Tutorial030";
import Login040 from './containers/Login040';
import Login041 from './containers/Login041';
import Login042 from "./containers/Login042";
import Registration050 from "./containers/Registration050";
import Registration051 from "./containers/Registration051";
import Registration052 from './containers/Registration052';
import Registration053 from './containers/Registration053';
import Registration054 from "./containers/Registration054";
import Registration056 from "./containers/Registration056";
import Registration057 from "./containers/Registration057";
import Registration058 from "./containers/Registration058";
import Registration059 from "./containers/Registration059";
import Terms060 from "./containers/Terms060";
import Terms061 from "./containers/Terms061";
import NewShift070 from "./containers/NewShift070";
import NewShift072 from "./containers/NewShift072";
import NewShift073 from "./containers/NewShift073";
import NewShift074 from "./containers/NewShift074";
import NewShift075 from "./containers/NewShift075";
import NewShift076 from "./containers/NewShift076";
import NewShift077 from "./containers/NewShift077";
import NewShift078 from "./containers/NewShift078";
import ShiftScreens500 from "./containers/ShiftsScreens500";
import ProfileScreen700 from "./containers/ProfileScreen700";
import ActivityScreen300 from "./containers/ActivityScreen300";
import PaymentScreen600 from "./containers/PaymentScreen600";

const MainButtomTab = createBottomTabNavigator(
    {
        Shifts: {
            screen: ShiftScreens500,
        },
        Profile: {
            screen: ProfileScreen700,
        },
        Activity: {
            screen: ActivityScreen300,
        },
        Payments: {
            screen: PaymentScreen600,
        },
    },
    {
        tabBarOptions: {
            showLabel: true,
            activeTintColor: '#007AFF',
            inactiveTintColor: '#929BA3',
            keyboardHidesTabBar: true,
            pressColor: 'gray',
            style: {
                backgroundColor: '#F9F8F8',
                position: 'absolute',
                height: 60,
                padding: 5,
            }
        },
        initialRouteName: "Shifts",
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                if (routeName === "Shifts") {
                    if(focused) return <Image resizeMode={"contain"} source={require('./assets/icons/clock_active.png')} style={styles.icon}/>
                    else return <Image resizeMode={"contain"} source={require('./assets/icons/clock_inactive.png')} style={styles.icon}/>
                }
                if (routeName === "Profile") {
                    if(focused) return <Image resizeMode={"contain"} source={require('./assets/icons/profile_active.png')} style={styles.icon}/>
                    else return <Image resizeMode={"contain"} source={require('./assets/icons/profile_inactive.png')} style={styles.icon}/>
                }
                if (routeName === "Activity") {
                    if(focused) return <Image resizeMode={"contain"} source={require('./assets/icons/bel_active.png')} style={styles.icon}/>
                    else return <Image resizeMode={"contain"} source={require('./assets/icons/bel_inactive.png')} style={styles.icon}/>
                }
                if (routeName === "Payments") {
                    if(focused) return <Image resizeMode={"contain"} source={require('./assets/icons/money_active.png')} style={styles.icon}/>
                    else return <Image resizeMode={"contain"} source={require('./assets/icons/money_inactive.png')} style={styles.icon}/>
                }
            },
        })
    }
);

const AppNavigator = createStackNavigator(
    {
        SplashScreen010: SplashScreen010,
        LoginORSignUp020: LoginORSignUp020,
        Tutorial030: Tutorial030,
        Login040: Login040,
        Login041: Login041,
        Login042: Login042,
        Registration050: Registration050,
        Registration051: Registration051,
        Registration052: Registration052,
        Registration053: Registration053,
        Registration054: Registration054,
        Registration056: Registration056,
        Registration057: Registration057,
        Registration057_1: Registration057,
        Registration058: Registration058,
        Registration059: Registration059,
        Terms060: Terms060,
        Terms061: Terms061,
        NewShift070: NewShift070,
        NewShift072: NewShift072,
        NewShift073: NewShift073,
        NewShift074: NewShift074,
        NewShift075: NewShift075,
        NewShift076: NewShift076,
        NewShift077: NewShift077,
        NewShift078: NewShift078,
        MainButtomTab: MainButtomTab,
    },
    {
        initialRouteName: 'SplashScreen010',
        headerMode: 'none',
    },
);

const styles = StyleSheet.create({
    icon: {height: 25, width: 25}
});

export default createAppContainer(AppNavigator);
