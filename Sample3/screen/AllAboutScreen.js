import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StackActions, useIsFocused } from '@react-navigation/native';
import AppStyles from '../utils/styles';
import UploadProfile from '../assets/images/uploadProfile.svg';
import { COLORS } from '../utils/colors';
import SFButton from '../components/SFButton';
import Header from '../components/Header';
import moment from 'moment';
import { Select } from 'native-base';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import fontFamily from '../assets/fonts';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loader from '../components/Loader';
import {
  getAllEthnicities,
  getAllCountries,
  getAllSports,
  getAllInterestedAreaStudy,
  registerAPI,
  getAllLocation,
  socialLoginAPI
} from '../api/methods/auth';
import Toast from 'react-native-simple-toast';
import MultiSelect from 'react-native-multiple-select';
import _ from 'lodash';
import { LogBox } from 'react-native';

const imagePickerOptions = {
  quality: 0.3,
};

let YearsArray = [];
let YearsArray2 = [];
const AllAboutScreen = props => {

  const { route } = props;
  const { email, password, Data, provider, userData, appleProvider, appleFirstName, appleLastName } = route.params;
  if (provider == 'linkedin') {
    const userSocialFirstName = provider === 'linkedin' ? userData?.user?.firstName : userData?.user?.givenName
    const userSocialLastName = provider === 'linkedin' ? userData?.user?.lastName : userData?.user?.familyName
  }

  const reqPassword = 'Test@1234'

  const vRef = useRef(null)
  const isFocused = useIsFocused();
  useEffect(() => {
    for (let i = 1990; i <= 2021; i++) {
      YearsArray.push(i);
    }
    for (let i = 2021; i <= 2120; i++) {
      YearsArray2.push(i);
    }
    getEthnicities();
    getCountries();
    getPreferredLocation();
    getSports();
    getInterestedAreaStudy();
  }, [isFocused]);
  const [progressSteps, setProgressSteps] = useState([
    { label: '1', active: true },
    { label: '2', active: false },
    { label: '3', active: false },
    { label: '4', active: false },
    { label: '5', active: false },
  ]);
  const [selectedIndex, setIndex] = useState(0);
  const [genderIndex, setGenderIndex] = useState(0);
  const [locationIndex, setLocationIndex] = useState(-1);
  const [degreeIndex, setDegreeIndex] = useState(0);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [profileImageToUpload, setProfileImageToUpload] = useState('');
  const [date, setDate] = useState(new Date());
  const [DatePlannedEnded, setDatePlannedEnded] = useState(new Date());
  const [DateSchoolAttended, setDateSchoolAttended] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [plannedDateToShow, setPlannedDateToShow] = useState('');
  const [schoolAttendedDate, setSchoolAttendedDate] = useState('');
  const [dateToShow, setDateToShow] = useState('');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [plannedEntryDate, setPlannedEntryDate] = useState(false);
  const [schoolAttended, setSchoolAttended] = useState(false);
  const [Ethncity, setEthncity] = useState(null);
  const [Nationality, setNationality] = useState(null);
  const [sportType, setSportType] = useState(null);
  const [InterestedAreas, setInterestedAreas] = useState('');
  const [InterestedAreasList, setInterestedAreasList] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [ethnicitiesList, setEthnicitiesList] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [preferredLocationList, setPreferredLocationList] = useState([]);
  const [sportList, setSportsList] = useState([]);
  const [firstName, setFirstName] = useState(provider=='apple'?userData.first_name:" ");
  const [lastName, setLastName] = useState(provider=='apple'?userData.last_name:" ");
  const [selectedItems, setSelectedItems] = useState([]);

  const getEthnicities = async () => {
    setShowLoader(true);
    try {
      const response = await getAllEthnicities();
      setShowLoader(false);
      if (response.data.success == true) {
        if (Platform.OS == 'android') {
          response.data.data.unshift(
            {
              "id": 0,
              "name": "Ethnicity",
            }
          )
        }
        setEthnicitiesList(response.data.data);
        console.log("Ethnicities============>>>>>>>>>>>", response.data.data)
      }
    } catch (error) {
      setShowLoader(false);
    }
  };
  const getCountries = async () => {
    setShowLoader(true);
    try {
      const response = await getAllCountries();
      setShowLoader(false);
      if (response.data.success == true) {
        if (Platform.OS == 'android') {
          response.data.data.unshift(
            {
              "id": 0,
              "name": "Country of Birth",
            }
          )
        }
        setCountriesList(response.data.data);
      }
    } catch (error) {
      setShowLoader(false);
    }
  };
  const getPreferredLocation = async () => {
    setShowLoader(true);
    try {
      const response = await getAllLocation();
      setShowLoader(false);
      if (response.data.success == true) {
        setPreferredLocationList(response.data.data);
      }
    } catch (error) {
      setShowLoader(false);
    }
  };
  const getSports = async () => {
    setShowLoader(true);
    try {
      const response = await getAllSports();
      setShowLoader(false);
      if (response.data.success == true) {
        if (Platform.OS == 'android') {
          response.data.data.unshift(
            {
              "id": 0,
              "name": "Type or select from the list",
            }
          )
        }
        setSportsList(response.data.data);
      }
    } catch (error) {
      setShowLoader(false);
    }
  };
  const getInterestedAreaStudy = async () => {
    setShowLoader(true);
    try {
      const response = await getAllInterestedAreaStudy();
      setShowLoader(false);
      if (response.data.success == true) {
        // if (Platform.OS == 'android') {
        //   response.data.data.unshift({
        //     "id": 0,
        //     "study_area": "Interested Area(s) of Study",
        //   })
        // }
        setInterestedAreasList(response.data.data);
      }
    } catch (error) {
      setShowLoader(false);
    }
  };

  const registerUser = async () => {
    if (Nationality == null || Nationality == 'Country of Birth') {
      Toast.show('Country of Birth Required');
      return;
    }
    if (Ethncity == null || Ethncity == 'Ethnicity') {
      Toast.show('Ethnicity Required');
      return;
    }
    if (sportType == null || sportType == 'Type or select from the list') {
      Toast.show('Select Sport');
      return;
    }
    if (plannedDateToShow == '') {
      Toast.show('Select Planned Entry Date');
      return;
    }
    if (schoolAttendedDate == '') {
      Toast.show('School Attended Required ');
      return;
    }
    if (selectedItems.length == 0) {
      Toast.show('Select an Interested Area of Study');
      return
    }
    let tempPreferredLocation = [];
    preferredLocationList.map((item, index) => {
      if (item.isSelected) {
        tempPreferredLocation.push(item.id)
      }
    })
    setShowLoader(true);
    let formData = new FormData();
    if ((_.isNil(Data) !== true)) {
      formData.append('user_type', 'user');
      formData.append(
        'graduation_status',
        degreeIndex == 0
          ? 'under_graduate'
          : degreeIndex == 1
            ? 'post_graduate'
            : 'school_student',
      );
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('access_token', Data.user.id);
      formData.append('provider', provider);
      tempPreferredLocation.length > 0 && formData.append(
        'preferred_location', JSON.stringify(tempPreferredLocation));
      formData.append(
        'gender',
        genderIndex == 0 ? 'male' : genderIndex == 1 ? 'Female' : 'other',
      );
      formData.append('date_of_birth', dateOfBirth);
      formData.append('sport_id', sportType);
      formData.append('country_id', Nationality);
      formData.append('ethnicites_id', Ethncity);
      formData.append('course_preference', JSON.stringify(selectedItems));
      formData.append('planned_entry_date', plannedDateToShow);
      formData.append('school_attended', schoolAttendedDate);
      profileImageToUpload !== '' && formData.append('image', profileImageToUpload);
    }
    else {

      console.log(`firstName|${firstName}| lastName|${lastName}|`)

      formData.append('user_type', 'user');
      formData.append(
        'join_as',
        degreeIndex == 0
          ? 'under_graduate'
          : degreeIndex == 1
            ? 'post_graduate'
            : 'school_student',
      );
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('password', provider ? reqPassword : password);
      tempPreferredLocation.length > 0 && formData.append(
        'preferred_location', JSON.stringify(tempPreferredLocation));
      formData.append(
        'gender',
        genderIndex == 0 ? 'male' : genderIndex == 1 ? 'Female' : 'other',
      );
      formData.append('date_of_birth', dateOfBirth);
      formData.append('primary_sport', sportType);
      formData.append('nationality', Nationality);
      formData.append('ethnicity', Ethncity);
      formData.append('course_preference', JSON.stringify(selectedItems));
      formData.append('entry_date', plannedDateToShow);
      formData.append('school_attended', schoolAttendedDate);
      profileImageToUpload !== '' && formData.append('image', profileImageToUpload);
    }
    // console.log('my form data=====>', JSON.stringify(formData))
    try {
      const response = await ((_.isNil(Data) !== true) ? socialLoginAPI(formData) : registerAPI(formData));
      setShowLoader(false);
      if (JSON.stringify(response.status) == 200) {
        console.log('check sign up response======>', response)
        Toast.show('Profile created successfully');
        props.navigation.navigate('WelcomeScreen', { userData: response.data });
      } else {
        console.log(response.data.error.message)
        Toast.show(response.data.error.message);
      }
    } catch (error) {
      setShowLoader(false);
      // console.log('LoginScreen2', 'loginPress-error', error.response);
      Toast.show(error.response.data.error.message);
      // console.log("error=message=>>", error.response.data.error.message);
    }
  };

  const renderItem = (item, index) => {
    return (
      <View style={styles.renderView}>
        <Pressable
          onPress={() => {
            setIndex(index)
          }}
          style={[
            styles.progressOuterView,
            {
              borderColor:
                index == selectedIndex
                  ? COLORS.darkBorder
                  : index < selectedIndex
                    ? COLORS.appAccentBlue
                    : COLORS.grayBorder,
            },
          ]}>
          {index < selectedIndex ? (
            <View
              style={[
                styles.pressibleInnerView,
                { backgroundColor: COLORS.appAccentGreen },
              ]}>
              <Image
                style={styles.tickImage}
                source={require('../assets/images/tick.png')}
              />
            </View>
          ) : (
            <View
              style={[
                styles.pressibleInnerView,
                {
                  backgroundColor:
                    index == selectedIndex ? COLORS.appAccentBlue : '#F5F5F5',
                },
              ]}>
              <Text
                style={{
                  textAlign: 'center',
                  color: index == selectedIndex ? COLORS.appWhite : 'black',
                }}>
                {item.label}
              </Text>
            </View>
          )}
        </Pressable>
        {index !== 4 && <View style={styles.borderLineView}></View>}
      </View>
    );
  };

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setDateOfBirth(moment(currentDate).format('YYYY-MM-DD'));
  };
  const onChangePlannedEntryDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setPlannedEntryDate(Platform.OS === 'ios');
    setDatePlannedEnded(currentDate);
    setPlannedDateToShow(moment(currentDate).format('YYYY-MM-DD'))
    setPlannedDate(moment(currentDate).format('YYYY'));
  };
  const onChangeSchoolAttended = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setSchoolAttended(Platform.OS === 'ios');
    setDateSchoolAttended(currentDate);
    setSchoolAttendedDate(moment(currentDate).format('YYYY-MM-DD'));
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
      Alert.alert(response.error);
    }
    else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorCode);
      Alert.alert(response.errorCode);
    }
    else {
      const source = {
        uri: response.assets[0].uri,
        name: moment().format('x') + '.jpeg',
        type: 'image/jpeg',
      };
      setProfileImageToUpload(source);
      // console.log('Response = ', this.state.listData);
      setProfileImage(response.assets[0].uri);
    }
  };

  const checkFields = () => {
    if (firstName == '') {
      Toast.show('First Name Required');
      return;
    }
    if (lastName == '') {
      Toast.show('Last Name Required');
      return;
    }
    // if (dateOfBirth == '') {
    //   Toast.show('Date of Birth Required');
    //   return;
    // } 
    else {
      setIndex(1);
    }
  };

  const onPressLeftIcon = () => {
    selectedIndex == 0 ? props.navigation.goBack() :
      selectedIndex == 1 ? setIndex(0) :
        selectedIndex == 2 ? setIndex(1) :
          selectedIndex == 3 ? setIndex(2) :
            selectedIndex == 4 ? setIndex(3) : console.log('im press')

  }

  const checkText = (text) => {
    if (!/[^a-zA-Z ]/.test(text)) {
      setSchoolAttendedDate(text)
    }
    else {
      Toast.show('you can enter only alphabets')
    }
  }

  return (
    <KeyboardAwareScrollView
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps={'handled'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Header
          leftButtonIconStyle={{ tintColor: 'black' }}
          leftIcon={require('../assets/images/back.png')}
          rightText={selectedIndex == 3 || selectedIndex == 4 ? 'Skip' : null}
          rightButtonContainerStyle={{ width: '20%' }}
          containerStyle={{ marginVertical: 20 }}
          rightButtonTextStyle={{ color: COLORS.appAccentBlue }}
          onLeftAction={() => {
            onPressLeftIcon()
          }}
          onRightAction={() => {
            selectedIndex == 3 ? setIndex(4) : selectedIndex == 4 ? registerUser() : console.log('i m press')
          }}
        />
        <View style={styles.progressStepsView}>
          <FlatList
            style={{ alignSelf: 'center' }}
            data={progressSteps}
            keyExtractor={(item, index) => item.label + index}
            listKey={'SelectIndustriesScreen' + moment().format('x')}
            horizontal={true}
            removeClippedSubvisews={false}
            renderItem={({ item, index }) => {
              return renderItem(item, index);
            }}
          />
        </View>
        {selectedIndex <= 0 && (
          console.log("First Name==>>>", firstName),
          <View style={{ margin: 40 }}>
            <Text style={styles.allAboutText}>ALL ABOUT YOU!</Text>
            {provider !== 'apple' && <TextInput
              style={[AppStyles.authInput, { marginBottom: 10, marginTop: 10 }]}
              placeholder={'First Name'}
              placeholderTextColor={COLORS.appAccentGreyDark}
              value={firstName}
              onChangeText={text => setFirstName(text)}
            />}

            {provider !== 'apple' && <TextInput
              style={[AppStyles.authInput, { marginBottom: 20, marginTop: 10 }]}
              placeholder={'Last Name'}
              placeholderTextColor={COLORS.appAccentGreyDark}
              value={lastName}
              onChangeText={text => setLastName(text)}
            />}
            <View>
              <Text style={styles.genderText}>Select your gender.</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={() => setGenderIndex(0)}
                style={styles.genderPressView1}>
                <View
                  style={[
                    styles.crircleView,
                    {
                      borderColor:
                        genderIndex == 0
                          ? COLORS.appAccentBlue
                          : COLORS.darkBorder,
                    },
                  ]}>
                  <View
                    style={[
                      styles.circleInnerView,
                      {
                        backgroundColor:
                          genderIndex == 0
                            ? COLORS.appAccentBlue
                            : 'transparent',
                      },
                    ]}></View>
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginLeft: 20,
                    color:
                      genderIndex == 0
                        ? COLORS.appAccentBlue
                        : COLORS.darkBorder,
                    fontFamily: fontFamily.PoppinsSemiBold,
                  }}>
                  Male
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setGenderIndex(1)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '50%',
                }}>
                <View
                  style={[
                    styles.crircleView,
                    {
                      borderColor:
                        genderIndex == 1
                          ? COLORS.appAccentBlue
                          : COLORS.darkBorder,
                    },
                  ]}>
                  <View
                    style={[
                      styles.circleInnerView,
                      {
                        backgroundColor:
                          genderIndex == 1
                            ? COLORS.appAccentBlue
                            : 'transparent',
                      },
                    ]}></View>
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginLeft: 20,
                    color:
                      genderIndex == 1
                        ? COLORS.appAccentBlue
                        : COLORS.darkBorder,
                    fontFamily: fontFamily.PoppinsSemiBold,
                  }}>
                  Female
                </Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => setGenderIndex(2)}
              style={{ flexDirection: 'row', width: '50%', marginVertical: 20 }}>
              <View
                style={[
                  styles.crircleView,
                  {
                    borderColor:
                      genderIndex == 2
                        ? COLORS.appAccentBlue
                        : COLORS.darkBorder,
                  },
                ]}>
                <View
                  style={[
                    styles.circleInnerView,
                    {
                      backgroundColor:
                        genderIndex == 2 ? COLORS.appAccentBlue : 'transparent',
                    },
                  ]}></View>
              </View>
              <Text
                style={{
                  alignSelf: 'center',
                  marginLeft: 20,
                  color:
                    genderIndex == 2 ? COLORS.appAccentBlue : COLORS.darkBorder,
                  fontFamily: fontFamily.PoppinsSemiBold,
                }}>
                Other
              </Text>
            </Pressable>
            <Pressable onPress={() => setShow(true)} style={styles.DOBView}>
              <Text style={styles.grayTextStyle}>
                {dateOfBirth == '' ? 'DOB' : dateOfBirth}
              </Text>
              <Image
                style={styles.calenderIcon}
                source={require('../assets/images/calendar.png')}
              />
            </Pressable>
            <SFButton
              hideIcon
              onPress={() => checkFields()}
              isFlat
              style={styles.sfbutton}
              textStyle={{ marginTop: 4 }}>
              Next
            </SFButton>
          </View>
        )}
        {selectedIndex > 0 && selectedIndex <= 1 && (
          <View style={{ margin: 40 }}>
            <Text style={styles.allAboutText}>ALL ABOUT YOU!</Text>
            <View>
              <Text style={styles.genderText}>Join as a.</Text>
            </View>
            <View style={{}}>
              <Pressable
                onPress={() => setDegreeIndex(0)}
                style={[styles.genderPressView1, { width: '80%' }]}>
                <View
                  style={[
                    styles.crircleView,
                    {
                      borderColor:
                        degreeIndex == 0
                          ? COLORS.appAccentBlue
                          : COLORS.darkBorder,
                    },
                  ]}>
                  <View
                    style={[
                      styles.circleInnerView,
                      {
                        backgroundColor:
                          degreeIndex == 0
                            ? COLORS.appAccentBlue
                            : 'transparent',
                      },
                    ]}></View>
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginLeft: 10,
                    color:
                      degreeIndex == 0
                        ? COLORS.appAccentBlue
                        : COLORS.darkBorder,
                    fontFamily: fontFamily.PoppinsSemiBold,
                  }}>
                  Undergraduate
                </Text>
              </Pressable>
            </View>
            <View>
              <Pressable
                onPress={() => setDegreeIndex(1)}
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  width: '80%',
                  marginTop: 10,
                }}>
                <View
                  style={[
                    styles.crircleView,
                    {
                      borderColor:
                        degreeIndex == 1
                          ? COLORS.appAccentBlue
                          : COLORS.darkBorder,
                    },
                  ]}>
                  <View
                    style={[
                      styles.circleInnerView,
                      {
                        backgroundColor:
                          degreeIndex == 1
                            ? COLORS.appAccentBlue
                            : 'transparent',
                      },
                    ]}></View>
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginLeft: 10,
                    color:
                      degreeIndex == 1
                        ? COLORS.appAccentBlue
                        : COLORS.darkBorder,
                    fontFamily: fontFamily.PoppinsSemiBold,
                  }}>
                  Postgraduate
                </Text>
              </Pressable>
            </View>
            <ScrollView nestedScrollEnabled={true} style={[styles.pickerContainer, { marginTop: 50 }]}>
              <Select
                // iosHeader="Select one"
                // mode="dropdown"
                listMode="SCROLLVIEW"
                textStyle={{ fontWeight: 'bold', color: COLORS.appAccentGreyDark, }}
                style={{ width: '100%' }}
                itemStyle={{
                  marginLeft: 0,
                  paddingLeft: 10,
                  fontWeight: 'bold',
                }}
                itemTextStyle={{ color: '#788ad2', fontWeight: 'bold' }}
                selectedValue={Nationality}
                onValueChange={value => setNationality(value)}
                placeholder={'Country of Birth'}
                iosIcon={
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      tintColor: COLORS.appAccentBlue,
                      marginRight: 20,
                    }}
                    source={require('../assets/images/down_arrow.png')}
                  // listMode="MODAL" 
                  />
                }>
                {countriesList.map(item => {
                  return (
                    <Select.Item
                      color={COLORS.appAccentGreyDark}
                      label={item.name}
                      value={item.id}
                    />
                  );
                })}
              </Select>
            </ScrollView>
            <View style={[styles.pickerContainer, { marginTop: 30 }]}>
              <Select
                textStyle={{
                  fontWeight: 'bold',
                  color: COLORS.appAccentGreyDark,
                  // backgroundColor:'red',
                  width: '80%'
                }}
                style={{ width: '100%', }}
                itemStyle={{
                  marginLeft: 0,
                  paddingLeft: 10,
                  fontWeight: 'bold',
                  color: COLORS.appAccentGreyDark,
                }}
                itemTextStyle={{
                  color: COLORS.appAccentGreyDark,
                  fontWeight: 'bold',
                }}
                selectedValue={Ethncity}
                onValueChange={value => setEthncity(value)}
                placeholder={'Ethnicity'}
                iosIcon={
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      tintColor: COLORS.appAccentBlue,
                      marginRight: 20,
                    }}
                    source={require('../assets/images/down_arrow.png')}
                  />
                }>
                {ethnicitiesList.map(item => {
                  return (
                    <Select.Item
                      color={COLORS.appAccentGreyDark}
                      label={item.name}
                      value={item.id}
                    />
                  );
                })}
              </Select>
            </View>
            <SFButton
              hideIcon
              onPress={() => {
                if (Nationality == null || Nationality == 'Country of Birth') {
                  Toast.show('Country of Birth Required');
                  return;
                }
                if (Ethncity == null || Ethncity == 'Ethnicity') {
                  Toast.show('Ethnicity Required');
                  return;
                } else {
                  setIndex(2);
                }
              }}
              isFlat
              style={styles.sfbutton}
              textStyle={{ marginTop: 4 }}>
              Next
            </SFButton>
          </View>
        )}
        {selectedIndex > 1 && selectedIndex <= 2 && (
          <View style={{ margin: 40 }}>
            <Text style={styles.allAboutText}>ALL ABOUT YOU!</Text>
            <View>
              <Text style={styles.genderText2}>Choose your sport</Text>
              <View
                style={[
                  styles.pickerContainer,
                  { borderRadius: 10, height: 60, justifyContent: 'center' },
                ]}>
                <Select
                  textStyle={{
                    fontWeight: 'bold',
                    color: COLORS.appAccentGreyDark,
                  }}
                  placeholderStyle={{ fontWeight: 'bold' }}
                  style={{ width: '100%' }}
                  itemStyle={{
                    marginLeft: 0,
                    paddingLeft: 10,
                    fontWeight: 'bold',
                  }}
                  itemTextStyle={{ color: '#788ad2', fontWeight: 'bold' }}
                  selectedValue={sportType}
                  onValueChange={value => setSportType(value)}
                  placeholder={'Type or select from the list'}
                  iosIcon={
                    <Image
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        tintColor: COLORS.appAccentBlue,
                        marginRight: 20,
                      }}
                      source={require('../assets/images/down_arrow.png')}
                    />
                  }>
                  {sportList.map(item => {
                    return (
                      <Select.Item
                        color={COLORS.appAccentGreyDark}
                        label={item.name}
                        value={item.id}
                      />
                    );
                  })}
                </Select>
              </View>
              <Pressable
                onPress={() => setPlannedEntryDate(true)}
                style={[
                  styles.DOBView,
                  { marginTop: 30, borderRadius: 10, height: 60 },
                ]}>
                <Text style={styles.grayTextStyle}>
                  {plannedDateToShow == '' ? 'Planned Entry Year' : plannedDateToShow}
                </Text>
                <Image
                  style={styles.calenderIcon}
                  source={require('../assets/images/down_arrow.png')}
                />
              </Pressable>
              <TextInput
                style={[AppStyles.authInput, { marginTop: 30, fontSize: 14, color: COLORS.appAccentGreyDark, paddingLeft: 10, fontFamily: fontFamily.PoppinsBold }]}
                placeholder={'School Attended/Attending'}
                // keyboardType={'decima l-pad'}
                // maxLength={20}
                placeholderTextColor={COLORS.appAccentGreyDark}
                value={schoolAttendedDate}
                onChangeText={text => checkText(text)}
              />
              {/* <Pressable
                onPress={() => setSchoolAttended(true)}
                style={[styles.DOBView, { marginTop: 30 }]}>
                <Text style={styles.grayTextStyle}>
                  {schoolAttendedDate == ''
                    ? 'School Attended/Attending'
                    : schoolAttendedDate}
                </Text>
                <Image
                  style={styles.calenderIcon}
                  source={require('../assets/images/calendar.png')}
                />
              </Pressable> */}
              <View
                style={[
                  styles.pickerContainer,
                  {
                    marginTop: 30,
                    borderRadius: 10,
                    height: 'auto',
                    justifyContent: 'center',
                    backgroundColor: "transparent"
                  },
                ]}>
                <MultiSelect
                  fontSize={16}
                  styleDropdownMenuSubsection={{ backgroundColor: "#F5F5F5", paddingLeft: 10, height: 60 }}
                  inputGroup={{ backgroundColor: "#F5F5F5", }}
                  // hideTags
                  items={InterestedAreasList}
                  uniqueKey="id"
                  ref={vRef}
                  onSelectedItemsChange={(item) => onSelectedItemsChange(item)}
                  selectedItems={selectedItems}
                  selectText="Interested Area(s) of Study"
                  searchInputPlaceholderText="Interested Area(s) of Study"
                  onChangeInput={(text) => console.log(text)}
                  // altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  styleSelectorContainer={{ color: 'red', backgroundColor: "red" }}
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="study_area"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor={COLORS.appAccentBlue}
                  submitButtonText="Submit"
                />
              </View>
            </View>
            <SFButton
              hideIcon
              onPress={() => {
                if (sportType == null || sportType == 'Type or select from the list') {
                  Toast.show('Select Sport');
                  return;
                }
                if (plannedDateToShow == '') {
                  Toast.show('Select Planned Entry Date');
                  return;
                }
                if (schoolAttendedDate == '') {
                  Toast.show('please add school attended date ');
                  return;
                }
                if (selectedItems == []) {
                  Toast.show('Select an Interested Area of Study');
                  return
                }
                else {
                  setIndex(3);
                }
              }}
              isFlat
              style={[styles.sfbutton, { marginTop: 70 }]}
              textStyle={{ marginTop: 4 }}>
              Next
            </SFButton>
          </View>
        )}
        {selectedIndex > 2 && selectedIndex <= 3 && (
          <View style={{ margin: 40 }}>
            <Text style={styles.allAboutText}>ALL ABOUT YOU!</Text>
            <View>
              <Text style={[styles.genderText, { marginTop: 30 }]}>Location preference</Text>
            </View>
            {preferredLocationList.length > 0 && preferredLocationList.map((item, index) => {
              return (
                <View style={styles.checkBoxMainContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      let tempArray = preferredLocationList;
                      tempArray[index].isSelected = !item.isSelected;
                      setPreferredLocationList([...tempArray])
                    }}
                    style={[styles.checkBoxContainer, { backgroundColor: item.isSelected ? '#21287F' : 'white' }]}
                  >
                    {item.isSelected && <Image source={require('./../assets/images/tick.png')} style={styles.checkTick} />}
                  </TouchableOpacity>
                  <Text style={styles.checkText}>{item.name}</Text>
                </View>
              )
            })}
            <SFButton
              hideIcon
              onPress={() => setIndex(4)}
              isFlat
              style={[styles.sfbutton, { marginTop: "20%" }]}
              textStyle={{ marginTop: 4 }}>
              Next
            </SFButton>
          </View>
        )}
        {selectedIndex > 3 && selectedIndex <= 4 && (
          <View style={{ marginTop: 40, marginBottom: 20 }}>
            <Text style={[styles.allAboutText, { textAlign: 'center' }]}>
              ALMOST THERE
            </Text>
            <View style={{ justifyContent: "center", height: 300 }}>
              {profileImage !== '' ? (
                <Image
                  style={{
                    width: 120,
                    height: 120,
                    alignSelf: 'center',
                    borderRadius: 60,
                    resizeMode: 'cover',
                  }}
                  source={{ uri: profileImage }}
                />
              ) : (
                <UploadProfile style={{ alignSelf: 'center' }} />
              )}
              <Pressable
                onPress={() => {
                  setShowOptionModal(true);
                }}
                style={styles.plusIconView}>
                <Image
                  style={styles.tickImage}
                  source={require('../assets/images/plus.png')}
                />
              </Pressable>
              <Text style={[styles.uploadPictureText, { textAlign: 'center' }]}>
                Upload your profile picture
              </Text>
            </View>
            <SFButton
              hideIcon
              onPress={() => {
                registerUser();
                // if (profileImage == '') {
                //   Toast.show('Please select profile image');
                //   return;
                // } else {
                //   registerUser();
                // }
                // props.navigation.navigate('WelcomeScreen')
              }}
              isFlat
              style={[styles.sfbutton, { marginTop: 70, width: '80%', alignSelf: 'center' }]}
              textStyle={{ marginTop: 4 }}>
              CREATE SPORTFOLIO
            </SFButton>
          </View>
        )}
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
        <Modal isVisible={plannedEntryDate}>
          <View
            style={{
              backgroundColor: COLORS.appWhite,
              borderRadius: 10,
              width: '50%',
              alignSelf: 'center',
              height: "auto"
            }}>
            <ScrollView
              keyboardShouldPersistTaps={'handled'}
              style={{
                width: '60%',
                alignSelf: 'center',
                backgroundColor: 'white',
              }}>
              {YearsArray2.map((item, index) => {
                return (
                  <TouchableOpacity style={{ marginVertical: 10 }}>
                    <Text
                      onPress={() => {
                        setPlannedDateToShow(item)
                        setPlannedEntryDate(false);
                      }}
                      style={{ textAlign: 'center' }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
        {Platform.OS == 'android' ? (
          schoolAttended && (
            <DateTimePicker
              testID="dateTimePicker"
              value={DateSchoolAttended}
              mode={mode}
              is24Hour={true}
              display="spinner"
              onChange={onChangeSchoolAttended}
            />
          )
        ) : (
          <Modal
            animationType="slide"
            transparent={true}
            visible={schoolAttended}>
            <TouchableOpacity
              onPress={() => {
                setSchoolAttended(false);
              }}
              style={styles.modalMainView}>
              <View style={styles.datePickerView}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={DateSchoolAttended}
                  mode={mode}
                  is24Hour={true}
                  display="spinner"
                  onChange={onChangeSchoolAttended}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
      {Platform.OS == 'android' ? (
        show && (
          <DateTimePicker
            style={{ flex: 1 }}
            testID="dateTimePicker"
            value={date}
            mode={mode}
            maximumDate={new Date()}
            is24Hour={true}
            display="spinner"
            onChange={onChange}
          />
        )
      ) : (
        <Modal animationType="slide" transparent={true} visible={show}>
          <TouchableOpacity
            onPress={() => {
              setShow(false);
            }}
            style={styles.modalMainView}>
            <View style={styles.datePickerView}>
              <DateTimePicker
                textColor="black"
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                is24Hour={true}
                maximumDate={new Date()}
                display="spinner"
                onChange={onChange}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      <Loader visible={showLoader} />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appWhite,
  },
  calenderIcon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    tintColor: COLORS.appAccentGreyDark,
  },
  progressStepsView: {
    width: '90%',
    alignSelf: 'center',
  },
  progressOuterView: {
    borderWidth: 1,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  renderView: {
    flexDirection: 'row',
  },
  pressibleInnerView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  borderLineView: {
    width: 20,
    borderWidth: 0.8,
    alignSelf: 'center',
    borderColor: COLORS.grayBorder,
  },
  sfbutton: {
    marginTop: '40%',
    width: '100%',
  },
  allAboutText: {
    fontSize: 25,
    color: COLORS.appTitleBlue,
    // marginBottom: 20,
    fontFamily: fontFamily.PoppinsSemiBold,
  },
  uploadPictureText: {
    fontSize: 20,
    color: 'black',
    marginTop: 30,
    fontFamily: fontFamily.PoppinsRegular,
    width: '70%',
    alignSelf: 'center',
  },
  genderText: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: fontFamily.PoppinsMedium,
  },
  genderText2: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 30,
    fontFamily: fontFamily.PoppinsMedium,
  },
  genderPressView1: {
    flexDirection: 'row',
    width: '40%',
  },
  crircleView: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    borderWidth: 1,
  },
  circleInnerView: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignSelf: 'center',
  },
  tickImage: {
    width: 20,
    height: 20,
    tintColor: COLORS.appWhite,
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
  checkText: {
    fontSize: 13,
    color: '#979797',
    marginLeft: 9,
    fontFamily: fontFamily.PoppinsMedium,
  },
  pickerContainer: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
    // backgroundColor:'red'
  },
  plusIconView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.appAccentBlue,
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  DOBView: {
    height: 60,
    backgroundColor: COLORS.appAccentGreyLight,
    borderRadius: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  grayTextStyle: {
    color: COLORS.appAccentGreyDark,
    fontFamily: fontFamily.PoppinsBold,
    alignSelf: 'center',
  },
  modalMainView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  datePickerView: {
    width: '80%',
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    // justifyContent: 'center',
  },
});

export default AllAboutScreen;
