import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import EditAboutMe from './EditAboutMe'
import EditEducation from './EditEducation'
import EditQualification from './EditQualification'
import EditTeamHistory from './EditTeamHistory'
import EditCoachesReport from './EditCoachesReport'
import EditVideoLink from './EditVideoLink'
import ContactUsHeader from '../components/ContactUsHeader';
import fontFamily from '../assets/fonts';
import EditProfile from './EditProfile';

const EditProfileTabs = (props) => {
    const { route } = props;
    let profileData = route.params?.profileData;
    let isEdit = route.params.isEdit;
    
    const [topBarItem, setTopBarItem] = useState([
        { label: '1', name: 'Edit Profile', isSelect: true },
        { label: '2', name: 'About me', isSelect: false },
        { label: '3', name: 'Education', isSelect: false },
        { label: '4', name: 'Qualification', isSelect: false },
        { label: '5', name: 'Team History', isSelect: false },
        { label: '6', name: 'Relevant Documents', isSelect: false },
        { label: '7', name: 'Video Link', isSelect: false },
    ]);
    const [selectTabNo, setTabNo] = useState(1)
    const renderTopBarItem = (item, index) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    let array = [...topBarItem]
                    array.forEach((element, index2) => {
                        if (index === index2) {
                            array[index2].isSelect = true
                            setTabNo(index2 + 1)
                        }
                        else {
                            array[index2].isSelect = false
                        }
                    });
                    setTopBarItem(array)
                }}
                style={styles.renderViewUniSport}>
                <Text style={[styles.navTopText, { color: item.isSelect === true ? 'white' : '#21287F' }]}>{item.name.toUpperCase()}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ width: '100%', height: '100%' }}>
                <ContactUsHeader
                // isShowSave={true}
                headerText={'Edit Profile'}
                backPress={() => { props.navigation.goBack() }}
                // headingPress={()=> {props.navigation.goBack()}}
            />
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.flatListMainView}>
                        <FlatList
                            horizontal
                            data={topBarItem}
                            keyExtractor={(item, index) => item.label + index}
                            listKey={'SelectIndustriesScreen' + moment().format('x')}
                            removeClippedSubvisews={false}
                            renderItem={({ item, index }) => {
                                return renderTopBarItem(item, index);
                            }}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ backgroundColor: '#6C63FF',}}
                        />
                    </View>
                    {selectTabNo === 1 ?
                       profileData !== '' && <EditProfile userProfile={profileData} isEdit = {isEdit} /> :
                    selectTabNo === 2 ?
                       profileData !== '' && <EditAboutMe userProfile={profileData} isEdit = {isEdit} /> :
                        selectTabNo === 3 ?
                            <EditEducation userProfile={profileData} isEdit = {isEdit} /> :
                            selectTabNo === 4 ?
                                <EditQualification userProfile={profileData} isEdit = {isEdit} /> :
                                selectTabNo === 5 ?
                                    <EditTeamHistory userProfile={profileData} isEdit = {isEdit} /> :
                                    selectTabNo === 6 ?
                                        <EditCoachesReport userProfile={profileData} isEdit = {isEdit} /> :
                                        <EditVideoLink userProfile={profileData} isEdit = {isEdit}  />
                    }
                </SafeAreaView>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: 'black'
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.appWhite,
        // paddingLeft: 15,
        // paddingRight: 15
    },
    navTopText: {
        color: COLORS.appWhite,
        fontFamily: fontFamily.PoppinsMedium,
        fontSize: 11,
        textAlign: 'center'
    },
    flatListMainView: {
    },
    topHeaderContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginTop: 15
    },
    favTouch: {
        position: 'absolute',
        width: 31,
        height: 31,
        borderRadius: 10,
        backgroundColor: '#445C77AA',
        // backgroundColor: '#151515',
        alignSelf: "flex-end",
        justifyContent: "center",
        top: 20,
        right: 20
    },
    favIcon: {
        width: 15,
        height: 15,
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 2
    },
    socialIcon: {
        width: 21,
        height: 21,
        resizeMode: "contain",
    },
    universityTitle: {
        color: COLORS.greyTextColor,
        fontFamily: fontFamily.PoppinsMedium,
    },
    socialContainer: {
        flexDirection: 'row',
    },
    renderView: {
        alignSelf: 'center',
        width: '100%',
        backgroundColor: COLORS.appWhite,
    },
    renderViewUniSport: {
        alignSelf: 'center',
        height: 63,
        backgroundColor: '#6C63FF',
        paddingLeft: 17,
        paddingRight: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    allAboutText: {
        fontSize: 20,
        color: COLORS.appTitleBlue,
        marginTop: 20,
        fontFamily: fontFamily.PoppinsBold,
    },
    borderSepartorStyle: {
        backgroundColor: '#F5F5F5',
        width: '100%',
        height: 2,
        marginTop: 20
    },
    sfButton: {
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6C63FF',
        borderRadius: 0
    }
})

export default EditProfileTabs;