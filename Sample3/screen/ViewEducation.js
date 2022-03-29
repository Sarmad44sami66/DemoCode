import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import EducationDegree from '../assets/images/education_degree.svg'
import fontFamily from '../assets/fonts';

const ViewEducation = (props) => {
    // const { route } = props;
    // const { profileData } = route.params;
    let educationList = props.userProfile.education;

    const renderItem = (item, index) => {
        return (
            <View style={styles.rowView}>
                <EducationDegree style={{ marginTop: 5 }} />
                <View style={{ marginLeft: 10, }}>
                    <Text style={styles.blueTextStyle}>{`${item.end_date} - ${item.university_name} `}</Text>
                    {/* <Text style={styles.grayTextStyle}>{`${item.university} - ${item.university_country}`}</Text> */}
                </View>
            </View>
        )
    }
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <Text style={styles.allAboutText}>Education</Text>
                    <View>
                        <FlatList
                            data={educationList}
                            keyExtractor={(item, index) => item.label + index}
                            listKey={'SelectIndustriesScreen' + moment().format('x')}
                            removeClippedSubvisews={false}
                            renderItem={({ item, index }) => {
                                return renderItem(item, index);
                            }}
                        />
                    </View>
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
        marginHorizontal: 20,
        marginVertical: 8,
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
export default ViewEducation;