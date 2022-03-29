// Post Login Stack

import React, { useState } from 'react'
import { Image, Pressable, View } from 'react-native'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../utils/colors';
import HomeIcon from '../assets/images/home.svg'
import SearchIcon from '../assets/images/search.svg'
import FavouriteIcon from '../assets/images/favourite_icon.svg'
import ProfileIcon from '../assets/images/profile_tab_icon.png'
import HomeScreen from '../screen/HomeScreen';
import SearchScreen from '../screen/SearchScreen';
import FavoriteScreen from '../screen/FavoriteScreen';
import ProfileScreen from '../screen/ProfileScreen';
import UniversityDetailScreen from '../screen/UniversityDetail';
import ClubDetail from '../screen/ClubDetail';
import AccountSetting from '../screen/AccountSetting';
import ChangeEmailAddress from '../screen/ChangeEmailAddress';
import ChangePassword from '../screen/ChangePassword';
import ViewProfile from '../screen/ViewProfile';
import ViewAboutMe from '../screen/ViewAboutMe';
import ViewEducation from '../screen/ViewEducation';
import ContactUs from '../screen/ContactUs';
import PrivacyPolicy from '../screen/PrivacyPolicy';
import TermsOfUse from '../screen/TermsOfUse';
import CookiePolicy from '../screen/CookiePolicy';
import EditProfileTabs from '../screen/EditProfileTabs';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/userSession';
import AwesomeAlert from 'react-native-awesome-alerts';




const RootStack = createStackNavigator(); // Pop-ups
const MainStack = createStackNavigator(); // Normal Navigation
const Tab = createBottomTabNavigator();


function MyTabs() {
    const { profileImage, userType } = useSelector((state) => state.userSession);
    const [showAlert, setShowAlert] = useState(false)

    console.log("USER TYPE===>>", userType)
    const dispatch = useDispatch()
    console.log('my profule=======', profileImage)

    const alertFunction = () => {
        return (
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Alert"
                message="Please Login/Sign up to access this feature"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                cancelText="Login"
                confirmText='Cancel'
                cancelButtonColor={COLORS.appAccentBlue}
                confirmButtonColor={COLORS.appAccentBlue}
                showConfirmButton={true}
                onCancelPressed={
                    () => {
                        dispatch(logoutUser())
                    }
                }
                onConfirmPressed={() => {
                    setShowAlert(false)
                }}
            />
        )
    }

    return (
        <View style={{ flex: 1, height: 500 }}>
            <Tab.Navigator
                initialRouteName={'Home'}
                tabBarOptions={{
                    activeTintColor: '#FFFFFF',
                    showLabel: false,
                    inactiveTintColor: COLORS.appAccentBlue,
                    keyboardHidesTabBar: true,
                    style: {
                        padding: 7,
                        // height: isIphoneX() ? 82 : 55,
                        // paddingBottom: isIphoneX() ? 22 : 5,
                        backgroundColor: COLORS.appWhite,
                        // borderTopColor: '#DCDDDF',
                        // borderTopWidth: 1,
                    },
                }}
                screenOptions={({ route, navigation }) => ({
                    tabBarIcon: ({ focused }) => {
                        if (route.name === 'Home') {
                            if (focused) {
                                return <View style={{ backgroundColor: COLORS.appAccentBlue, height: 55, width: '100%', justifyContent: 'center' }}>
                                    <HomeIcon style={{ alignSelf: "center" }} />
                                </View>
                            }
                            else {
                                return <View style={{}}>
                                    <Image source={require('../assets/images/home.png')} style={{ width: 30, height: 30, resizeMode: 'contain', alignSelf: "center" }} />
                                </View>
                            }

                        }
                        if (route.name === 'SearchScreen') {
                            if (focused) {
                                return <View style={{ backgroundColor: COLORS.appAccentBlue, height: 55, width: '100%', justifyContent: 'center' }}>
                                    <Image source={require('../assets/images/search.png')} style={{ width: 30, height: 30, resizeMode: 'contain', alignSelf: "center" }} />
                                </View>
                            }
                            else {
                                return <View style={{}}>
                                    <SearchIcon />
                                </View>
                            }
                        }
                        if (route.name === 'FavoriteScreen') {
                            return (
                                <Pressable
                                    style={{ width: '100%', height: 55, alignItems: 'center', justifyContent: 'center',backgroundColor: focused ? COLORS.appAccentBlue : 'transparent' }}
                                    onPress={() => {
                                        console.log('ads')
                                        if (userType) setShowAlert(true)
                                        else navigation.navigate('FavoriteScreen')
                                    }}>
                                    {focused ?
                                        <Image source={require('../assets/images/favourite_icon.png')} style={{ width: 30, height: 55, resizeMode: 'contain', alignSelf: "center",  }} />
                                        :
                                        <FavouriteIcon />
                                    }
                                </Pressable>
                            )
                        }


                        if (route.name === 'ViewProfile') {
                            return (
                                <Pressable
                                    style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => {
                                        console.log('ads')
                                        if (userType) setShowAlert(true)
                                        else navigation.navigate('ViewProfile')
                                    }}>
                                    {focused ?
                                        <View style={{ backgroundColor: COLORS.appAccentBlue, height: 55, width: '100%', justifyContent: 'center' }}>
                                            <Image source={(profileImage === '' || profileImage === undefined || profileImage === null) ? require('../assets/images/default_profile_picturejpg.jpg') : { uri: profileImage }} style={{ width: 40, height: 40, alignSelf: "center", borderRadius: 60, resizeMode: 'cover' }} />
                                        </View>
                                        :
                                        <View style={{}}>
                                            <Image source={(profileImage === '' || profileImage === undefined || profileImage === null) ? require('../assets/images/default_profile_picturejpg.jpg') : { uri: profileImage }} style={{ width: 40, height: 40, alignSelf: "center", borderRadius: 60, resizeMode: 'cover' }} />
                                        </View>
                                    }
                                </Pressable>
                            )
                        }

                    },
                })}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="SearchScreen" component={SearchScreen} />
                <Tab.Screen
                    name="FavoriteScreen"
                    component={FavoriteScreen}
                />
                <Tab.Screen
                    name="ViewProfile"
                    component={ViewProfile}
                />
            </Tab.Navigator>
            {alertFunction()}
        </View>
    );
}

