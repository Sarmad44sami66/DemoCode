import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, TouchableOpacity } from 'react-native'
import Header from '../components/Header';
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ContactUsHeader from '../components/ContactUsHeader';
import fontFamily from '../assets/fonts';


const AccountSetting = (props) => {

    return (
        <View style={{ flex: 1 }}>
            <ContactUsHeader
                headerText={'Account Settings'}
                backPress={() => { props.navigation.goBack() }}
            />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <StatusBar backgroundColor={COLORS.appLightBlue} />
                <SafeAreaView style={styles.container}>
                    <Pressable onPress={() => props.navigation.navigate('ChangePassword')} style={styles.marketingView}>
                        <View style={{
                            width: '95%'
                        }}>
                            <Text style={styles.marketingText}>Change Password</Text>
                        </View>
                        <Image style={styles.forwardArrow} source={require('../assets/images/forward_arrow.png')} />
                    </Pressable>
                </SafeAreaView>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.appWhite,
        paddingBottom: 10
    },
    marketingView: {
        width: "100%",
        paddingHorizontal: 20,
        flexDirection: "row",
        height: 60,
        backgroundColor: COLORS.appWhite,
        alignItems: 'center'
    },
    marketingText: {
        color: COLORS.appAccentBlue,
        fontFamily: fontFamily.PoppinsRegular,
        fontSize: 16
    },
    forwardArrow: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        alignSelf: "center",
        tintColor: COLORS.appAccentBlue
    }
})

export default AccountSetting;