import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    FlatList,
    Pressable,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ActivityIndicator
} from 'react-native'
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import StarRating from 'react-native-star-rating';
import Toast from 'react-native-simple-toast';
import ModalDropdown from 'react-native-modal-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { StackActions, useIsFocused } from '@react-navigation/native';

import Header from '../components/Header';
import Loader from '../components/Loader';
import { COLORS } from '../utils/colors';
import fontFamily from '../assets/fonts';
import FillHeart from '../assets/images/fill_heart.svg';
import { getAllFavoriteUniversities, updateUserEnquiryStatus, registerUserInterestUniversity, universityRegisterStatus } from '../api/methods/auth';
import { logoutUser } from '../redux/actions/userSession';
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';


const modalOptions = ['Considering', 'Applied', 'Accepted', 'Denied'];

const getDotColor = (_register_status) => {
    if (_register_status == 'Considering') return '#FFC107'
    else if (_register_status == 'Applied') return '#1F9EAC'
    else if (_register_status == 'Accepted') return '#19D232'
    else if (_register_status == 'Denied') return '#DC1C1C'
    else return '#FFFF00'
}

const CardComponent = (props) => {

    const {
        navigation,
        item,
        index,
        onClickRegister,
    } = props

    const itemId = item.user_favourite_id

    const modalDropdownRef = { current: null }

    const [selectedOption, setSelectedOption] = useState(item.register_status)
    const [showLoader, setShowLoader] = useState(false)


    const getUniversityStatusRegister = async (itemId, option) => {
        try {
            setShowLoader(true)

            console.log("Id=============>>>>", itemId)
            console.log("Options===================>>>>", option)

            const response = await universityRegisterStatus({
                'interested_university_id': itemId,
                'interested_university_status': option
            });
            // setModalValue(option)
            console.log("opiton===============>>>", option)
            console.log("University Register Status=================>>>>>>", response.status)
            // console.log("ID===================>>>", item.user_favourite_id)
            // console.log("Data==================>>>", item.register_status)
            // console.log("Option=================>>>>>>", option)
            // console.log("Data==================>>>", item.register_status)
            if (response.status == 200) {
                Toast.show("Interest Status Updated")
                // setModalValue(item, option)
                // console.log("=====================>>>>>", response)
            }
        } catch (error) {
            console.log("University Register Status Error=================>>>>>", error)
        } finally {
            setShowLoader(false)
        }
        // console.log("Data===========>>>",  option)
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                // console.log("Item====>>>>", item.user_favourite_id)
                navigation.navigate('UniversityDetailScreen', { item: item })
            }}
            style={styles.renderView}>
            <Image style={{ resizeMode: 'cover', width: '100%', height: 166 }} source={item.university_banner !== null ? { uri: item.university_banner.url } : require('../assets/images/university_image.jpeg')} />
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.itemTagContainer}
                onPress={() => {
                    if (typeof modalDropdownRef.current?.show == 'function') modalDropdownRef.current?.show()
                }}>
                <View style={styles.itemTagView}>
                    <View style={[styles.tagDot, { backgroundColor: getDotColor(selectedOption) }]} />
                    {/* <Text style={styles.tagText}>{item.register_status}</Text> */}
                    <ModalDropdown
                        ref={modalDropdownRef}
                        options={modalOptions}
                        // style={{ width: '100%' }}
                        // dropdownTextStyle={{color:modalOptions=='Accepted'?'black':'red'}}
                        dropdownStyle={{ width: 100 }}
                        defaultValue={item.register_status}
                        onSelect={(_index, value) => {
                            setSelectedOption(value)
                            // console.log("item and option=============>>>", itemId, modalOptions)
                            // console.log(" option=============>>>",  modalOptions)
                            console.log(" Index=============>>>", _index)
                            getUniversityStatusRegister(itemId, value)

                        }}
                    />
                    {showLoader &&
                        <ActivityIndicator
                            style={{ marginLeft: 5 }}
                            size={'small'}
                            color={COLORS.appLightBlue}
                            animating={true}
                        />
                    }
                </View>
            </TouchableOpacity>
            <Pressable onPress={() => {
                onClickRegister(item.university_id)
                // favoriteUniversity(item.user_favourite_id)
            }} style={{
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
            }}>
                <FillHeart />
            </Pressable>
            <View style={{
                flexDirection: "row",
                marginHorizontal: 10,
                marginTop: 12
            }}>
                <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={{ uri: item.university.profile_picture ? item.university.profile_picture : 'https://storage.googleapis.com/sportfolio-stage-media/default/defultlogo.jpg' }} />
                <View style={{ width: '80%', marginLeft: 10 }}>
                    {_.isNil(item.university?.address_line_1) !== true && <Text style={{ color: COLORS.greyTextColor, fontFamily: fontFamily.PoppinsMedium, fontSize: 12 }}>{`${item.university?.address_line_1}, ${item.university?.address_line_2}`}</Text>}
                    <Text style={{ color: "#000000", fontFamily: fontFamily.PoppinsSemiBold }}>{item.university_detail?.correct_name}</Text>
                </View>
            </View>
            <View style={{ alignSelf: 'flex-end', flexDirection: "row", marginRight: 15, marginTop: 4, alignItems: 'center' }}>
                {/* <StarRating
                    starSize={14}
                    disabled={true}
                    maxStars={5}
                    fullStarColor={'#FFC107'}
                    rating={item.university_detail?.bucs_overall_rating !== null ? item.bucs_overall_rating?.bucs_overall_rating : 0}
                        // rating={parseFloat(item.university_details?.bucs_overall_rating)}
                    
                // selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
                <Text style={{ marginLeft: 10, color: "#151515", fontFamily: fontFamily.PoppinsRegular, fontSize: 12, alignSelf: 'center', marginTop: 3 }}>{item.university_detail?.bucs_overall_rating !== null ? `(${item.university_detail?.bucs_overall_rating})` : (0)}</Text> */}

                <StarRating
                    starSize={20}
                    disabled={true}
                    maxStars={5}
                    fullStarColor={'#FFC107'}
                    rating={parseFloat(item?.rating)}
                // selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
                <Text style={{ marginLeft: 10, color: "#151515", fontFamily: fontFamily.PoppinsRegular, fontSize: 12, alignSelf: 'center', marginTop: 3 }}>{(item?.rating !== null && item?.rating !== undefined) ? `(${item?.rating})` : `(0)`}</Text>

            </View>
        </TouchableOpacity>
    )

}

