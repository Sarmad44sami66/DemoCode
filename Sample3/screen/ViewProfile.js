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
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import { COLORS } from '../utils/colors';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import EditSvg from '../assets/images/edit_icon.svg';
import LinkedIn from '../assets/images/linkedInSmallIcon.svg';
import Call from '../assets/images//call.svg';
import Mail from '../assets/images/mail.svg';
import ViewAboutMe from './ViewAboutMe';
import ViewEducation from './ViewEducation';
import { StackActions, useIsFocused } from '@react-navigation/native';
import fontFamily from '../assets/fonts';
import Toast from 'react-native-simple-toast';
import { updateProfilePhoto, getUserProfile, getAllEthnicities, getAllCountries } from '../api/methods/auth';
import { logoutUser, setUser, setUserProfileImage } from '../redux/actions/userSession';
import Loader from '../components/Loader';
import YouTube from 'react-native-youtube';

import ViewQualification from './ViewQualification';
import ViewTeamHistory from './ViewTeamHistory';
import ViewCoachesReport from './ViewCoachesReport';
import ViewVideoLink from './ViewVideoLink';
import EducationDegree from '../assets/images/education_degree.svg'
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import CustomModal from '../components/CustomModal';
import { set } from 'react-native-reanimated';
import RNFetchBlob from 'rn-fetch-blob';
import HTML from 'react-native-render-html';
import { chechPermissionStatus } from '../utils/PermissionsManger';

const imagePickerOptions = {
  quality: 0.3,
};

const HEADINGS = {
  sport: { title: 'ABOUT ME', index: 0 },
  education: { title: 'EDUCATION', index: 1 },
  qualifications: { title: 'QUALIFICATIONS', index: 2 },
  teamHistory: { title: 'TEAM HISTORY', index: 3 },
  additionalCertificates: { title: 'RELEVANT DOCUMENTS', index: 4 },
  videoClips: { title: 'VIDEO LINK', index: 5 },
}

