import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Pressable,
  Image,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { StackActions, useIsFocused } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo'
import _ from 'lodash';
import StarRating from 'react-native-star-rating';
import * as Progress from 'react-native-progress';

import Modal from 'react-native-modal';
import YouTube from 'react-native-youtube';
import HTML from 'react-native-render-html';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { COLORS } from '../utils/colors';
import UniversityDescription from './UniversityDescription';
import UniversityCourse from './UniversityCourse';
import UniversitySport from './UniversitySport';
import UniversityNoticeBoard from './UniversityNoticeBoard';
import UniversityScolarship from './UniversityScolarship';
import UniversityRating from './UniversityRating';
import UniversityNotableAlumni from './UniversityNotableAlumni';
import fontFamily from '../assets/fonts';
import {
  getUniversityAllDetail,
  favoriteUserUniversity,
  registerUserInterestUniversity,
  getUniversityNoticeBoard,
  addReview
} from '../api/methods/auth';
import Loader from '../components/Loader';
import AvatarComponent from '../components/AvatarComponent';
import FillHeart from '../assets/images/fill_heart.svg';
import EmptyHeart from '../assets/images/Empty_Heart.svg';
import SFButton from '../components/SFButton';
import { logoutUser } from '../redux/actions/userSession';
import { TextInput } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';



const ModalOption = ['Considering', 'Applied', 'Accepted', 'Denied']

const HEADINGS = {
  university_details: { title: 'Overview', index: 0 },
  university_club: { title: 'Sport Clubs', index: 1 },
  university_course: { title: 'Courses', index: 2 },
  university_scolarship: { title: 'Scholarships', index: 3 },
  noticeBoard: { title: 'Notice Board', index: 4 },
  notable_alumni: { title: 'Notable Alumni', index: 5 },
  review: { title: 'Reviews', index: 6 },
}

