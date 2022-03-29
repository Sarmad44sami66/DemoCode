import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import fontFamily from '../assets/fonts';
import _ from 'lodash';
const ViewAboutMe = (props) => {
    let userData = props.userProfile?.sport[0];
    console.log('my sport==>',JSON.stringify(props?.userProfile))
    
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <Text style={styles.allAboutText}>About Me</Text>
                    {_.isNil(userData) !== true && <View style={styles.rowView}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.blueTextStyle}>Sport</Text>
                            <Text style={styles.grayTextStyle}>{userData?.SportName}</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.blueTextStyle}>Primary Position</Text>
                            <Text style={styles.grayTextStyle}>{userData?.primaryPositionName}</Text>
                        </View>
                    </View>}
                   {_.isNil(userData) !== true && <View style={styles.rowView}>
                    {<View style={{ width: '50%' }}>
                            <Text style={styles.blueTextStyle}>Weight(kg)</Text>
                            <Text style={styles.grayTextStyle}>{userData?.weight}</Text>
                        </View>}
                       {<View style={{ width: '50%' }}>
                            <Text style={styles.blueTextStyle}>Height(Cm)</Text>
                            <Text style={styles.grayTextStyle}>{userData?.height !== null ? userData?.height : ''}</Text>
                        </View>}
                    </View>}
                   {_.isNil(userData) !== true && <View style={styles.rowView}>
                    </View>}
                    {_.isNil(userData) !== true && <View style={{ marginHorizontal: 20,marginBottom: 20 }}>
                        <Text style={styles.blueTextStyle}>Notable Info / Sporting Achievement</Text>
                        <Text style={styles.grayTextStyle}>{userData?.notableInfo}</Text>
                    </View>}
                </SafeAreaView>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.appWhite,
        // paddingLeft: 15,
        // paddingRight: 15
    },
    allAboutText: {
        fontSize: 20,
        color: COLORS.appTitleBlue,
        marginTop: 20,
        fontFamily: fontFamily.PoppinsBold,
        marginLeft: 20
    },
    rowView: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 8
    },
    blueTextStyle: {
        color: COLORS.appLightBlue,
        fontFamily: fontFamily.PoppinsMedium,
        fontSize: 14
    },
    grayTextStyle: {
        color: COLORS.appAccentGreyDark,
        fontFamily: fontFamily.PoppinsLight,
        fontSize: 14
    }

});
export default ViewAboutMe;