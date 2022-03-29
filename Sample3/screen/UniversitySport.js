import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import StarRating from 'react-native-star-rating';
import SFButton from '../components/SFButton';
import { CheckBox } from 'native-base'
import Accordion from 'react-native-collapsible/Accordion';
import fontFamily from '../assets/fonts';
import _ from 'lodash';

const UniversitySport = (props) => {
    let universityDetail = props.universityDetail;
    const [activeSections, setActiveSections] = useState([])
    const [activeIndex, setActiveIndex] = useState([-1])
    const [universitySports, setUniversitySports] = useState(universityDetail.university_club)
    const renderAccordianItem = ({ item, index }) => {
        // console.log('jkguigjgukhgkj',item.club.name)
        return (
            item.club !== null ?
            <View
                activeOpacity={1}
                style={styles.itemStyle}
                onPress={() => { setActiveIndex(index) }}>
                <View style={styles.accordianContainer}>
                    <View style={styles.leftContainerAcordian}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.appAccentBlue, marginRight: 10 }}></View>
                        {/* <Image
                            style={styles.iconStyleAccordian}
                            source={index === activeIndex ? require('./../assets/images/remove.png') : require('./../assets/images/plus.png')}
                        /> */}
                       <Text style={styles.titleStyle}>{item.club?.name}</Text>
                    </View>
                    <TouchableOpacity  
                     onPress={() => { props.navigation.navigate('ClubDetail', { item: item }) }}
                    style={{width: '38%',}}>
                        <Text style={styles.findMore}>{'Find out more'}</Text>
                    </TouchableOpacity>
                </View>
                {/* {index == activeIndex &&
                    <Text style={styles.descriptionStyle}>{item.content}</Text>
                } */}
            </View>: null
        );
    };

    const onClickRegister = () => {

    }

    const _updateSections = activeSections => {
        setActiveSections(activeSections)
    };


    return (
        <View style={{ width: '100%', height: '100%', flex: 1 }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            {!!universityDetail && <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.headingContainerBar}>
                        {universitySports.length>0&&(<Text style={styles.sportHeading}>Sports</Text>)}
                        {universitySports.length>0&&(<Text style={styles.types}>{`${universitySports.length} Types`}</Text>)}
                    </View>
                    {universitySports.length > 0 && <FlatList
                        data={universitySports}
                        renderItem={renderAccordianItem}
                        maxToRenderPerBatch={30}
                        initialNumToRender={30}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ width: '100%' }}
                        bounces={false}
                        keyboardShouldPersistTaps={'handled'}
                    />}
                </SafeAreaView>
            </KeyboardAwareScrollView>}
            {/* <SFButton
                hideIcon
                style={styles.sfButton}
                textStyle={{ marginTop: 3 }}
                onPress={() => { onClickRegister() }} >{'Register Interest'.toUpperCase()}</SFButton> */}
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
        fontFamily: fontFamily.PoppinsBold,
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
        // marginBottom: 10,
        position: 'absolute',
        bottom: 10,
        // top:0
    },
    types: {
        fontSize: 16,
        color: '#979797',
        fontFamily: fontFamily.PoppinsMedium,
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
        fontFamily: fontFamily.PoppinsRegular,
        color: '#979797'
    },
    findMore: {
        fontSize: 15,
        fontFamily: fontFamily.PoppinsRegular,
        color: '#6C63FF',
        textAlign: 'right',
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
    iconStyleAccordian: { width: 12, height: 12, resizeMode: 'contain', marginRight: 8, tintColor: '#21287F' }
})

export default UniversitySport;