const UniversityDetailScreen = props => {
  const { route } = props;
  const { item } = route.params;

  const scrollViewRef = useRef(null)
  const dispath = useDispatch()

  let itemId = item.id ? item.id : item.university_id;
  let tempArray = [];
  const isFocused = useIsFocused();

  const { userType } = useSelector((state) => state.userSession)
  const [topBarItem, setTopBarItem] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [selectTabName, setTabName] = useState('Overview');
  const [universityAllDetail, setUniversityAllDetail] = useState('');
  // console.log("University detail===============>>>>", universityAllDetail)
  const [NoticeBoard, setNoticeBoard] = useState([]);
  const [offsetsList, setOffsetsList] = useState([]);
  const [startRating, setStartRating] = useState(0);

  const [showReviewContainer, setShowReviewContainer] = useState(false)
  const [submitReview, setSubmitReview] = useState('')

  // university description variables
  const [showOptionModal, setShowOptionModal] = useState(false);

  // university course variables
  const [activeIndex, setActiveIndex] = useState([-1]);
  const [universityCourse, setUniversityCourse] = useState([]);
  const [universityCourseValues, setUniversityCourseValues] = useState([]);
  const [value, setValue] = useState(null);
  const [selectTabNo, setSelectTabNo] = useState(0);

  const [uniFavorite, setUniFavorite] = useState('')
  const [showAlert, setShowAlert] = useState(false)


  useEffect(() => {
    if (isFocused) {
      getUniversityDetail();
      favoriteUniversity()
    }
  }, [isFocused]);

  // useEffect(() => {
  //   scrollViewRef;
  // },3000);

  // const value = Object.values(universityDetail.universityCourse);

  const submitReviewApi = async () => {
    try {
      setShowLoader(true)
      const formData = new FormData()
      formData.append('rating', startRating)
      formData.append('to_id', universityAllDetail.university_details.id)
      formData.append('description', submitReview)
      const response = await addReview(formData)
      // console.log('review response===>>>',response.status)
      // console.log('review response data===>>>',response.data)
      if (response.status == 200) {
        Toast.show("Review Submitted")
        setShowReviewContainer(false)
        getUniversityDetail()
      }
      setShowLoader(false)
    } catch (error) {
      Toast.show(userType ? "Please login" : error.response.data.error.message)
      console.log("error===>>>", error.response.data.error.message)
      setShowLoader(false)
    }
  }

  const getUniversityDetail = async () => {
    // console.log('ik mhere')
    setShowLoader(true);
    try {
      const response = await getUniversityAllDetail(itemId);
      // setShowLoader(false);
      if (response.data.success == true) {
        // console.log('uni detail===>', response.data.data)
        setUniversityAllDetail(response.data.data);
        setUniversityCourse(Object.keys(response.data.data.universityCourse))
        // console.log('kjsbsdkjbckjsdbcjs===>',response.data.data)
        setUniversityCourseValues(Object.values(response.data.data.universityCourse))
        console.log("FAVOURITE=====>>>>", response.data.data.is_favourite)
        setUniFavorite(response.data.data.is_favourite)
      }

      GetUniversityNoticeBoard(response.data.data);
    } catch (error) {
      setShowLoader(false);
    }
  };
  const GetUniversityNoticeBoard = async (oldData) => {
    setShowLoader(true);
    try {
      const response = await getUniversityNoticeBoard(itemId);
      setShowLoader(false);
      if (response.data.success == true) {
        if (response.data.data?.length > 0) {
          setNoticeBoard(response.data.data)
        }
      }
      // console.log("University notice boar=========>>>>>>", response.data.data)
      setHeader(oldData, response.data.data)

    } catch (error) {
      setHeader(oldData, null)
      setShowLoader(false);
    }
  };

  const setHeader = (oldData, newData) => {
    let tempArray = []
    const keys = Object.keys(HEADINGS)
    for (const item of keys) {
      if (item == 'university_details' && oldData?.[item].short_note?.length > 0) {
        tempArray.push(HEADINGS?.[item])
      }
      else if (item == 'Notice Board' && newData?.length > 0) {
        tempArray.push(HEADINGS?.[item])
      }
      else {
        if (oldData?.[item]?.length > 0) {
          tempArray.push(HEADINGS?.[item])
        }
      }
    }
    // console.log('tempArray', tempArray)
    setTopBarItem(tempArray);
  }

  const favoriteUniversity = async id => {
    let data = {
      university_id: id,
    };
    setShowLoader(true);
    try {
      const response = await registerUserInterestUniversity(data);
      // setShowLoader(false);
      if (response.data.success == true) {
        Toast.show(response.data.message);
        console.log("REsponse===>>>", response.data)
        // setUniFavorite(response.data.message)
        getUniversityDetail();
      }
    } catch (error) {
      // Toast.show(error.response.data.error.message);
      // console.log('eror===>', error.response.data);
      setShowLoader(false);
    }
  };
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

        getUniversityDetail();
        Toast.show('Register Interest Successful');
        console.log("Response===========>>>>>", response.data)
      }
    } catch (error) {
      Toast.show(error.response.data.error.message);
      if (error.response.data.error.message == "Session Expired.") {
        dispath(logoutUser())
      }
      // console.log('eror===>', error.response.data);
      setShowLoader(false);
    }
  };

  const onLayoutChange = (_index, offset) => {
    // console.log("index", _index, "offset", offset)
    let index = -1
    for (const item of offsetsList) {
      if (item.index == _index) {
        index = _index
      }
    }
    if (index >= 0 && offsetsList.length > index)
      offsetsList[index].offset = offset
    else
      offsetsList.push({ index: _index, offset: offset })
    setOffsetsList(offsetsList)
  }

  const courseItems = ({ item, index }) => {
    // console.log('item======>',item)
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.itemStyle}
        onPress={() => {
          if (activeIndex == index)
            setActiveIndex(-1);
          else
            setActiveIndex(index)
        }}>
        <View style={styles.accordianContainer}>
          <View style={styles.leftContainerAcordian}>
            <Image
              style={styles.iconStyleAccordian}
              source={
                index === activeIndex
                  ? require('./../assets/images/remove.png')
                  : require('./../assets/images/plus.png')
              }
            />
            <Text style={styles.titleStyle}>
              {/* {""} */}
              {item}
            </Text>
          </View>
        </View>
        {index == activeIndex &&
          universityCourseValues[index].map(element => {
            return (
              <Text
                style={[
                  styles.descriptionStyle,
                  { borderBottomWidth: index != universityCourseValues[index].length - 1 ? 1 : 0 },
                ]}>
                {element?.course?.name}
              </Text>
            );
          })}
      </TouchableOpacity>
    );
  };


  // university sportClub variables
  const [universitySports, setUniversitySports] = useState([]);

  const renderSportsAccordianItem = (item, index, key) => {
    // console.log('jkguigjgukhgkj',item.club.name)
    return (
      item.club !== null ?
        <View
          key={key}
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
              style={{ width: '38%', }}>
              <Text style={styles.findMore}>{'Find out more'}</Text>
            </TouchableOpacity>
          </View>
          {/* {index == activeIndex &&
                <Text style={styles.descriptionStyle}>{item.content}</Text>
            } */}
        </View> : null
    );
  };


  // university scholorship variables
  const [universityScholarShip, setUniversityScholarShip] = useState([]);
  const renderScholorShipAccordianItem = ({ item, index }) => {
    return (
      <View
        style={{ marginBottom: 20 }}
      // activeOpacity={1}
      // style={styles.itemStyle}
      // onPress={() => { setActiveIndex(index) }}
      >
        <View style={{ marginHorizontal: 20 }}>

          <Text style={styles.titleStyle}>{item.name}</Text>
          <TouchableOpacity onPress={() => { Linking.openURL(item.apply_link) }}>
            <Text style={styles.titleLinkStyle}>{item.apply_link}</Text>
          </TouchableOpacity>
          <HTML style={styles.descriptionStyle} html={item.details} />
        </View>
      </View >
    );
  };

  // university notice board variales
  const [NoticeBoardList, setNoticeBoardList] = useState()
  const renderNoticeBoardAccordianItem = ({ item, index }) => {
    return (
      <View
        style={{ marginBottom: 20 }}
      // activeOpacity={1}
      // style={styles.itemStyle}
      // onPress={() => { setActiveIndex(index) }}
      >
        <View style={{ marginHorizontal: 20 }}>

          <Text style={styles.titleStyle}>{item.title}</Text>
          {/* <TouchableOpacity onPress={() => {Linking.openURL(item.apply_link)}}>
                  <Text style={styles.titleLinkStyle}>{item.apply_link}</Text>
              </TouchableOpacity> */}
          <Text style={styles.descriptionStyle}>{item.description}</Text>
        </View>
      </View >
    );
  };

  // university notable alumni variables
  const [noteAbleAlumniList, setNoteAbleAlumni] = useState(universityAllDetail.notable_alumni);
  const listItems = (item, index) => {
    // console.log('my item====>', item)
    return (
      <View style={styles.itemContainer}>
        <Image
          source={item.profile_image ? { uri: item.profile_image } : require('../assets/images/profilePlaceHolder.jpg')}
          style={{ width: 56, height: 56, resizeMode: 'cover', borderRadius: 5 }} />
        <View style={{ marginLeft: 13 }}>
          <Text style={{ color: '#979797', fontFamily: fontFamily.PoppinsMedium, fontSize: 12, }}>{`${item.first_name} ${item.last_name}`}</Text>
          {!_.isNil(item.sport?.name) && <Text style={{ color: '#979797', fontFamily: fontFamily.PoppinsRegular, fontSize: 12, }}>{item.sport?.name}</Text>}
          {<Text style={{ color: '#21287F', fontFamily: fontFamily.PoppinsSemiBold, fontSize: 12, }}>{`${item.achievement} `}{!_.isNil(item.year) && <Text>{`${item.year}`}</Text>}</Text>}
        </View>
      </View>
    )

  }

  // university rating variables
  let tempTwoStarRating = 0;
  let tempTwoStarRatingLength = 0;
  let tempOneStarRating = 0;
  let tempOneStarRatingLength = 0;
  let tempThreeStarRating = 0;
  let tempThreeStarRatingLength = 0;
  let tempFourStarRating = 0;
  let tempFourStarRatingLength = 0;
  let tempFiveStarRating = 0;
  let tempFiveStarRatingLength = 0;

  const [reviewList, setReviewList] = useState([]);

  universityAllDetail?.review?.length > 0 &&
    universityAllDetail.review.map((item, index) => {
      if (parseInt(item.rating) == 1) {
        tempOneStarRating = tempOneStarRating + parseInt(item.rating);
        tempOneStarRatingLength = tempOneStarRatingLength + 1;
      }
      if (parseInt(item.rating) == 2) {
        tempTwoStarRating = tempTwoStarRating + parseInt(item.rating);
        tempTwoStarRatingLength = tempTwoStarRatingLength + 1;
      }
      if (parseInt(item.rating) == 3) {
        tempThreeStarRating = tempThreeStarRating + parseInt(item.rating);
        tempThreeStarRatingLength = tempThreeStarRatingLength + 1;
      }
      if (parseInt(item.rating) == 4) {
        tempFourStarRating = tempFourStarRating + parseInt(item.rating);
        tempFourStarRatingLength = tempFourStarRatingLength + 1;
      }
      if (parseInt(item.rating) == 5) {
        tempFiveStarRating = tempFiveStarRating + parseInt(item.rating);
        tempFiveStarRatingLength = tempFiveStarRatingLength + 1;
      }
    });
  let oneStarRating =
    tempOneStarRating > 0 ? tempOneStarRating / tempOneStarRatingLength : 0;
  let twoStarRating =
    tempTwoStarRating > 0 ? tempTwoStarRating / tempTwoStarRatingLength : 0;
  let threeStarRating =
    tempThreeStarRating > 0
      ? tempThreeStarRating / tempThreeStarRatingLength
      : 0;
  let fourStarRating =
    tempFourStarRating > 0
      ? tempFourStarRating / tempFourStarRatingLength
      : 0;
  let fiveStarRating =
    tempFiveStarRating > 0
      ? tempFiveStarRating / tempFiveStarRatingLength
      : 0;
  let averageRating =
    (tempOneStarRating + tempTwoStarRating +
      tempThreeStarRating +
      tempFourStarRating +
      tempFiveStarRating) /
    universityAllDetail?.review?.length;

  const ratingListItems = (item, index) => {
    const source = `${item.description}`;
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#979797',
          borderRadius: 5,
          marginTop: 15,
          padding: 15
        }}>
        <View style={[styles.itemContainer, { padding: 4 }]}>
          <Image
            source={
              item.from_review_user?.profile_picture !== null
                ? { uri: item.from_review_user?.profile_picture }
                : require('./../assets/images/default_profile_picturejpg.jpg')
            }
            style={{
              width: 56,
              height: 56,
              resizeMode: 'cover',
              borderRadius: 5,
            }}
          />
          <View style={{ marginLeft: 13 }}>
            <Text
              style={{
                color: '#979797',
                fontFamily: fontFamily.PoppinsMedium,
                fontSize: 12,
              }}>
              {`${item.from_review_user?.first_name} ${item.from_review_user?.last_name}`}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <StarRating
                starSize={10}
                disabled={true}
                maxStars={5}
                fullStarColor={'#FFC107'}
                rating={parseFloat(item.rating)}
              />
            </View>
            <Text
              style={{
                color: '#979797',
                fontFamily: fontFamily.PoppinsRegular,
                fontSize: 12,
              }}>
              {moment(item.created_at).format('MMM DD YYYY')}
            </Text>
          </View>
        </View>
        {!_.isNil(item.description) && <HTML style={{ padding: 20 }} html={source.toString()} />}
        {/* <Text style={{ color: '#979797', fontFamily: fontFamily.PoppinsItalic, fontSize: 14,padding:19,paddingTop:0 }}>{item.description}</Text> */}
      </View>
    );
  };



  const isShowRankingText = (text) => {
    if (_.isNil(text) !== true && text !== 0 && text !== 0.0) return true
    else return false
  }

  const renderTopBarItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectTabNo(index)
          let offset = 0
          for (const _item of offsetsList) {
            if (_item.index == item.index) offset = _item.offset
          }
          if (scrollViewRef && scrollViewRef.current) scrollViewRef.current.scrollToPosition(1, parseFloat(offset, true))
        }}
        style={styles.renderViewUniSport}>
        <Text
          style={[
            styles.navTopText,
            { color: selectTabNo == index ? 'white' : '#21287F' },
          ]}>
          {item?.title?.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.appLightBlue} />
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 20,
              zIndex: 999,
              width: 80,
              height: 80,
              left: 20,
              // backgroundColor:'red'
            }}
            onPress={() => {
              props.navigation.goBack();
            }}>
            <Entypo
              name="chevron-left"
              size={30}
              color={"black"}
            />
          </TouchableOpacity>
          <View style={styles.renderView}>
            <AvatarComponent
              style={{ resizeMode: 'cover', width: "100%", height: 170 }}
              source={universityAllDetail?.university_banner?.url}
              imageStyle={{ resizeMode: 'cover' }}
              defaultSource={require('../assets/images/university_image.jpeg')}
            />
            <Pressable
              onPress={() => {
                userType ? setShowAlert(true) :
                  favoriteUniversity(itemId)
              }}
              // onPress={() => alert("Hello")}
              style={styles.favTouch}>
              {universityAllDetail.is_favourite == 1 ? (
                <FillHeart style={{ alignSelf: 'center', }} />
              ) : (
                <EmptyHeart style={{ alignSelf: 'center' }} />
              )}
            </Pressable>
            <View style={styles.topHeaderContainer}>
              <AvatarComponent
                style={{ width: 50, height: 50, }}
                imageStyle={{ resizeMode: 'contain' }}
                source={universityAllDetail.profile_picture}
                defaultSource={'https://storage.googleapis.com/sportfolio-stage-media/default/defultlogo.jpg'}
              />
              <View style={{ width: '80%', marginLeft: 10 }}>
                {_.isNil(universityAllDetail?.locations?.name) !== true && <Text
                  style={{
                    color: COLORS.greyTextColor,
                    fontFamily: fontFamily.PoppinsMedium,
                  }}>
                  {`${universityAllDetail?.locations.name} , ${universityAllDetail?.country.name}`}
                  {'\n'}
                  <Text
                    style={{
                      color: '#000000',
                      fontFamily: fontFamily.PoppinsSemiBold,
                    }}>
                    {universityAllDetail?.university_details?.correct_name}
                  </Text>
                </Text>}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {isShowRankingText(universityAllDetail?.university_details?.bucs_overall_rating) &&
                    <Text style={styles.rankingText}>
                      {`${'BUCS RANKING'}- ${universityAllDetail?.university_details?.bucs_overall_rating}`}
                    </Text>
                  }
                  {isShowRankingText(universityAllDetail?.university_details?.bucs_overall_rating) &&
                    isShowRankingText(universityAllDetail?.university_ranking?.institution_ranking) ?
                    <Text style={styles.rankingText}>
                      {`, `}
                    </Text>
                    : null
                  }
                  {isShowRankingText(universityAllDetail?.university_ranking?.institution_ranking) &&
                    <Text style={styles.rankingText}>
                      {`${'University Ranking'}- ${universityAllDetail?.university_ranking?.institution_ranking}`}
                    </Text>
                  }
                </View>
                <View style={styles.socialContainer}>
                  {universityAllDetail?.university_details?.facebook ? (
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(
                          universityAllDetail?.university_details?.facebook,
                        );
                      }}>
                      <Image
                        style={styles.socialIcon}
                        source={require('../assets/images/fb.png')}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {universityAllDetail?.university_details?.linked_in ? (
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(
                          universityAllDetail?.university_details?.linked_in,
                        );
                      }}>
                      <Image
                        style={[styles.socialIcon, { marginLeft: 13 }]}
                        source={require('../assets/images/linkedIn.png')}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.flatListMainView}>
              {/* <Text style={[styles.sportHeading, { color: 'white' }]}>Overview</Text> */}
              <FlatList
                horizontal
                data={topBarItem}
                keyExtractor={(item, index) => `topBarItem_${index}`}
                listKey={'SelectIndustriesScreen' + moment().format('x')}
                removeClippedSubvisews={false}
                renderItem={({ item, index }) => {
                  return renderTopBarItem(item, index);
                }}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  backgroundColor: '#6C63FF',
                  marginTop: 20,
                }}
              />
            </View>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps={'handled'}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              ref={scrollViewRef}>
              {/* university description section start ==============================  */}
              {universityAllDetail?.university_details?.short_note?.length > 0 &&
                <View
                  onLayout={({ nativeEvent }) => {
                    onLayoutChange(0, nativeEvent.layout.y)
                  }}
                >
                  <Text style={[styles.sportHeading]}>Overview</Text>
                  <View style={{ marginHorizontal: 20 }}>
                    <HTML style={styles.descriptionText} html={universityAllDetail?.university_details?.short_note.toString()} />
                  </View>
                  {<View style={{ height: 'auto', borderColor: '#707070', borderBottomWidth: 1 }}>
                    {!_.isNil(universityAllDetail?.university_details?.video) && <YouTube
                      apiKey={'AIzaSyCgP8UZ_WlA7-5snF9Tx48LgdQkgYbBOvA'}
                      videoId={`${universityAllDetail?.university_details?.video?.split('=').pop()}`}// The YouTube video ID
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
                </View>
              }

              {/* university description section end ==============================  */}

              {/* university sportClub Section start ==============================  */}

              {universityAllDetail?.university_club?.length > 0 &&
                <View
                  style={{ borderBottomWidth: 1, borderColor: '#707070' }}
                  onLayout={({ nativeEvent }) => {
                    onLayoutChange(1, nativeEvent.layout.y)
                  }}>
                  <View style={styles.headingContainerBar}>
                    {(<Text style={styles.sportHeading}>Sports</Text>)}
                    {(<Text style={styles.types}>{`${universityAllDetail?.university_club?.length} Types`}</Text>)}
                  </View>
                  {universityAllDetail?.university_club?.map((item, index) => {
                    return renderSportsAccordianItem(item, index, `university_club${index}`);
                  })}
                  {/* <FlatList
                    data={universityAllDetail?.university_club}
                    renderItem={renderSportsAccordianItem}
                    maxToRenderPerBatch={30}
                    initialNumToRender={30}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ width: '100%' }}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                  /> */}
                </View>
              }

              {/* university sportClub Section end ==============================  */}

              {/* university Course section start ==============================  */}
              {universityCourse.length > 0 &&
                <View
                  style={{ borderBottomWidth: 1, borderColor: '#707070' }}
                  onLayout={({ nativeEvent }) => {
                    onLayoutChange(2, nativeEvent.layout.y)
                  }}
                >
                  <View style={styles.headingContainerBar}>
                    <Text style={styles.sportHeading}>Courses</Text>
                    <Text
                      style={styles.types}>{`${universityCourse.length} Types`}</Text>
                  </View>
                  <FlatList
                    data={universityCourse}
                    renderItem={courseItems}
                    keyExtractor={item => item.id}
                    maxToRenderPerBatch={30}
                    initialNumToRender={30}
                    contentContainerStyle={{ width: '100%' }}
                    keyboardShouldPersistTaps={'handled'}
                  />
                </View>
              }



              {/* university Course section end ==============================  */}



              {/* university scholorship Section start ==============================  */}
              {universityAllDetail?.university_scolarship?.length > 0 &&
                <View style={{ borderBottomWidth: 1, borderColor: '#707070' }}
                  onLayout={({ nativeEvent }) => {
                    onLayoutChange(3, nativeEvent.layout.y)
                  }}
                >
                  <Text style={styles.sportHeading}>Scholarships</Text>
                  <FlatList
                    data={universityAllDetail.university_scolarship}
                    renderItem={renderScholorShipAccordianItem}
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
                </View>}
              {/* university scholorship Section end ==============================  */}

              {/* university noticeBoard Section Start ==============================  */}
              {universityAllDetail?.UniversityNoticeBoard?.length > 0 &&
                <View style={{ borderBottomWidth: 1, borderColor: '#707070' }}
                  onLayout={({ nativeEvent }) => {
                    onLayoutChange(4, nativeEvent.layout.y)
                  }}
                >
                  <Text style={styles.sportHeading}>Notice Board</Text>
                  <FlatList
                    data={NoticeBoard}
                    renderItem={renderNoticeBoardAccordianItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ width: '100%' }}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                  />
                </View>}
              {/* university noticeBoard Section end ==============================  */}

              {/* university Notable Alumni Section Start ==============================  */}
              {universityAllDetail?.notable_alumni?.length > 0 ?
                <View style={{ borderBottomWidth: 1, borderColor: '#707070' }}
                  onLayout={({ nativeEvent }) => {
                    onLayoutChange(5, nativeEvent.layout.y)
                  }}
                >
                  <Text style={styles.sportHeading}>Notable Alumni</Text>
                  <FlatList
                    data={universityAllDetail?.notable_alumni}
                    renderItem={({ item, index }) => {
                      return listItems(item, index);
                    }} keyExtractor={item => item.id}
                  />
                </View> : null}
              {/* university Notable Alumni Section end ==============================  */}

              {/* university Rating Section Start ==============================  */}
              {/* {universityAllDetail.review?.length > 0 ? */}
              <View
                style={{ marginTop: 10, borderBottomWidth: 1, borderColor: '#707070' }}
                onLayout={({ nativeEvent }) => {
                  onLayoutChange(6, nativeEvent.layout.y)
                }}>
                <Text style={styles.sportHeading}>Reviews</Text>
                <View style={styles.reviewHeaderContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.ratingText}>{universityAllDetail?.review?.length > 0 ? averageRating.toFixed(1) : '0 Reviews'}</Text>
                    {/* <Text style={styles.ratingText}>{universityAllDetail?.review?.rating}</Text> */}
                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                      <StarRating
                        starSize={16}
                        disabled={true}
                        maxStars={5}
                        fullStarColor={'#FFC107'}
                        rating={averageRating}
                      />
                    </View>
                  </View>
                  {universityAllDetail?.review?.length > 0 && <Text
                    style={
                      styles.reviewCoutHeaderText
                    }>{`Based on ${universityAllDetail.review?.length} Reviews`}</Text>}
                </View>
                <View style={{ padding: 18 }}>
                  <View style={styles.progressContainer}>
                    <Progress.Bar
                      progress={fiveStarRating}
                      width={200}
                      unfilledColor={'#E9ECEF'}
                      borderColor={'#E9ECEF'}
                      height={18}
                    />
                    <Text style={styles.barText}>5 stars</Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <Progress.Bar
                      progress={fourStarRating}
                      width={200}
                      unfilledColor={'#E9ECEF'}
                      borderColor={'#E9ECEF'}
                      height={18}
                    />
                    <Text style={styles.barText}>4 stars</Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <Progress.Bar
                      progress={threeStarRating}
                      width={200}
                      unfilledColor={'#E9ECEF'}
                      borderColor={'#E9ECEF'}
                      height={18}
                    />
                    <Text style={styles.barText}>3 stars</Text>
                  </View>

                  <View style={styles.progressContainer}>
                    <Progress.Bar
                      progress={twoStarRating}
                      width={200}
                      unfilledColor={'#E9ECEF'}
                      borderColor={'#E9ECEF'}
                      height={18}
                    />
                    <Text style={styles.barText}>2 stars</Text>
                  </View>

                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // backgroundColor:'red'
                    alignItems: 'center'
                  }}>
                    <SFButton
                      style={{
                        height: 30,
                        marginTop: 30
                      }}
                      children={"Add Review"}

                      onPress={() => {
                        userType ? setShowAlert(true) :
                          setShowReviewContainer(!showReviewContainer)
                      }}
                    />
                    {showReviewContainer && <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => submitReviewApi()}
                      >
                        <Image
                          source={require('../assets/images/save.png')}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            marginTop: 35,
                            marginRight: 10
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setShowReviewContainer(false)}
                      >
                        <Image
                          source={require('../assets/images/cross.png')}
                          style={{
                            width: 30,
                            height: 30,
                            resizeMode: 'contain',
                            marginTop: 30
                          }}
                        />
                      </TouchableOpacity>
                    </View>}
                  </View>

                  {showReviewContainer && <View>
                    <View style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}>
                      <Text style={{
                        margin: 10,
                        fontSize: 15
                      }}>Rating:</Text>
                      <StarRating
                        starSize={20}
                        disabled={false}
                        maxStars={5}
                        fullStarColor={'#ffa70f'}
                        containerStyle={{
                          marginRight: 'auto',
                          marginTop: 10
                        }}
                        rating={startRating}
                        selectedStar={(rating) => {
                          setStartRating(rating)
                        }}
                      />
                    </View>
                    <TextInput
                      multiline={true}
                      placeholder={"Enter text here"}
                      style={{
                        width: '98%',
                        height: 100,
                        // backgroundColor:'red',
                        marginLeft: 5,
                        marginRight: 5,
                        marginTop: 20,
                        borderWidth: 0.5,
                        borderRadius: 5,
                        borderColor: 'gray',
                        padding: 5
                      }}
                      value={submitReview}
                      onChangeText={(text) => setSubmitReview(text)}
                    />
                  </View>}

                </View>
                <View style={{ paddingLeft: 20, paddingRight: 20, }}>
                  <FlatList
                    data={universityAllDetail.review}
                    // contentContainerStyle={{alignItems:'center'}}
                    renderItem={({ item, index }) => {
                      // console.log('item====>>>',item)
                      return ratingListItems(item, index);
                    }}
                    keyExtractor={item => item.id}
                  />
                </View>
              </View>
              {/* </View> : null} */}
              {/* university Rating Section end ==============================  */}

            </KeyboardAwareScrollView>
          </View>
        </View>
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
        <SFButton
          hideIcon
          style={styles.sfButton}
          textStyle={{ marginTop: 3 }}
          onPress={() => {
            // onClickRegister(itemId);
            userType === 'guest' ? setShowAlert(true) :
              favoriteUniversity(itemId);
            console.log("ITEM====>>>", itemId)
          }}>
          {/* {item?.university_details?.favorite==true?favoriteUniversity:'Register Interest'.toUpperCase()} */}
          {uniFavorite == 1 ? "Interest Registered".toUpperCase() : 'Register Interest'.toUpperCase()}
        </SFButton>
        <Loader visible={showLoader} />
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Alert"
        message="Please Login/Sign up to access this feature"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText="Login"
        confirmText='Cancel'
        cancelButtonColor={COLORS.appAccentBlue}
        confirmButtonColor={COLORS.appAccentBlue}
        showConfirmButton={true}
        onCancelPressed={
          () => {
            dispath(logoutUser())
          }
        }
        onConfirmPressed={() => {
          setShowAlert(false)
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: 'black',
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
    textAlign: 'center',
  },
  flatListMainView: {
    width: '100%',
    backgroundColor: '#6C63FF',
    height: 63,
    marginVertical: 10,
    justifyContent: 'center',

  },
  sportHeading: {
    fontSize: 18,
    color: '#3A3A3A',
    fontFamily: fontFamily.PoppinsBold,
    marginLeft: 20
  },
  types: {
    fontSize: 16,
    color: '#979797',
    fontFamily: fontFamily.PoppinsMedium,
  },
  headingContainerBar: {
    width: '100%',
    justifyContent: 'space-between',
    // paddingLeft: 5,
    paddingRight: 15,
    // marginRight:20,
    flexDirection: 'row',
    marginTop: 5,
  },
  descriptionText: {

  },
  topHeaderContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 15,
  },
  favTouch: {
    position: 'absolute',
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: '#445C77AA',
    // backgroundColor: '#151515',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    top: 20,
    right: 20,
  },
  favIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 2,
  },
  socialIcon: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
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
    // alignSelf: 'center',
    height: '100%',
    backgroundColor: '#6C63FF',
    paddingLeft: 17,
    paddingRight: 17,
    // alignItems: 'center',
    // justifyContent: 'center',
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
    marginTop: 20,
  },
  sfButton: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    borderRadius: 0,
    width: '100%',
  },
  rankingText: {
    color: COLORS.greyTextColor,
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
    color: '#979797',
  },
  findMore: {
    fontSize: 15,
    fontFamily: fontFamily.PoppinsRegular,
    color: '#6C63FF',
    textAlign: 'right',
    // flexWrap: 'wrap'
  },
  descriptionStyle: {
    marginTop: 10,
    fontSize: 16,
    color: '#979797',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E7E8',
    // borderBottomColor: '#F7F7F7'
  },
  accordianContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 7,
    backgroundColor: '#F7F7F7',
    width: '100%',
    borderRadius: 5,
  },
  leftContainerAcordian: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '57%',
  },
  iconStyleAccordian: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginRight: 8,
    tintColor: '#21287F',
  },
  reviewHeaderContainer: {
    width: '100%',
    height: 75,
    // backgroundColor: '#6C63FF',
    // marginTop: 5,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 19,
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 3,
    alignItems: 'center',
  },
  barText: {
    // color: '#979797',
    fontSize: 12,
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 42,
    fontFamily: fontFamily.PoppinsBold,
    // color: 'white',
    marginTop: 5,
  },
  reviewCoutHeaderText: {
    // color: 'white',
    fontSize: 12,
    fontFamily: fontFamily.PoppinsMedium,
  },
});

export default UniversityDetailScreen;
