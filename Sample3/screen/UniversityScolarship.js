import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions, Linking } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import StarRating from 'react-native-star-rating';
import SFButton from '../components/SFButton';
import { CheckBox } from 'native-base'
import fontFamily from '../assets/fonts';

const UniversityScolarship = (props) => {
    let universityDetail = props.universityDetail;
    const DATA = [
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'First Item',
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'Second Item',
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
        },
    ]
    const [universityScholarShip, setUniversityScholarShip] = useState(universityDetail.university_scolarship);
    const [noteAbleAlumniList, setNoteAbleAlumni] = useState(universityDetail.notable_alumni);

    const renderAccordianItem = ({ item, index }) => {
        return (
            <View
                style={{ marginBottom: 20 }}
            // activeOpacity={1}
            // style={styles.itemStyle}
            // onPress={() => { setActiveIndex(index) }}
            >
                <View style={{ marginHorizontal: 20 }}>

                    <Text style={styles.titleStyle}>{item.name}</Text>
                    <TouchableOpacity onPress={() => {Linking.openURL(item.apply_link)}}>
                        <Text style={styles.titleLinkStyle}>{item.apply_link}</Text>
                    </TouchableOpacity>
                    <Text style={styles.descriptionStyle}>{item.details}</Text>
                </View>
            </View >
        );
    };

    const listItems = (item, index) => {
        return (
            <View style={styles.itemContainer}>
                <Image
                    source={{uri: item.profile_image}}
                    style={{ width: 56, height: 56, resizeMode: 'cover', borderRadius: 5 }} />
                <View style={{ marginLeft: 13 }}>
                    <Text style={{ color: '#979797', fontFamily: fontFamily.PoppinsMedium, fontSize: 12, }}>{`${item.first_name} ${item.last_name}`}</Text>
                    <Text style={{ color: '#979797', fontFamily: fontFamily.PoppinsRegular, fontSize: 12, }}>{'Swimming'}</Text>
                    <Text style={{ color: '#21287F', fontFamily: fontFamily.PoppinsSemiBold, fontSize: 12, }}>{`${item.achievement} ${item.year}`}</Text>
                </View>
            </View>
        )

    }
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            {!!universityDetail && <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
            // contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <Text style={styles.sportHeading}>Scholarships</Text>
                    <FlatList
                        data={universityScholarShip}
                        renderItem={renderAccordianItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ width: '100%' }}
                        bounces={false}
                        keyboardShouldPersistTaps={'handled'}
                    />
                    {/* <Text style={styles.descriptionText}>UK Sports University of the Year 2020 from the times and Sunday times. and Scotland’s University for Sporting Excellence . New 20 million sports facility opening this year. Provide the University international scholarship programme which is one of the largest high performance sports programmes in the UK. Ipsem ad llorem Ipsem ad lloremIpsem ad lloremIpsem ad lloremIpsem ad lloremIpsem ad lloremIpsem ad lloremIpsem ad llorem</Text> */}
                    {/* <View style={{ backgroundColor: '#707070', height: 1, width: '100%' }} /> */}
                    {/* <Text style={styles.sportHeading}>Notable Alumuni</Text>
                    <FlatList
                        data={noteAbleAlumniList}
                        renderItem={({ item, index }) => {
                            return listItems(item, index);
                        }} keyExtractor={item => item.id}
                    /> */}
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

export default UniversityScolarship;