const ViewProfile = props => {

  const [selectedVideo, setSelectedVideo] = useState({})

  const scrollViewRef = useRef(null)
  const { profileImage, currentUser, userType } = useSelector((state) => state.userSession);
  const { route } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.data.date_of_birth)
  const [userGender, setUserGender] = useState(currentUser?.data.gender)
  const [userEthnicity, setEthnicity] = useState('')
  const [userGraduation, setUserGraduation] = useState(currentUser?.data.graduation_status)
  const [userSchool, setUserSchool] = useState(currentUser?.data.school_attended)
  const [userNationality, setUserNationality] = useState('')
  const [userCoursePreference, setUserCoursePreference] = useState(currentUser?.data.course_preference)
  const [userCountry, setUserCountry] = useState('')

  const [profileImage2, setProfileImage] = useState((profileImage !== '' || profileImage !== undefined) ? profileImage : '');
  const [profileImageObject, setProfileImageObject] = useState({});
  // const [profileData, setProfileData] = useState('');
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [selectTabNo, setTabNo] = useState(1);
  const [showLoader, setShowLoader] = useState(true);
  const [profileData, setProfileData] = useState('');
  const [modalVisible, setModalVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [showLinkedInUrl, setShowLinkedInUrl] = useState('')
  const [data, setShowData] = useState(0)
  const [offsetsList, setOffsetsList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [selectTableNo, setSelectTableNo] = useState(0);
  const [showVideos, setShowVideos] = useState(false);
  // const [playVideo, setPlayVideo] = useState(false)
  const [videoModal, setVideoModal] = useState(false)
  // const [topBarItem, setTopBarItem] = useState([
  //   { label: '1', name: 'ABOUT ME', isSelect: true },
  //   { label: '2', name: 'EDUCATION', isSelect: false },
  //   { label: '3', name: 'FURTHER QUALIFICATION', isSelect: false },
  //   { label: '4', name: 'TEAM HISTORY', isSelect: false },
  //   { label: '5', name: 'RELEVANT DOCUMENT', isSelect: false },
  //   { label: '6', name: 'VIDEO LINK', isSelect: false },
  // ]);

  // const videoSeries = [
  //   "DC471a9qrU4",
  //   "tVCYa_bnITg",
  //   "K74l26pE4YA",
  //   "m3OjWNFREJo",
  // ];


  const [topBarItem, setTopBarItem] = useState([]);

  useEffect(() => {
    if (isFocused) {
      userProfile();
      getEthnicities();
    }
    setShowVideos(isFocused)
  }, [isFocused]);

  // useEffect(()=>{
  //   guestUserLogout()
  // },[userType])

  // const guestUserLogout = () =>{
  //   try {
  //     if(userType){
  //       dispatch(logoutUser())
  //       Toast.show("Please login")
  //     }
  //   } catch (error) {
  //     console.log("eroorr==>>", error)
  //   }
  // }

  const setHeader = (profileData) => {
    let tempArray = []
    const keys = Object.keys(HEADINGS)
    for (const item of keys) {
      if (item == 'sport' && profileData?.[item]?.length > 0) {
        tempArray.push(HEADINGS?.[item])
      }
      else if (item == 'education' && profileData?.[item]?.length > 0) {
        tempArray.push(HEADINGS?.[item])
      }
      else if (item == 'qualifications' && profileData?.[item]?.length > 0) {
        tempArray.push(HEADINGS?.[item])
      }
      else if (item == 'teamHistory' && profileData?.[item]?.length > 0) {
        tempArray.push(HEADINGS?.[item])
      }
      else if (item == 'additionalCertificates' && profileData?.[item]?.length > 0) {
        tempArray.push(HEADINGS?.[item])
      }
      else if (item == 'videoClips' && profileData?.[item]?.length > 0) {
        tempArray.push(HEADINGS?.[item])
      }
      else {
        if (profileData?.[item]?.length > 0) {
          tempArray.push(HEADINGS?.[item])
        }
      }
    }

    setTopBarItem(tempArray);
  }

  const getEthnicities = async () => {
    try {
      const response = await getAllEthnicities();
      setShowLoader(false);
      if (response.data.success == true) {

        for (const item of response.data.data) {
          // console.log('m yitem=====>', currentUser.data.ethnicites_id)
          if (item.id == currentUser.data.ethnicites_id)
            setEthnicity(item.name);
        }
      }
    } catch (error) {
      setShowLoader(false);
    }
  };

  const getCountries = async (id) => {
    try {
      const response = await getAllCountries();
      setShowLoader(false);
      if (response.data.success == true) {
        // console.log('kjnijnk===>country',response.data.data)
        for (const item of response.data.data) {
          // console.log("country==========>>>>>>>>>",currentUser.data.country_id)
          if (item.id == id)
            setUserNationality(item.nationality);
        }
      }
      if (response.data.success == true) {
        for (const item of response.data.data) {
          if (item.id == currentUser.data.country_id)
            setUserCountry(item.name)
        }
      }
    } catch (error) {
      setShowLoader(false);
    }
  };

  const userProfile = async () => {
    let tempVideoList = [];
    try {
      const response = await getUserProfile();
      if (response.data.success == true) {
        console.log('user profile====>>>', response.data.profile_data.preferred_location)
        setProfileData(response.data.profile_data)
        setProfileImage(response.data.profile_data.profile_picture)
        getCountries(response.data.profile_data.country_id);
        setHeader(response.data.profile_data);
        response.data.profile_data.videoClips.length > 0 && response.data.profile_data.videoClips.map((item) => {
          tempVideoList.push(item.uploadvideo.split('=').pop())
        })
        setVideoList(tempVideoList);
        console.log('tempVideoList', tempVideoList?.length)
      }

    } catch (error) {
      // Toast.show(error.response.data.error.message)
      setShowLoader(false);
    }
  }


  const updateProfileImage = async (file) => {
    let formData = new FormData();
    formData.append('file', file);
    setShowLoader(true);
    try {
      const response = await updateProfilePhoto(formData);
      setShowLoader(false);
      if (JSON.stringify(response.status) == 200) {
        Toast.show(response.data.message);
        dispatch(setUserProfileImage(response.data.data.url));
        // dispatch(setUser(response.data));
      }
    } catch (error) {
      setShowLoader(false);
      console.log('LoginScreen2', 'loginPress-error', error.response.data);
      //   Toast.show(error.response.data.error.message);
    }
  };

  const onChooseFromLibraryPress = () => {
    launchImageLibrary(imagePickerOptions, onImagePickerResponse);
  };
  const onTakePhotoPress = () => {
    launchCamera(imagePickerOptions, onImagePickerResponse);
  };
  const onImagePickerResponse = response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const source = {
        uri: response.assets[0].uri,
        name: moment().format('x') + '.jpeg',
        type: 'image/jpeg',
      };
      console.log('Response = ', response);
      setProfileImage(response.assets[0].uri);
      setProfileImageObject(source);
      updateProfileImage(source);
    }
  };

  const onLayoutChange = (_index, offset) => {
    console.log("index", _index, "offset", offset)
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

  // const renderTopBarItem = (item, index) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         let array = [...topBarItem];
  //         array.forEach((element, index2) => {
  //           if (index === index2) {
  //             array[index2].isSelect = true;
  //             setTabNo(index2 + 1);
  //           } else {
  //             array[index2].isSelect = false;
  //           }
  //         });
  //         setTopBarItem(array);
  //       }}
  //       style={styles.renderViewUniSport}>
  //       <Text
  //         style={[
  //           styles.navTopText,
  //           { color: item.isSelect === true ? 'white' : '#21287F' },
  //         ]}>
  //         {item.name.toUpperCase()}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };

  const renderTopBarItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectTableNo(index)
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
            { color: selectTableNo == index ? 'white' : '#21287F', },
          ]}>
          {item?.title?.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  };

  // const openDialPad = () => {
  //   let number = '';

  //   if (Platform.OS === 'ios') {
  //     number = `telprompt:${profileData.phone}`;
  //   } else {
  //     number = `tel:${profileData.phone}`;
  //   }
  //   setPhoneNo(profileData.phone)
  //   // Linking.openURL(number).then(supported => {
  //   //   if (!supported) {
  //   //   } else {
  //   //     return Linking.openURL(url)
  //   //       .then(data => console.error('then', data))
  //   //       .catch(err => {
  //   //         throw err;
  //   //       });
  //   //   }
  //   // });
  // };

  //education variables-------------------------------------------->>
  const renderItem = (item, index) => {
    return (
      <View style={styles.rowView}>
        <EducationDegree style={{ marginTop: 5, }} />
        <View style={{ marginLeft: 10, width: '100%' }}>
          <Text style={styles.blueTextStyle}>{`${item.start_date} to ${item.end_date} - ${item.university_name} `}</Text>
          {/* <Text style={styles.grayTextStyle}>{`${item.university} - ${item.university_country}`}</Text> */}
        </View>
      </View>
    )
  }

  // qualification variables-------------------------------------->>
  const renderQualificationList = (item, index) => {
    return (
      <View style={styles.rowView}>
        <EducationDegree style={{ marginTop: 5 }} />
        <View style={{ marginLeft: 10, width: '100%' }}>
          {/* <Text style={styles.blueTextStyle}>{`${item.end_date} - ${item.course} `}<Text style={{ color: '#979797', }}>{`Grade ${item.grade} , ${item.percentage}%`}</Text></Text> */}
          <Text style={styles.blueTextStyle}>{`${item.end_date} - ${item.institute_name} `}</Text>
          {/* <Text style={styles.grayTextStyle}>{`${item.university} - ${item.nationality_name}`}</Text> */}
        </View>
      </View>
    )
  }

  // Team history variables-------------------------------------->>
  const [teamHistoryList, setTeamHistoryList] = useState(profileData?.teamHistory);
  const renderTeamHistory = (item, index) => {
    // console.log('my item===>', item);
    return (
      <View style={{ borderBottomWidth: 1, }}>
        <View style={styles.rowView}>
          <View style={{ width: '50%' }}>
            <Text style={styles.blueTextStyle}>Team Name</Text>
            <Text style={styles.grayTextStyle}>{item?.teamName}</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={styles.blueTextStyle}>Level</Text>
            <Text style={styles.grayTextStyle}>{item?.Level}</Text>
          </View>
        </View>
        <View style={styles.rowView}>
          <View style={{ width: '50%' }}>
            <Text style={styles.blueTextStyle}>Start Date</Text>
            <Text style={styles.grayTextStyle}>{item?.StartDate}</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={styles.blueTextStyle}>End Date</Text>
            <Text style={styles.grayTextStyle}>{item?.EndDate}</Text>
          </View>
        </View>
      </View>
    );
  };


  // Coaches report variables

  const [activeIndex, setActiveIndex] = useState([])


  const downloadDocument = (document) => {
    chechPermissionStatus()
    const { config, fs } = RNFetchBlob;
    var date = new Date()
    // let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
    let DocumentDir = Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
    console.log('downloadDocument-DownloadDir', DocumentDir)
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: false,
        path: `${DocumentDir}/me_${Math.floor(date.getTime() + date.getSeconds() / 2)}.pdf`, // this is the path where your downloaded file will live in
        description: 'Downloading Content.',
        mime: 'application/pdf'

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

  // video link variables
  let videoLinkList = profileData.videoClips;

  const renderVideoLinkList = (item, index) => {
    return (
      // <TouchableOpacity style={styles.videoLinkRowView}
      //   onPress={() => {
      //     Linking.openURL(item.uploadvideo)
      //   }
      //   }
      // >
      //   <Text style={styles.videoLinkBlueTextStyle}>{item.uploadvideo}</Text>
      //   <Image
      //     style={{ width: 15, height: 15, resizeMode: 'contain' }}
      //     source={require('./../assets/images/attachment.png')} />
      // </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          height: 'auto',
          borderColor: '#707070',
          borderBottomWidth: 1,
          marginBottom: 10,
          height: 300,
          backgroundColor: 'black',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
        onPress={() => {
          setSelectedVideo(item)
          setVideoModal(true)
        }}
      >
        {/* {showVideos &&
          <YouTube
            apiKey={'AIzaSyCgP8UZ_WlA7-5snF9Tx48LgdQkgYbBOvA'}
            // videoId={`${item.uploadvideo?.split('=').pop()}`}// The YouTube video ID
            // videoIds={videoList}
            videoIds={videoList}
            // videoId={`https://www.youtube.com/watch?v=Es8Yhzm0kjQ`}// The YouTube video ID
            play={false} // control playback of video with true/false
            fullscreen={false} // control whether the video should play in fullscreen or inline
            loop={false} // control whether the video should loop when ended
            // onReady={e => this.setState({ isReady: true })}
            // onChangeState={e => this.setState({ status: e.state })}
            // onChangeQuality={e => this.setState({ quality: e.quality })}
            // onError={e => this.setState({ error: e.error })}
            style={{ alignSelf: 'stretch', height: 300 }}
          />} */}
        <Image

          source={require('../assets/images/playButton.png')}
        />
      </TouchableOpacity>
    )
  }

  const renderVideoPlayer = () => {
    let videoId = ''
    if (selectedVideo?.uploadvideo?.includes('=')) {
      videoId = selectedVideo?.uploadvideo?.split('=').pop()
    } else {
      videoId = selectedVideo?.uploadvideo?.split('/').pop()
    }
    if (!videoModal || !selectedVideo) return null
    else return (
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <YouTube
            apiKey={'AIzaSyCgP8UZ_WlA7-5snF9Tx48LgdQkgYbBOvA'}
            videoId={videoId}// The YouTube video ID
            // videoId={`Es8Yhzm0kjQ`}// The YouTube video ID
            play={true} // control playback of video with true/false
            fullscreen={false} // control whether the video should play in fullscreen or inline
            loop={false} // control whether the video should loop when ended
            // onReady={e => this.setState({ isReady: true })}
            // onChangeState={e => this.setState({ status: e.state })}
            // onChangeQuality={e => this.setState({ quality: e.quality })}
            // onError={e => this.setState({ error: e.error })}
            style={{ width: '100%', height: '80%' }}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setVideoModal(!videoModal)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ width: '100%', height: '100%' }}>
      <StatusBar backgroundColor={COLORS.appLightBlue} />

      <View style={styles.container}>
        <View style={styles.profileImageView}>
          <View style={{ flexDirection: "row", alignSelf: 'flex-end' }}>
            <Pressable
              onPress={() => {
                props.navigation.navigate('EditProfileTabs', { profileData: profileData, isEdit: true })
              }}
              style={[{
                right: 20,
                bottom: 20,
                // backgroundColor: "red"
              }]}>
              <Image
                style={[styles.favIcon, { tintColor: 'white', marginRight: 20 }]}
                source={require('../assets/images/edit_profile_icon.png')}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                props.navigation.navigate('ProfileScreen');
              }}
              style={[{
                right: 15,
                bottom: 20,
                width: 30,
                // backgroundColor:'black'
              }]}>
              <Image
                style={[styles.favIcon, { tintColor: 'white' }]}
                source={require('../assets/images/setting.png')}
              />
            </Pressable>

          </View>
          <View>
            {(profileImage2 === '' || profileImage2 === null) ? (
              <Image
                style={{
                  width: 120,
                  height: 120,
                  alignSelf: 'center',
                  borderRadius: 60,
                  resizeMode: 'cover',
                }}
                source={require('../assets/images/default_profile_picturejpg.jpg')}
              />
            ) : (
              <Image
                style={{
                  width: 120,
                  height: 120,
                  alignSelf: 'center',
                  borderRadius: 60,
                  resizeMode: 'cover',
                }}
                source={{ uri: profileImage2 }}
              />
            )}
            <Pressable
              onPress={() => setShowOptionModal(true)}
              style={{
                width: 30,
                height: 30,
                backgroundColor: COLORS.appWhite,
                borderRadius: 15,
                alignSelf: 'center',
                position: 'absolute',
                top: profileImage !== '' ? 90 : 80,
                left: 195,
                justifyContent: 'center',
              }}>
              <EditSvg style={{ alignSelf: 'center' }} />
            </Pressable>
          </View>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Poppins-Bold', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 2 }}>
            {profileData !== ''
              ? profileData.first_name + '  ' + profileData.last_name
              : ''}
          </Text>
          {/* <Text style={styles.profileLink}>{profileData.sport_name}</Text> */}
          {_.isNil(profileData?.sport) !== true && <Text style={styles.profileLink}>{profileData?.sport[0]?.SportName}</Text>}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '40%',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowData(1)
                setEmail(profileData.email)
                setModalVisible(true)
                // var urlScheme = `mailto:${profileData.email}?subject=Email&body=Hi Sportfolio Team`;
                // console.log(profileData.email)
                // Linking.canOpenURL(urlScheme).then(supported => {
                //   if (supported) {
                //     setModalVisible(true)
                //   } else {
                //     Toast.show('Email client not installed!', {
                //       position: Toast.position.TOP,
                //       containerStyle: {
                //         width: '70%',
                //         backgroundColor: colors.lightBlue,
                //       },
                //       textStyle: {
                //         color: 'white',
                //       },
                //     });
                //   }
                // });
              }}>
              <Mail />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // openDialPad();
                let number = '';

                if (Platform.OS === 'ios') {
                  number = `telprompt:${profileData.phone}`;
                } else {
                  number = `tel:${profileData.phone}`;
                }
                setShowData(2)
                setPhoneNo(profileData.phone)
                setModalVisible(true)
              }}>
              <Call />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://www.linkedin.com');
                // setShowData(3)
                // setShowLinkedInUrl(profileData.linked_in)
                // setModalVisible(true)
              }}>
              <LinkedIn />
            </TouchableOpacity>
          </View>
        </View>
        <CustomModal
          label={data == 1 ? email : data == 2 ? phoneNo : showLinkedInUrl}
          isVisible={modalVisible}
          onCancel={() => (setModalVisible(false))}
        />

        <View style={styles.flatListMainView}>
          <FlatList
            horizontal
            data={topBarItem}
            // keyExtractor={(item, index) => item.label + index}
            keyExtractor={(item, index) => `topBarItem_${index}`}
            listKey={'SelectIndustriesScreen' + moment().format('x')}
            removeClippedSubvisews={false}
            renderItem={({ item, index }) => {
              return renderTopBarItem(item, index);
            }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ backgroundColor: '#6C63FF' }}
          />
        </View>
        {/* about me section start ------------------------------------------------------------> */}
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}>

          <View style={{ borderBottomWidth: 1, borderColor: '#707070' }}
            onLayout={({ nativeEvent }) => {
              onLayoutChange(0, nativeEvent.layout.y)
            }}>
            <Text style={styles.allAboutText}>About Me</Text>
            <View style={styles.rowView}>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Sport</Text>
                {_.isNil(profileData.sport) !== true && <Text style={styles.grayTextStyle}>{profileData?.sport[0]?.SportName}</Text>}
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Primary Position</Text>
                {_.isNil(profileData.sport) !== true && <Text style={styles.grayTextStyle}>{profileData?.sport[0]?.primaryPositionName}</Text>}
              </View>
            </View>
            {/* <View style={styles.rowView}>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Nationality</Text>
                <Text style={styles.grayTextStyle}>{userNationality}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Date of Birth</Text>
                <Text style={styles.grayTextStyle}>{dateOfBirth}</Text>
              </View>
            </View>
            <View style={styles.rowView}>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Gender</Text>
                <Text style={styles.grayTextStyle}>{userGender}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Ethnicity</Text>
                <Text style={styles.grayTextStyle}>{userEthnicity}</Text>
              </View>
            </View>
            <View style={styles.rowView}>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Graduation Level</Text>
                <Text style={styles.grayTextStyle}>{userGraduation}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>School Attended</Text>
                <Text style={styles.grayTextStyle}>{userSchool}</Text>
              </View>
            </View>
            <View style={styles.rowView}>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Course Preference</Text>
                <Text style={styles.grayTextStyle}>{userCoursePreference}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Country</Text>
                <Text style={styles.grayTextStyle}>{userCountry}</Text>
              </View>
            </View> */}
            <View style={styles.rowView}>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Weight(kg)</Text>
                {_.isNil(profileData.sport) !== true && <Text style={styles.grayTextStyle}>{profileData?.sport[0]?.weight}</Text>}
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>Height(Cm)</Text>
                {_.isNil(profileData.sport) !== true && <Text style={styles.grayTextStyle}>{profileData?.sport[0]?.height !== null ? profileData?.sport[0]?.height : ''}</Text>}
              </View>
            </View>
            {_.isNil(profileData.sport) !== true && <View style={styles.rowView}>
            </View>}
            {_.isNil(profileData.sport) !== true && <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
              <Text style={styles.blueTextStyle}>Notable Info E.g. Predicted Grades</Text>
              <HTML baseFontStyle={styles.grayTextStyle} html={profileData?.sport[0]?.notableInfo == 'null' && '<p' ? '' : profileData?.sport[0]?.notableInfo} />
            </View>}
          </View>


          {/* about me section end ------------------------------------------------------------> */}

          {/* education section Start ------------------------------------------------------------> */}
          {profileData !== '' && profileData.education.length > 0 ? <View style={{ borderBottomWidth: 1, borderColor: '#707070' }}
            onLayout={({ nativeEvent }) => {
              onLayoutChange(1, nativeEvent.layout.y)
            }}>
            <Text style={styles.allAboutText}>Education</Text>
            <View>
              {profileData?.education?.map((item, index) => {
                return renderItem(item, index, `education${index}`);
              })}
              {/* <FlatList
                data={profileData.education}
                keyExtractor={(item, index) => item.label + index}
                listKey={'SelectIndustriesScreen' + moment().format('x')}
                removeClippedSubvisews={false}
                renderItem={({ item, index }) => {
                  return renderItem(item, index);
                }}
              /> */}
            </View>
          </View> : null}
          {/* education section end ------------------------------------------------------------> */}

          {/* qualification section start ------------------------------------------------------------> */}
          {profileData !== '' && profileData.qualifications.length > 0 ? <View style={{ borderBottomWidth: 1, borderColor: '#707070' }}
            onLayout={({ nativeEvent }) => {
              onLayoutChange(2, nativeEvent.layout.y)
            }}>
            <Text style={styles.allAboutText}>Qualification</Text>
            <View style={styles.flatListMainViewQualificatiin}>
              {/* {profileData?.qualifications?.map((item,index)=>{
              return renderQualificationList (item, index, `qualifications${index}`);
            })} */}
              <FlatList
                data={profileData.qualifications}
                listKey={'SelectIndustriesScreen' + moment().format('x')}
                renderItem={({ item, index }) => {
                  return renderQualificationList(item, index);
                }}
                showsVerticalScrollIndicator={true}
              // contentContainerStyle={{ backgroundColor: 'red', }}
              />
            </View>
          </View> : null}
          {/* qualification section end ------------------------------------------------------------> */}

          {/* Team history section start ------------------------------------------------------------> */}
          {profileData !== '' && profileData.teamHistory.length > 0 ?
            <View style={{ borderBottomWidth: 1, borderColor: '#707070' }}
              onLayout={({ nativeEvent }) => {
                onLayoutChange(3, nativeEvent.layout.y)
              }}>
              <Text style={styles.allAboutText}>Team History</Text>
              <View>
                {profileData?.teamHistory?.map((item, index) => {
                  return renderTeamHistory(item, index, `teamHistory${index}`);
                })}
                {/* <FlatList
                data={profileData.teamHistory}
                keyExtractor={(item, index) => item.label + index}
                listKey={'SelectIndustriesScreen' + moment().format('x')}
                removeClippedSubvisews={false}
                renderItem={({ item, index }) => {
                  return renderTeamHistory(item, index);
                }}
              /> */}
              </View>
            </View> : null}

          {/* Team history section end ------------------------------------------------------------> */}

          {/* Coaches Report section start ------------------------------------------------------------> */}
          {profileData !== '' && profileData.additionalCertificates.length > 0 ? <View style={{ borderBottomWidth: 1, borderColor: '#707070' }}
            onLayout={({ nativeEvent }) => {
              onLayoutChange(4, nativeEvent.layout.y)
            }}>
            <View style={styles.saveBtnBarContainer}>
              <Text style={styles.allAboutText}>Relevant Documents</Text>
              {/* <Image
                            style={{ width: 21, height: 21, resizeMode: 'contain' }}
                            source={require('./../assets/images/downloading.png')} /> */}
            </View>
            {/* {profileData?.additionalCertificates?.map((item,index)=>{
              return renderAccordianItem (item, index, `additionalCertificates${index}`)
            })} */}
            <FlatList
              data={profileData.additionalCertificates}
              renderItem={renderAccordianItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ width: '100%' }}
              bounces={false}
              keyboardShouldPersistTaps={'handled'}
            />
          </View> : null}

          {/* Coaches Report section end ------------------------------------------------------------> */}

          {/* Video Link section start ------------------------------------------------------------> */}
          {profileData !== '' && profileData.videoClips.length > 0 ? <View style={{ width: Dimensions.get('window').width, }}
            onLayout={({ nativeEvent }) => {
              onLayoutChange(5, nativeEvent.layout.y)
            }}>
            <Text style={styles.allAboutText}>Video Link</Text>
            <View style={{ flex: 1, height: '100%', width: '100%' }}>
              {/* <View style={{ height: 'auto', borderColor: '#707070', borderBottomWidth: 1, marginBottom: 10, height: 300 }}>
                {showVideos &&
                  <YouTube
                    apiKey={'AIzaSyCgP8UZ_WlA7-5snF9Tx48LgdQkgYbBOvA'}
                    // videoId={`${item.uploadvideo?.split('=').pop()}`}// The YouTube video ID
                    videoIds={videoSeries}
                    // videoId={`https://www.youtube.com/watch?v=Es8Yhzm0kjQ`}// The YouTube video ID
                    play={false} // control playback of video with true/false
                    fullscreen={false} // control whether the video should play in fullscreen or inline
                    loop={false} // control whether the video should loop when ended
                    // onReady={e => this.setState({ isReady: true })}
                    // onChangeState={e => this.setState({ status: e.state })}
                    // onChangeQuality={e => this.setState({ quality: e.quality })}
                    // onError={e => this.setState({ error: e.error })}
                    style={{ alignSelf: 'stretch', height: 300 }}
                    getVideosIndex={(index) => {alert(index)}}
                  />}

              </View> */}
              {profileData?.videoClips?.map((item, index) => {
                return renderVideoLinkList(item, index, `videoClips${index}`)
              })}

              {/* <FlatList
                extraData={videoLinkList}
                data={profileData.videoClips}
                renderItem={renderVideoLinkList}
                showsVerticalScrollIndicator={true}
                keyExtractor={item => item.user_media_id}
                contentContainerStyle={{ flexGrow: 1 }}
              /> */}


              {/* <View style={{ height: 'auto', borderColor: '#707070', borderBottomWidth: 1 }}>
                 <YouTube
                  apiKey={'AIzaSyCgP8UZ_WlA7-5snF9Tx48LgdQkgYbBOvA'}
                  videoId={`${profileData.videoClips[0]?.uploadvideo?.split('=').pop()}`}// The YouTube video ID
                  // videoId={`https://www.youtube.com/watch?v=Es8Yhzm0kjQ`}// The YouTube video ID
                  play={false} // control playback of video with true/false
                  fullscreen={false} // control whether the video should play in fullscreen or inline
                  loop={false} // control whether the video should loop when ended
                  // onReady={e => this.setState({ isReady: true })}
                  // onChangeState={e => this.setState({ status: e.state })}
                  // onChangeQuality={e => this.setState({ quality: e.quality })}
                  // onError={e => this.setState({ error: e.error })}
                  style={{ alignSelf: 'stretch', height: 300 }}
                />
              </View> */}



            </View>
          </View> : null}
        </KeyboardAwareScrollView>
        {/* Video Link section end ------------------------------------------------------------> */}








        {/* {selectTabNo === 1 ? (
            profileData !== '' && <ViewAboutMe userProfile={profileData} />
          ) : selectTabNo === 2 ? (
            <ViewEducation userProfile={profileData} />
          ) : selectTabNo === 3 ? (
            <ViewQualification userProfile={profileData} />
          ) : selectTabNo === 4 ? (
            <ViewTeamHistory userProfile={profileData} />
          ) : selectTabNo === 5 ? (
            <ViewCoachesReport userProfile={profileData} />
          ) : (
            <ViewVideoLink userProfile={profileData} />
          )} */}
        <Modal isVisible={showOptionModal}>
          <View style={[{ justifyContent: 'flex-end' }]}>
            <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
              <View style={{ marginBottom: 15 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowOptionModal(false);
                    setTimeout(() => {
                      onChooseFromLibraryPress();
                    }, 500);
                  }}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 13,
                    borderTopRightRadius: 13,
                  }}>
                  <Text
                    style={{
                      color: COLORS.appAccentBlue,
                      padding: 14,
                      fontSize: 20,
                    }}>
                    {'Choose from Library'}
                  </Text>
                </TouchableOpacity>
                <View style={{ height: 2, width: '100%' }} />
                <TouchableOpacity
                  onPress={() => {
                    setShowOptionModal(false);
                    setTimeout(() => {
                      onTakePhotoPress();
                    }, 500);
                  }}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomLeftRadius: 13,
                    borderBottomRightRadius: 13,
                  }}>
                  <Text
                    style={{
                      color: COLORS.appAccentBlue,
                      padding: 14,
                      fontSize: 20,
                    }}>
                    {'Take Photo'}
                  </Text>
                </TouchableOpacity>
              </View>
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
      <Loader visible={showLoader} />

      {renderVideoPlayer()}
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
    // backgroundColor:COLORS.appAccentBlue,
    fontFamily: fontFamily.PoppinsMedium,
    fontSize: 11,
    textAlign: 'center',
  },
  flatListMainView: {
    width: '100%',
    backgroundColor: '#6C63FF',
  },
  flatListMainViewQualificatiin: {
    width: '100%'
  },
  renderView: {
    // alignSelf: 'center',
    width: '100%',
    backgroundColor: '#6C63FF',
  },
  renderViewUniSport: {
    alignSelf: 'center',
    height: 63,
    backgroundColor: COLORS.appAccentBlue,
    paddingLeft: 17,
    paddingRight: 17,
    alignItems: 'center',
    // width:'100%',
    justifyContent: 'center',
  },
  profileImageView: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    backgroundColor: '#21277F',
  },
  allAboutText: {
    fontSize: 18,
    color: COLORS.appWhite,
    marginTop: 5,
    fontFamily: fontFamily.PoppinsBold,
    textAlign: 'center',
  },
  profileLink: {
    fontSize: 18,
    color: COLORS.appAccentBlue,
    marginBottom: 10,
    fontFamily: fontFamily.PoppinsLight,
    textAlign: 'center',
  },
  favTouch: { alignSelf: 'flex-end' },
  favIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginTop: 2,
    // marginLeft: 20,
  },
  allAboutText: {
    fontSize: 20,
    color: COLORS.appTitleBlue,
    marginTop: 20,
    fontFamily: fontFamily.PoppinsBold,
    marginLeft: 20
  },
  rowView: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 8,
    // backgroundColor:'black'
  },
  blueTextStyle: {
    color: COLORS.appLightBlue,
    fontFamily: fontFamily.PoppinsMedium,
    fontSize: 14
  },
  videoLinkBlueTextStyle: {
    color: COLORS.appLightBlue,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    width: '80%'
  },
  grayTextStyle: {
    color: COLORS.appAccentGreyDark,
    fontFamily: fontFamily.PoppinsLight,
    fontSize: 14
  },
  allAboutText: {
    fontSize: 20,
    color: COLORS.appTitleBlue,
    marginTop: 20,
    fontFamily: fontFamily.PoppinsBold,
    marginLeft: 20
  },
  rowView: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 8,
    // backgroundColor:"red",

  },
  videoLinkRowView: {
    flexDirection: "row",
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginVertical: 8,
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
  blueTextStyle: {
    color: COLORS.appLightBlue,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    width: '80%'
  },
  centeredView: {
    position: "absolute",
    // backgroundColor: 'red',
    width: "100%",
    height: "100%",
    // top: 100,
    // bottom: 20,
    alignItems: "center",
    alignSelf: 'center'
  },
  modalView: {
    // margin: 20,
    backgroundColor: "black",
    borderRadius: 20,
    height: '100%',
    width: "100%",
    alignItems: "center",
    alignSelf: 'center',
    // padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: "auto",
    width: '80%',
    height: 44,
    marginBottom: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default ViewProfile;
