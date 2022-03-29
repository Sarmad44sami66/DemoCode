import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions, Linking } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import StarRating from 'react-native-star-rating';
import SFButton from '../components/SFButton';
import { CheckBox } from 'native-base'
import fontFamily from '../assets/fonts';

const UniversityNoticeBoard = (props) => {
    let NoticeBoardList = props.universityDetail;
    console.log('my uni board data====>',NoticeBoardList)


    const renderAccordianItem = ({ item, index }) => {
        return (
            <View
                style={{ marginBottom: 20 }}
            // activeOpacity={1}
            // style={styles.itemStyle}
            // onPress={() => { setActiveIndex(index) }}
            >
                <View style={{ marginHorizontal: 20 }}>

                    <Text style={styles.titleStyle}>{item.title}</Text>
                    {/* <TouchableOpacity onPress={() => {Linking.openURL(item.apply_link)}}>
                        <Text style={styles.titleLinkStyle}>{item.apply_link}</Text>
                    </TouchableOpacity> */}
                    <Text style={styles.descriptionStyle}>{item.description}</Text>
                </View>
            </View >
        );
    };

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            {!!NoticeBoardList && <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
            // contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <Text style={styles.sportHeading}>Notice Board</Text>
                    <FlatList
                        data={NoticeBoardList}
                        renderItem={renderAccordianItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ width: '100%' }}
                        bounces={false}
                        keyboardShouldPersistTaps={'handled'}
                    />
                </SafeAreaView>
            </KeyboardAwareScrollView>}
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.appWhite,
        // paddingLeft: 15,
        // paddingRight: 15
    },
    sportHeading: {
        fontSize: 18,
        color: '#111440',
        fontFamily: fontFamily.PoppinsBold,
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    descriptionText: {
        padding: 20,
        paddingTop: 0,
        color: '#979797',
        fontFamily: fontFamily.PoppinsRegular
    },
    itemContainer: {
        flexDirection: 'row',
        width: '100%',
        padding: 19
    },
    titleStyle: {
        fontSize: 16,
        fontFamily: fontFamily.PoppinsBold,
        color: '#979797',
    },
    descriptionStyle: {
        fontSize: 16,
        fontFamily: fontFamily.PoppinsRegular,
        color: '#979797',
    },
    titleLinkStyle: {
        fontSize: 16,
        fontFamily: fontFamily.PoppinsRegular,
        color: COLORS.appAccentBlue,
        textDecorationLine: 'underline'
    },
})

export default UniversityNoticeBoard;