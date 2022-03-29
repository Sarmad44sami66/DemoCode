import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, TextInput, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppStyles from '../utils/styles'
import InputField from './../components/RegistrationInput'
import SFButton from '../components/SFButton';
import DocumentPicker from 'react-native-document-picker';
import fontFamily from '../assets/fonts';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import {
    addYoutubeVideo,
    getUserProfile,
    editYoutubeVideo,
    deleteYoutubeVideo
} from '../api/methods/auth';
import Loader from '../components/Loader';

const EditVideoLink = (props) => {
    const [videoLink, setVideoLink] = useState('')
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [VideoList, setVideoList] = useState(props.userProfile?.videoClips);
    const [showCancel, setShowCancel] = useState(false);
    const [videoId, setVideoId] = useState(-1)

    const userProfile = async () => {
        setShowLoader(true)
        try {
            const response = await getUserProfile();
            setShowLoader(false);
            if (response.data.success == true) {
                setVideoList(response.data.profile_data.videoClips);
            }
        } catch (error) {
            // Toast.show(error.response.data.error.message)
            setShowLoader(false);
        }
    }

    const addVideo = async () => {
        let data = {
            "type": "video",
            "description": videoLink
        };
        console.log('my video body====>', data)
        setShowLoader(true);
        try {
            const response = await addYoutubeVideo(data);
            setShowLinkModal(false)
            console.log('my response===>', response.data);
            if (response.data.success == true) {
                Toast.show(response.data.message);
                userProfile();
            }
            setVideoLink('')
        } catch (error) {
            Toast.show(error.response.data.error.message);
            console.log('eror===>', error.response.data);
            setShowLoader(false);
        }
    };
    const editVideo = async () => {
        let data = {
            "type": "video",
            "description": videoLink,
            "user_video_id": videoId
        };
        setShowLoader(true);
        try {
            const response = await editYoutubeVideo(data);
            setShowLinkModal(false)
            if (response.data.success == true) {
                Toast.show(response.data.message);
                userProfile();
            }
            setVideoLink('')
        } catch (error) {
            Toast.show(error.response.data.error.message);
            console.log('eror===>', error.response.data);
            setShowLoader(false);
        }
    };
    const deleteVideo = async () => {
        let data = {
            "user_video_id": videoId
        };
        setShowLoader(true);
        try {
            const response = await deleteYoutubeVideo(data);
            setShowLinkModal(false)
            console.log('my response===>', response.data);
            if (response.data.success == true) {
                Toast.show(response.data.message);
                userProfile();
            }
            setVideoLink('')
        } catch (error) {
            Toast.show(error.response.data.error.message);
            console.log('eror===>', error.response.data);
            setShowLoader(false);
        }
    };

    function validateYouTubeUrl() {
        if (videoLink == '') {
            Toast.show('Video Link Required ');
            return
        }
        var url = videoLink;
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {

                showCancel ? editVideo() : addVideo()
                // Do anything for being valid
                // if need to change the url to embed url then use below line
            }
            else {
                Toast.show('Youtube URL Required ')
                // Do anything for not being valid
            }
        }
    }

    const renderVideoLinkList = ({ item, index }) => {
        return (
            <View
                style={styles.rowView}>
                <Text style={styles.blueTextStyle}>{item.uploadvideo}</Text>
                <TouchableOpacity onPress={() => {
                    setVideoLink(item.uploadvideo)
                    setShowCancel(true);
                    setVideoId(item.user_media_id ? item.user_media_id : item.id)
                    setShowLinkModal(true)
                }}>
                    <Image
                        style={{ width: 15, height: 15, resizeMode: 'contain' }}
                        source={require('./../assets/images/attachment.png')} />
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, marginBottom: 80 }}
            >
                <View style={styles.container}>
                    <View style={styles.saveBtnBarContainer}>
                        <Text style={styles.allAboutText}>Video Link</Text>
                        <SFButton
                            isFlat
                            style={styles.sfbutton}
                            onPress={() => {
                                setShowLinkModal(true)
                            }}
                            textStyle={{ marginTop: 4, fontSize: 12, fontFamily: fontFamily.PoppinsSemiBold }}
                        >Add New</SFButton>
                    </View>
                    <View style={styles.rowView}>
                        <View style={{ width: '100%' }}>
                            <FlatList
                                extraData={VideoList}
                                data={VideoList}
                                renderItem={renderVideoLinkList}
                                showsVerticalScrollIndicator={true}
                                keyExtractor={item => item.user_media_id}
                                contentContainerStyle={{ flexGrow: 1 }}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <Modal isVisible={showLinkModal}>
                <View style={{ backgroundColor: COLORS.appWhite, borderRadius: 10, paddingVertical: 20 }}>
                    <Text style={[styles.blueTextStyle2]}>
                        {showCancel ? 'Edit Video' : 'Add Video'}
                    </Text>
                    <InputField
                        mainStyle={{ marginHorizontal: 20 }}
                        placeholderTextColor={COLORS.appAccentGreyDark}
                        value={videoLink}
                        placeholder={'Link'}
                        onChangeText={text => {
                            setVideoLink(text);
                        }}
                    />
                    {showCancel ? (
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    marginBottom: 5,
                                }}>
                                <SFButton
                                    hideIcon
                                    onPress={() => {
                                        setShowCancel(false);
                                        setShowLinkModal(false);
                                    }}
                                    isFlat
                                    style={[
                                        styles.sfbutton,
                                        { backgroundColor: COLORS.appAccentGreyDark, width: '40%' },
                                    ]}
                                    textStyle={{
                                        marginTop: 4,
                                        fontSize: 12,
                                        fontFamily: fontFamily.PoppinsSemiBold,
                                    }}>
                                    {'Cancel'}
                                </SFButton>
                                <SFButton
                                    hideIcon
                                    onPress={() =>
                                        showCancel ? validateYouTubeUrl() : validateYouTubeUrl()
                                    }
                                    isFlat
                                    style={[styles.sfbutton, { width: '40%' }]}
                                    textStyle={{
                                        marginTop: 4,
                                        fontSize: 12,
                                        fontFamily: fontFamily.PoppinsSemiBold,
                                    }}>
                                    {showCancel ? 'Edit' : 'Add'}
                                </SFButton>
                            </View>
                            {showCancel && (
                                <SFButton
                                    hideIcon
                                    onPress={() => {
                                        deleteVideo()
                                    }}
                                    isFlat
                                    style={[
                                        styles.sfbutton,
                                        {
                                            backgroundColor: COLORS.appAccentGreen,
                                            width: '90%',
                                            alignSelf: 'center',
                                            marginBottom: 20,
                                        },
                                    ]}
                                    textStyle={{
                                        marginTop: 4,
                                        fontSize: 12,
                                        fontFamily: fontFamily.PoppinsSemiBold,
                                    }}>
                                    Delete
                                </SFButton>
                            )}
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                marginBottom: 20,
                            }}>
                            <SFButton
                                hideIcon
                                onPress={() => {
                                    setShowCancel(false);
                                    setShowLinkModal(false);
                                }}
                                isFlat
                                style={[
                                    styles.sfbutton,
                                    { backgroundColor: COLORS.appAccentGreyDark, width: '40%' },
                                ]}
                                textStyle={{
                                    marginTop: 4,
                                    fontSize: 12,
                                    fontFamily: fontFamily.PoppinsSemiBold,
                                }}>
                                {'Cancel'}
                            </SFButton>
                            <SFButton
                                hideIcon
                                onPress={() => {
                                    showCancel ? EditTeamHistory() : validateYouTubeUrl()
                                }
                                }
                                isFlat
                                style={[styles.sfbutton, { width: '40%' }]}
                                textStyle={{
                                    marginTop: 4,
                                    fontSize: 12,
                                    fontFamily: fontFamily.PoppinsSemiBold,
                                }}>
                                {showCancel ? 'Edit' : 'Add'}
                            </SFButton>
                        </View>
                    )}
                </View>
            </Modal>
            <Loader visible={showLoader} />
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
        fontSize: 18,
        color: '#111440',
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
    },
    blueTextStyle2: {
        color: COLORS.appLightBlue,
        fontFamily: fontFamily.PoppinsBold,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    authInput: {
        paddingTop: 10,
        paddingBottom: 8,
        paddingStart: 10,
        paddingEnd: 10,
        borderRadius: 5,
        backgroundColor: COLORS.appAccentGreyLight,
        fontSize: 14,
        fontFamily: fontFamily.PoppinsSemiBold,
    },
    sfbutton: {
        width: 105,
        height: 35,
        borderRadius: 25,
        marginTop: 20
    },
    saveBtnBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 25
    },
    marketingView: {
        width: "50%",
        height: 60,
        backgroundColor: COLORS.appWhite,
        borderWidth: 1,
        borderColor: COLORS.appAccentBlue,
        justifyContent: 'center'
    },
    marketingView2: {
        width: "50%",
        height: 60,
        backgroundColor: COLORS.appAccentBlue,
        justifyContent: 'center'
    },
    marketingText: {
        color: COLORS.appAccentBlue,
        fontFamily: fontFamily.PoppinsSemiBold,
        fontSize: 14,
        textAlign: "center"
    },
    fieldContainer: {
        marginHorizontal: 20,
        marginVertical: 8
    }
});
export default EditVideoLink;