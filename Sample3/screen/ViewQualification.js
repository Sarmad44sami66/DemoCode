import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import EducationDegree from '../assets/images/education_degree.svg'

const ViewQualification = (props) => {
    let userQualificationList = props.userProfile.qualifications;
    const [qualificationList, setQualificationList] = useState([
        { name: 'ABOUT ME1' },
        { name: 'ABOUT ME2' },
        { name: 'ABOUT ME3' },
    ]);
    const renderQualificationList = (item, index) => {
        return(
        <View style={styles.rowView}>
            <EducationDegree style={{ marginTop: 5 }} />
            <View style={{ marginLeft: 10, }}>
                {/* <Text style={styles.blueTextStyle}>{`${item.end_date} - ${item.course} `}<Text style={{ color: '#979797', }}>{`Grade ${item.grade} , ${item.percentage}%`}</Text></Text> */}
                <Text style={styles.blueTextStyle}>{`${item.end_date} - ${item.institute_name} `}</Text>
                {/* <Text style={styles.grayTextStyle}>{`${item.university} - ${item.nationality_name}`}</Text> */}
            </View>
        </View>
        )
    }
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            <SafeAreaView style={styles.container}>
                <Text style={styles.allAboutText}>Qualification</Text>
                <View style={styles.flatListMainView}>
                    <FlatList
                        data={userQualificationList}
                        listKey={'SelectIndustriesScreen' + moment().format('x')}
                        renderItem={({ item, index }) => {
                            return renderQualificationList(item, index);
                        }}
                        showsVerticalScrollIndicator={true}
                    // contentContainerStyle={{ backgroundColor: 'red', }}
                    />
                </View>

            </SafeAreaView>
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
        fontFamily: 'Poppins-Bold',
        marginLeft: 20
    },
    rowView: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginVertical: 8,
    },
    flatListMainView: {
        width: '100%',
        height: '100%',
    },
    blueTextStyle: {
        color: COLORS.appLightBlue,
        fontFamily: 'Poppins-Medium',
        fontSize: 14
    },
    grayTextStyle: {
        color: COLORS.appAccentGreyDark,
        fontFamily: 'Poppins-Light',
        fontSize: 14
    }

});
export default ViewQualification;