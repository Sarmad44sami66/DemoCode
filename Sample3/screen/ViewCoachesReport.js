import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import EducationDegree from '../assets/images/education_degree.svg';
import RNFetchBlob from 'rn-fetch-blob'
import Toast from 'react-native-simple-toast';

const ViewCoachesReport = (props) => {

    let userQualificationList = props.userProfile.additionalCertificates;

    const [activeIndex, setActiveIndex] = useState([])

    
    const downloadDocument = (document) => {
        const { config, fs } = RNFetchBlob;
        var date = new Date()
        let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                notification: false,
                path: PictureDir + "/me_" + Math.floor(date.getTime() + date.getSeconds() / 2), // this is the path where your downloaded file will live in
                description: 'Downloading image.'
            }
        }
        config(options).fetch('GET', document).then((res) => {
            console.log('check for download response====>', res)
            Toast.show('Document Downloaded Successfully')
            // do some magic here
        })
    }


    const renderAccordianItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.itemStyle}
                onPress={() => { setActiveIndex(index) }}>
                <View style={styles.accordianContainer}>
                    <View style={styles.leftContainerAcordian}>
                        <View style={{ width: 11, height: 11, borderRadius: 6, borderWidth: 1, borderColor: "#979797", marginRight: 7 }} />
                        <Text style={styles.titleStyle}>{item.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => downloadDocument(item.certificate)} style={{ width: '38%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Image
                            style={styles.iconStyleAccordian}
                            source={require('./../assets/images/download.png')}
                        />
                        <Text style={styles.findMore}>{'PDF'}</Text>
                    </TouchableOpacity>
                    {/* <Text style={styles.findMore}>{'Find out more'}</Text> */}
                </View>
                {/* {index == activeIndex &&
                    <Text style={styles.descriptionStyle}>{item.content}</Text>
                } */}
            </TouchableOpacity>
        );
    };

    const _updateSections = activeSections => {
        setActiveSections(activeSections)
    };
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.saveBtnBarContainer}>
                        <Text style={styles.allAboutText}>Relevant Document</Text>
                        {/* <Image
                            style={{ width: 21, height: 21, resizeMode: 'contain' }}
                            source={require('./../assets/images/downloading.png')} /> */}
                    </View>
                    <FlatList
                        data={userQualificationList}
                        renderItem={renderAccordianItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ width: '100%' }}
                        bounces={false}
                        keyboardShouldPersistTaps={'handled'}
                    />
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

    headingContainerBar: {
        width: '100%',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        marginTop: 5
    },
    sportHeading: {
        fontSize: 18,
        color: '#3A3A3A',
        fontFamily: 'Poppins-Bold',
    },
    types: {
        fontSize: 16,
        color: '#979797',
        fontFamily: 'Poppins-Medium',
    },
    itemStyle: {
        width: '100%',
        // backgroundColor: '#F7F7F7',
        // padding: 20,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
        marginTop: 10,
        alignSelf: 'center',
    },
    titleStyle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#979797'
    },
    findMore: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: '#6C63FF',
        // textAlign: 'right',
        flexWrap: 'wrap'
    },
    descriptionStyle: {
        marginTop: 10,
        fontSize: 16,
        color: '#979797',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'white'
    },
    accordianContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 7, backgroundColor: '#F7F7F7', width: '100%', borderRadius: 5 },
    leftContainerAcordian: { flexDirection: 'row', alignItems: 'center', width: '57%', },
    iconStyleAccordian: { width: 12, height: 12, resizeMode: 'contain', marginRight: 4, tintColor: '#21287F' },
    saveBtnBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 25
    },
    allAboutText: {
        fontSize: 18,
        color: '#111440',
        marginTop: 20,
        fontFamily: 'Poppins-Bold',
        marginLeft: 20,

    },
});
export default ViewCoachesReport;