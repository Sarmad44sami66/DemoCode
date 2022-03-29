import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import StarRating from 'react-native-star-rating';
import SFButton from '../components/SFButton';
import { CheckBox } from 'native-base'
import Video from 'react-native-video';
import fontFamily from '../assets/fonts';
import Modal from 'react-native-modal';
import YouTube from 'react-native-youtube';
import HTML from 'react-native-render-html';
import _ from 'lodash';

const ModalOption = ['Considering', 'Applied', 'Accepted', 'Denied']

const UniversityDescription = (props) => {
    let universityDetail = props.universityDetail;
    const vRef = useRef(null);
    const [showOptionModal, setShowOptionModal] = useState(false);

    const onClickRegister = () => {
        setShowOptionModal(true)
    }
    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            {!!universityDetail && <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <View style={{ marginHorizontal: 20 }}>
                        <HTML style={styles.descriptionText} html={universityDetail.university_details.short_note.toString()} />
                    </View>
                    {/* <Text style={styles.descriptionText}>{universityDetail.university_details.short_note}</Text> */}
                    {<View style={{ height: 'auto' }}>
                        {!_.isNil(universityDetail.university_details?.video) && <YouTube
                            apiKey={'AIzaSyCgP8UZ_WlA7-5snF9Tx48LgdQkgYbBOvA'}
                            videoId={`${universityDetail.university_details?.video?.split('=').pop()}`}// The YouTube video ID
                            play={false} // control playback of video with true/false
                            fullscreen={false} // control whether the video should play in fullscreen or inline
                            loop={false} // control whether the video should loop when ended
                            // onReady={e => this.setState({ isReady: true })}
                            // onChangeState={e => this.setState({ status: e.state })}
                            // onChangeQuality={e => this.setState({ quality: e.quality })}
                            // onError={e => this.setState({ error: e.error })}
                            style={{ alignSelf: 'stretch', height: 300 }}
                        />}
                    </View>}

                </SafeAreaView>
            </KeyboardAwareScrollView>}
            {/* <SFButton
                hideIcon
                style={styles.sfButton}
                textStyle={{ marginTop: 3 }}
                onPress={() => { onClickRegister() }} >{'Register Interest'.toUpperCase()}</SFButton> */}
            <Modal isVisible={showOptionModal}>
                <View style={[{ justifyContent: 'center', height: 300, backgroundColor: 'white', borderRadius: 20, width: "80%", alignSelf: "center" }]}>
                    <View style={{ marginHorizontal: 20, }}>
                        {ModalOption.map((item, index) => {
                            return (
                                <TouchableOpacity style={{ justifyContent: "center", marginVertical: 5 }}>
                                    <Text style={{ textAlign: "center" }}>{item}</Text>
                                </TouchableOpacity>
                            )
                        })}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 13,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => {
                                setShowOptionModal(false);
                            }}>
                            <Text
                                style={{
                                    color: COLORS.appAccentBlue,
                                    padding: 14,
                                    fontSize: 20,
                                }}>
                                {'Cancel'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    descriptionText: {

    },
    backgroundVideo: {
        width: '90%',
        height: 170,
        alignSelf: 'center'
    },
    playBtn: {
        width: 80,
        height: 80,
        backgroundColor: '#000000AA',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 40
    },
    sfButton: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6C63FF',
        borderRadius: 0,
        width: '100%',
        height: 61,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0

    },
})

export default UniversityDescription;