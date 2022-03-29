import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Dimensions, Image, Pressable, Alert, TextInput, ScrollView, Platform, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Select } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { StackActions, useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import AppStyles from '../utils/styles';
import { COLORS } from '../utils/colors';
import fontFamily from '../assets/fonts';
import Loader from '../components/Loader';
import InputField from './../components/RegistrationInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { getAllCountries, updateProfile, getAllSports, getUserProfile, getAllLocation } from '../api/methods/auth';

let YearsArray = [];
let YearsArray2 = [];
const EditProfile = (props) => {
  const isEdit = props.isEdit;
  let aboutMeDetail = props.userProfile;
  var userSportObject = aboutMeDetail?.sport[0];
  const { currentUser } = useSelector((state) => state.userSession);
  // console.log('my value===>', currentUser)
  const [showLoader, setShowLoader] = useState(false);
  const [sportsCategoryPositionList, setSportsCategoryPositionList] = useState([]);
  const [sportType, setSportType] = useState(-1);
  const [sportCategoryPosition, setSportCategoryPosition] = useState(-1);
  const [sportList, setSportsList] = useState([]);
  const [Email, setEmail] = useState(currentUser?.data.email)
  const [firstName, setFirstName] = useState(currentUser?.data.first_name)
  const [lasttName, setLastName] = useState(currentUser?.data.last_name)
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.data.phone)
  const [linkedIn, setLinkedin] = useState(currentUser?.data.linked_in)
  const [countriesList, setCountriesList] = useState([]);
  const [Nationality, setNationality] = useState(currentUser?.data.country_id);
  const [sport, setSport] = useState(currentUser?.data?.sport_id);

  // console.log("Current user=======================>>>>>>>>>>>>", currentUser)
  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.data.date_of_birth);
  const [show, setShow] = useState(false);
  const [plannedDateToShow, setPlannedDateToShow] = useState(currentUser?.data.planned_entry_date);
  const [plannedEntryDate, setPlannedEntryDate] = useState(false);
  const [schoolAttendedDate, setSchoolAttendedDate] = useState(currentUser?.data.school_attended);
  const [preferredLocation, setPreferredLocation] = useState(null)
  const [preferredLocationList, setPreferredLocationList] = useState([])
  const [mode, setMode] = useState('date');
  const [date, setDate] = useState(new Date());
  // const [sportCategoryType, setSportCategoryType] = useState(0);

  // console.log("Current user preferred location===>>>",currentUser?.data)


  const isFocused = useIsFocused();

  useEffect(() => {
    for (let i = 2021; i <= 2120; i++) {
      YearsArray2.push(i);
    }
   
    userProfile();
    getCountries();
    getSports();
  }, [isFocused]);

  const getCountries = async () => {
    setShowLoader(true);
    try {
      const response = await getAllCountries();
      setShowLoader(false);
      if (response.data.success == true) {
        setCountriesList(response.data.data);
      }
    } catch (error) {
      setShowLoader(false);
    }
  };
  const userProfile = async () => {
    setShowLoader(true);
    try {
      const response = await getUserProfile();
      if (response.data.success == true) {
        setSportType(response.data.profile_data.sport[0]?.sport_id);
        getPreferredLocation(response.data.profile_data.preferred_location);
      }

    } catch (error) {
      setShowLoader(false);
      console.log('i m here')
      // Toast.show(error.response.data.error.message)
    }
  }
  const getSports = async () => {
    setShowLoader(true);
    try {
      const response = await getAllSports();
      // console.log("Response=======>>>>>", response)
      setShowLoader(false);
      if (response.data.success == true) {
        // console.log("Response ===============>>>", response)
        if (Platform.OS == 'android') {
          response.data.data.unshift({
            id: -1,
            name: 'Select Sport',
          });
        }
        setSportsList(response.data.data);
        // if (isEdit) {
        //   setSportType(userSportObject?.sport_id);
        // }
      }
    } catch (error) {
      console.log("Response=======>>", error)
      setShowLoader(false);
    }
  };



  const getPreferredLocation = async (id) => {
    setShowLoader(true);
    try {
      const response = await getAllLocation();
      setShowLoader(false);
      if (response.data.success == true) {
        // console.log('preferred location list==>>', response.data.data)
        setPreferredLocationList(response.data.data);
        setPreferredLocation(response.data.data[id -1].id);
      }
      
    } catch (error) {
      setShowLoader(false);
    }
  };
  
  const userProfileUpdate = async () => {
    setShowLoader(true);
    let Data = {
      first_name: firstName,
      last_name: lasttName,
      phone: phoneNumber,
      email: Email,
      country_id: Nationality,
      date_of_birth: dateOfBirth,
      planned_entry_date: plannedDateToShow,
      linked_in: linkedIn,
      sport_id: sportType,
      preferred_location: preferredLocation,
      youtube: "#youtube"
    }
    // console.log('my response======>',Data.data)
    try {
      const response = await updateProfile(Data);
      setShowLoader(false);
      if (response.data.success == true) {
        console.log(' response======>', response.status)
        console.log(' response======>', response.data)
        Toast.show(response.data.message)
      }
    } 
    catch (error) {
      console.log('my error======>', error)
      setShowLoader(false);
    }
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

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <StatusBar backgroundColor={COLORS.appLightBlue} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.saveBtnBarContainer}>
            <Text style={styles.allAboutText}>Profile Details</Text>
          </View>
          <View style={styles.rowView}>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>Email</Text>
              <InputField
                placeholder={"Email"}
                keyboardType={'phone-pad'}
                value={Email}
                mainStyle={{ height: 50 }}
                onChangeText={(text) => setEmail(text)}
                editable={false}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>Phone No.</Text>
              <InputField
                placeholder={"Phone No."}
                keyboardType={'phone-pad'}
                value={phoneNumber}
                mainStyle={{ height: 50 }}
                onChangeText={(text) => setPhoneNumber(text)}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>LinkedIn</Text>
              <InputField
                placeholder={"LinkedIn link"}
                keyboardType={'phone-pad'}
                value={linkedIn}
                mainStyle={{ height: 50 }}
                onChangeText={(text) => setLinkedin(text)}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>First Name</Text>
              <InputField
                placeholder={"First Name"}
                value={firstName}
                mainStyle={{ height: 50 }}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>Last Name</Text>
              <InputField
                placeholder={"Last Name"}
                value={lasttName}
                mainStyle={{ height: 50 }}
                onChangeText={(text) => setLastName(text)}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>Sport</Text>
              <View style={[styles.pickerContainer, { height: 50, borderRadius: 5 }]}>
                <Select
                  iosHeader="Select one"
                  mode="dropdown"
                  textStyle={{ fontWeight: 'bold', color: COLORS.appAccentGreyDark, }}
                  style={{ width: '100%' }}
                  itemStyle={{
                    marginLeft: 0,
                    paddingLeft: 10,
                    fontWeight: 'bold',
                  }}
                  itemTextStyle={{ color: '#788ad2', fontWeight: 'bold' }}
                  selectedValue={sportType}
                  onValueChange={value => {
                    setSportType(value)
                    console.log(" sport value===>>>", value)
                  }
                  }
                  placeholder={'Sport'}
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
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>Nationality</Text>
              <View style={[styles.pickerContainer, { height: 50, borderRadius: 5 }]}>
                <Select
                  iosHeader="Select one"
                  mode="dropdown"
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
              </View>
            </View>



            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>Preferred Locations </Text>
              <View style={[styles.pickerContainer, { height: 50, borderRadius: 5 }]}>
                <Select
                  iosHeader="Select one"
                  mode="dropdown"
                  textStyle={{ fontWeight: 'bold', color: COLORS.appAccentGreyDark, }}
                  style={{ width: '100%' }}
                  itemStyle={{
                    marginLeft: 0,
                    paddingLeft: 10,
                    fontWeight: 'bold',
                  }}
                  itemTextStyle={{ color: '#788ad2', fontWeight: 'bold' }}
                  selectedValue={preferredLocation}
                  onValueChange={(value) => setPreferredLocation(value)}
                  placeholder={'Preferred Location'}
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
                  {preferredLocationList.map(item => {
                    // console.log('location list===>>>', preferredLocationList)
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
            </View>






            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>Date of Birth</Text>
              <Pressable onPress={() => setShow(true)} style={styles.DOBView}>
                <Text style={styles.grayTextStyle}>
                  {dateOfBirth == '' ? 'DOB' : dateOfBirth}
                </Text>
                <Image
                  style={styles.calenderIcon}
                  source={require('../assets/images/calendar.png')}
                />
              </Pressable>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.blueTextStyle}>Planned Entry Date</Text>
              <Pressable
                onPress={() => setPlannedEntryDate(true)}
                style={[
                  styles.DOBView,
                  { borderRadius: 10, height: 50 },
                ]}>
                <Text style={styles.grayTextStyle}>
                  {plannedDateToShow == '' ? 'Planned Entry Date' : plannedDateToShow}
                </Text>
                <Image
                  style={styles.calenderIcon}
                  source={require('../assets/images/down_arrow.png')}
                />
              </Pressable>
            </View>
          </View>
          <Pressable
            onPress={() => {
              userProfileUpdate();
            }}
            style={styles.marketingView2}>
            <Text style={[styles.marketingText, { color: COLORS.appWhite }]}>
              Save
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
      <Modal isVisible={plannedEntryDate}>
        <View
          style={{
            backgroundColor: COLORS.appWhite,
            borderRadius: 10,
            width: '50%',
            alignSelf: 'center',
            height: "auto",
            height: '60%'
          }}>
          <ScrollView
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
    </View>
  );
};
export default EditProfile;

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
    marginLeft: 20,
  },
  rowView: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginHorizontal: 20,
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center'
  },
  blueTextStyle: {
    color: COLORS.appLightBlue,
    fontFamily: fontFamily.PoppinsMedium,
    fontSize: 14,
    marginBottom: 10
  },
  grayTextStyle: {
    color: COLORS.appAccentGreyDark,
    fontFamily: fontFamily.PoppinsLight,
    fontSize: 14,
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
  pickerContainer: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
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
    paddingRight: 25,
  },
  marketingView: {
    width: '50%',
    height: 60,
    backgroundColor: COLORS.appWhite,
    borderWidth: 1,
    borderColor: COLORS.appAccentBlue,
    justifyContent: 'center',
  },
  marketingView2: {
    width: '70%',
    height: 55,
    backgroundColor: COLORS.appAccentBlue,
    justifyContent: 'center',
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10
  },
  marketingText: {
    color: COLORS.appAccentBlue,
    fontFamily: fontFamily.PoppinsSemiBold,
    fontSize: 14,
    textAlign: 'center',
  },
  dateStyle: {
    paddingTop: 14,
    paddingBottom: 10,
    paddingStart: 10,
    paddingEnd: 10,
    borderRadius: 5,
    backgroundColor: COLORS.appAccentGreyLight,
    fontSize: 14,
    fontFamily: fontFamily.PoppinsSemiBold,
    color: '#979797',
  },
  DOBView: {
    height: 50,
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
  calenderIcon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    tintColor: COLORS.appAccentGreyDark,
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