const FavoriteScreen = (props) => {


    const [modalValue, setModalValue] = useState('');
    const [uniId, setUniId] = useState('')

    const dispatch = useDispatch()

    const { userType } = useSelector((state) => state.userSession)

    const isFocused = useIsFocused();

    

    useEffect(() => {
        getFavoriteUniversities();
        // getUniversityStatusRegister();
    }, [isFocused]);
    const dispath = useDispatch()

    // useEffect(() => {
        
    //         props.navigation.addListner('tabPress', alertFunction)
        
    // }, [userType])

    const guestUserLogout = () => {
        try {
            if (userType) {
                dispatch(logoutUser())
                Toast.show("Please login")
            }
        } catch (error) {
            console.log("eroorr==>>", error)
        }
    }

    const [universitiesList, setUniversitiesList] = useState([
        // { label: '1', image: require('../assets/images/university_image.png'), starCount: 3.5,tagText:'Applied',tagColor:'#6C63FF' },
        // { label: '2', image: require('../assets/images/university_image.png'), starCount: 3.5 ,tagText:'Waitlist',tagColor:'#FFC107'},
        // { label: '3', image: require('../assets/images/university_image.png'), starCount: 3.5 ,tagText:'Denied',tagColor:'#DC3545'},
        // { label: '4', image: require('../assets/images/university_image.png'), starCount: 3.5,tagText:'Applied',tagColor:'#6C63FF' },
        // { label: '5', image: require('../assets/images/university_image.png'), starCount: 3.5 ,tagText:'Denied',tagColor:'#DC3545'},
    ]);
    const [showLoader, setShowLoader] = useState(false);
    // console.log("Favourite universities=========>>>>",universitiesList)

    const getFavoriteUniversities = async () => {
        setShowLoader(true)
        try {
            const response = await getAllFavoriteUniversities();
            setShowLoader(true)
            if (response.data.success == true) {
                setUniversitiesList(response.data.data);
                console.log("Favoriute universities================>>>>>>", response.data.data)
                // Toast.show(response.data.message)
                setUniId(response.data.data.university_id)
                setShowLoader(false);
            }
        } catch (error) {
            // Toast.show(error.response.data.error.message)
            if (error.response.data.error.message == "Session Expired.") {
                dispath(logoutUser())
            }
            console.log('check for universities=====>', error)
            setShowLoader(false);
        }
    }



    const favoriteUniversity = async (id) => {
        let data = {
            "enquiry_id": id,
            "enquiry_status": "Applied"
        }
        console.log('dgdfgd', data)
        setShowLoader(true)
        try {
            const response = await updateUserEnquiryStatus(data);
            console.log('dgdfgd', response.data)
            setShowLoader(false);
            if (response.data.success == true) {
                console.log('dgdfgd', response.data)
                Toast.show(response.data.message)
                getFavoriteUniversities();
                // setUniversitiesList([]);
                // setUniversitiesList(response.data.data)
            }
        } catch (error) {
            Toast.show(error.response.data.error.message)
            console.log('eror===>', error.response)
            setShowLoader(false);
        }
    }

    const onClickRegister = async id => {
        let data = {
            university_id: id,
        };
        setShowLoader(true);
        try {
            const response = await registerUserInterestUniversity(data);
            setShowLoader(false);
            if (response.data.success == true) {
                Toast.show(response.data.message);
                getFavoriteUniversities();
                // Toast.show('Register Interest Successful');
            }
        } catch (error) {
            //   Toast.show(error.response.data.error.message);
            console.log('eror===>', error.response.data);
            setShowLoader(false);
        }
    };

    const renderItem = ({ item, index }) => {
        return (
            <CardComponent
                navigation={props.navigation}
                item={item}
                index={index}
                onClickRegister={onClickRegister}
            />
        )

    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ backgroundColor: COLORS.appLightBlue }}
                centerComponent={require('../assets/images/appLogo.png')}
                rightIcon={require('../assets/images/setting.png')}
                onRightAction={() => { props.navigation.navigate('ProfileScreen') }}
            />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
            >
                <StatusBar backgroundColor={COLORS.appLightBlue} />
                <SafeAreaView style={styles.container}>
                    <Text style={styles.allAboutText}>Shortlisted Universities</Text>

                    <View style={styles.flatListMainView}>
                        <FlatList
                            data={universitiesList}
                            keyExtractor={(item, index) => item.id}
                            listKey={'SelectIndustriesScreen' + moment().format('x')}
                            removeClippedSubvisews={false}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    {/* {universitiesList == '' && <Text style={styles.shortListMessage}> There are no shortlisted universities</Text>} */}
                </SafeAreaView>
                
            </KeyboardAwareScrollView>
            <Loader visible={showLoader} />
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
        // backgroundColor: COLORS.appWhite,
        paddingLeft: 15,
        paddingRight: 15
    },
    flatListMainView: {
    },
    shortListMessage: {
        marginTop: '80%',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    renderView: {
        alignSelf: 'center',
        paddingBottom: 16,
        width: '98%',
        backgroundColor: COLORS.appWhite,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 10,
        elevation: 3,
    },
    renderViewUniSport: {
        alignSelf: 'center',
        height: 63,
        width: '48%',
        borderRadius: 5,
        backgroundColor: COLORS.appWhite,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 10,
        elevation: 3,
    },
    allAboutText: {
        fontSize: 18,
        color: '#111440',
        marginTop: 20,
        fontFamily: fontFamily.PoppinsBold,
        marginBottom: 15
    },
    findUniversities: {
        fontSize: 20,
        color: '#000000',
        marginTop: 30,
        fontFamily: fontFamily.PoppinsBold,
        marginLeft: 20
    },
    sfbutton: {
        marginBottom: 20,
        width: '50%',
        marginLeft: 20,
        borderRadius: 30,

    },
    bottomSheetContainer: {
        backgroundColor: '#FAFAFA',
        padding: 22,
        paddingTop: 10,
        marginTop: 10,
        height: '100%',
        width: '100%',
        marginBottom: 10,
        elevation: 21,
        borderRadius: 16,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: .53,
        shadowRadius: 13.97,

        elevation: 21,
    },
    dragerStyle: {
        width: 30,
        height: 3,
        backgroundColor: '#AAAAAA',
        borderRadius: 16,
        alignSelf: 'center',
    },
    checkBoxMainContainer: { flexDirection: 'row', marginTop: 10 },
    checkTick: { width: 12, height: 13, tintColor: 'white' },
    checkBoxContainer: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#21287F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterHeadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 17,
        paddingBottom: 4
    },
    filerHeading: {
        fontSize: 18,
        color: '#3A3A3A',
        fontFamily: fontFamily.PoppinsBold,
    },
    checkBoxClear: {
        fontSize: 14,
        color: '#490377',
        fontFamily: fontFamily.PoppinsSemiBold,
    },
    checkBoxHeading: {
        fontSize: 14,
        color: '#21287F',
        fontFamily: fontFamily.PoppinsMedium,
        marginBottom: 5,
        marginTop: 12
    },
    checkText: {
        fontSize: 13,
        color: '#979797',
        marginLeft: 9,
        fontFamily: fontFamily.PoppinsMedium,
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
    },
    filtersContainer: {
        flexDirection: 'row',
        marginRight: 10,
        marginTop: 15
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6C63FF',
        borderRadius: 20,
        padding: 11,
        paddingLeft: 30,
        paddingRight: 30
    },
    filterItemText: {
        fontSize: 14,
        color: 'white',
        marginTop: 3
    },
    itemTagContainer: {
        padding: 10,
        position: 'absolute',
        right: 24,
        top: 114,
    },
    itemTagView: {
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#6C63FF',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tagText: {
        fontSize: 13,
    },
    tagDot: {
        width: 9,
        height: 9,
        backgroundColor: '#6C63FF',
        borderRadius: 5,
        marginRight: 5
    }
})

export default FavoriteScreen;