function MainStackScreen() {

    return (
        <MainStack.Navigator initialRouteName={'HomeScreen'}
            screenOptions={{
                gestureEnabled: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <MainStack.Screen
                name='HomeScreen'
                component={MyTabs}
                options={{ headerShown: false }} />
            <MainStack.Screen
                name='AccountSetting'
                component={AccountSetting}
                options={{ headerShown: false }} />
            <MainStack.Screen
                name='ChangeEmailAddress'
                component={ChangeEmailAddress}
                options={{ headerShown: false }} />
            <MainStack.Screen
                name='ChangePassword'
                component={ChangePassword}
                options={{ headerShown: false }} />
            {/* <MainStack.Screen
                name='ViewProfile'
                component={ViewProfile}
                options={{ headerShown: false }} /> */}
            <MainStack.Screen
                name='ViewAboutMe'
                component={ViewAboutMe}
                options={{ headerShown: false }} />
            <MainStack.Screen
                name='ViewEducation'
                component={ViewEducation}
                name='ContactUs'
                component={ContactUs}
                options={{ headerShown: false }} />
            <MainStack.Screen
                name='EditProfileTabs'
                component={EditProfileTabs}
                options={{ headerShown: false }} />
            <MainStack.Screen
                name='ProfileScreen'
                component={ProfileScreen}
                options={{ headerShown: false }} />
            <MainStack.Screen
                name='PrivacyPolicy'
                component={PrivacyPolicy}
                options={{ headerShown: false }} />
            <MainStack.Screen
                name='TermsOfUse'
                component={TermsOfUse}
                options={{ headerShown: false }} />
            <MainStack.Screen
                name='CookiePolicy'
                component={CookiePolicy}
                options={{ headerShown: false }} />
        </MainStack.Navigator>
    );
}

function AppStack() {
    return (
        <RootStack.Navigator mode="modal">
            <RootStack.Screen
                name="Main"
                component={MainStackScreen}
                options={{ headerShown: false }} />
            <RootStack.Screen
                name="UniversityDetailScreen"
                component={UniversityDetailScreen}
                options={{ headerShown: false }} />
            <RootStack.Screen
                name="ClubDetail"
                component={ClubDetail}
                options={{ headerShown: false }} />
        </RootStack.Navigator>
    );
}

export default AppStack;