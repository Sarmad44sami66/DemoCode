import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ViewVideoLink = (props) => {

    let videoLinkList = props.userProfile.videoClips;

    const [videoLink, setVideoLink] = useState([
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'www.youtube.com/athelete12',
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'www.youtube.com/athelete12',
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            title: 'www.youtube.com/athelete12',
        }
    ])
    const renderVideoLinkList = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.rowView}>
                <Text style={styles.blueTextStyle}>{item.uploadvideo}</Text>
                <Image 
                style={{width:15,height:15,resizeMode:'contain'}}
                source={require('./../assets/images/attachment.png')} />
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            <SafeAreaView style={styles.container}>
                <Text style={styles.allAboutText}>Video Link</Text>
                <View style={{ flex: 1, height: '100%', width: '100%' }}>
                    <FlatList
                        extraData={videoLinkList}
                        data={videoLinkList}
                        renderItem={renderVideoLinkList}
                        showsVerticalScrollIndicator={true}
                        keyExtractor={item => item.user_media_id}
                        contentContainerStyle={{  flexGrow: 1 }}
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
        marginHorizontal: 20,
        marginVertical: 8,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    blueTextStyle: {
        color: COLORS.appLightBlue,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        width: '80%'
    },
    grayTextStyle: {
        color: COLORS.appAccentGreyDark,
        fontFamily: 'Poppins-Light',
        fontSize: 14
    }

});
export default ViewVideoLink;