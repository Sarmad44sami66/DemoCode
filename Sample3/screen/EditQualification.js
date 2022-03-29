import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Pressable,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS } from '../utils/colors';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppStyles from '../utils/styles';
import InputField from './../components/RegistrationInput';
import SFButton from '../components/SFButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import fontFamily from '../assets/fonts';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import {
  updateProfilePhoto,
  addQualificationAPI,
  deleteQualificationAPI,
  editQualificationAPI,
  getUserProfile
} from '../api/methods/auth';
import Loader from '../components/Loader';
import EducationDegree from '../assets/images/education_degree.svg';
import EditSvg from '../assets/images/edit_icon.svg';

const EditQualification = props => {
  let isEdit = props.isEdit;

  let YearsArray = [];
  for (let i = 1990; i <= 2021; i++) {
    YearsArray.push(i);
  }

  const [nationality, setNationality] = useState('');
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showYearsList, setShowYearsList] = useState(false);
  const [addNewEducationModal, setAddNewEducationModal] = useState(false);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [qualificationList, setQualificationList] = useState(props.userProfile?.qualifications);
  const [showCancel, setShowCancel] = useState(false);
  const [uniId, setUniversityId] = useState(-1);
  const [universityName, setUniversityName] = useState('');

  const userProfile = async () => {
    setShowLoader(true)
    try {
      const response = await getUserProfile();
      setShowLoader(false);
      if (response.data.success == true) {
        setQualificationList(response.data.profile_data.qualifications);
      }
    } catch (error) {
      // Toast.show(error.response.data.error.message)
      setShowLoader(false);
    }
  }

  const addEducation = async () => {
    if (universityName == '') {
      Toast.show('Qualification Name Required');
      return;
    }
    if (startYear == '') {
      Toast.show('Start Year Required');
      return;
    }
    setAddNewEducationModal(false);
    let data = {
      institute_name: universityName,
      end_date: startYear,
    };
    setShowLoader(true);
    try {
      const response = await addQualificationAPI(data);
      setShowLoader(false);
      setUniversityName('');
      setStartYear('');
      setEndYear('');
      setShowCancel(false);
      if (response.data.success == true) {
        Toast.show(response.data.message);
        userProfile();
      }
    } catch (error) {
      Toast.show(error.response.data.error.message);
      console.log('eror===>', error.response.data);
      setShowLoader(false);
    }
  };

  const DeleteEducation = async () => {
    if (uniId == -1) {
      Toast.show('select University first');
      return;
    }
    setAddNewEducationModal(false);
    let data = {
      user_qualification_id: uniId,
    };
    setShowLoader(true);
    try {
      const response = await deleteQualificationAPI(data);
      setShowLoader(false);
      // setUniversityName('');
      // setStartYear('');
      setUniversityId(-1);
      setShowCancel(false);
      if (response.data.success == true) {
        Toast.show(response.data.message);
        userProfile();
      }
    } catch (error) {
      Toast.show(error.response.data.error.message);
      console.log('eror===>', error.response.data);
      setShowLoader(false);
    }
  };
  const EditEducation = async () => {
    if (uniId == -1) {
      Toast.show('select University first');
      return;
    }
    if (universityName == '') {
      Toast.show('Qualification Name Required');
      return;
    }
    if (startYear == '') {
      Toast.show('Start Year Required');
      return;
    }
    setAddNewEducationModal(false);
    let data = {
      institute_name: universityName,
      end_date: startYear,
      user_qualification_id: uniId,
    };
    setShowLoader(true);
    try {
      const response = await editQualificationAPI(data);
      console.log('my response===>', response);
      setShowLoader(false);
      setUniversityName('');
      setStartYear('');
      setUniversityId(-1);
      setShowCancel(false);
      if (response.data.success == true) {
        Toast.show(response.data.message);
        userProfile();
      }
    } catch (error) {
      Toast.show(error.response.data.error.message);
      console.log('eror===>', error.response.data);
      setShowLoader(false);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const renderItem = (item, index) => {
    console.log('kmjomimio', item);
    return (
      <View
        style={styles.rowView2}>
        <EducationDegree style={{ marginTop: 5 }} />
        <View style={{ marginLeft: 10, width: '80%' }}>
          <Text
            style={
              styles.blueTextStyle
            }>{`${item.end_date} - ${item.institute_name} `}</Text>
        </View>
        <Pressable
          onPress={() => {
            setUniversityName(item.institute_name);
            setStartYear(item.end_date);
            setShowCancel(true);
            setAddNewEducationModal(true);
            setUniversityId(item.id);
          }}
          style={{
            width: 20,
            height: 20,
          }}>
          <EditSvg style={{ alignSelf: 'center' }} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.appLightBlue} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, marginBottom: 80 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.saveBtnBarContainer}>
            <Text style={styles.allAboutText}>Qualification</Text>
            <SFButton
              onPress={() => setAddNewEducationModal(true)}
              isFlat
              style={styles.sfbutton}
              textStyle={{
                marginTop: 4,
                fontSize: 12,
                fontFamily: fontFamily.PoppinsSemiBold,
              }}>
              Add New
            </SFButton>
          </View>
          <View>
            <FlatList
              data={qualificationList}
              keyExtractor={(item, index) => item.label + index}
              listKey={'SelectIndustriesScreen' + moment().format('x')}
              removeClippedSubvisews={false}
              renderItem={({ item, index }) => {
                return renderItem(item, index);
              }}
            />
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
      <Modal isVisible={addNewEducationModal}>
        <View style={{ backgroundColor: COLORS.appWhite, borderRadius: 10, }}>
          <Text style={[styles.blueTextStyle2]}>
            {showCancel ? 'Edit Qualification' : 'Add Qualification'}
          </Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.blueTextStyle}>Qualification Name</Text>
            <InputField
              placeholderTextColor={COLORS.appAccentGreyDark}
              value={universityName}
              placeholder={'Qualification Name'}
              onChangeText={text => {
                setUniversityName(text);
              }}
            />
          </View>
          <View style={styles.rowView}>
            <View style={{ width: '100%' }}>
              <Text style={styles.blueTextStyle}>Year</Text>
              <TouchableOpacity
                onPress={() => {
                  setAddNewEducationModal(false);
                  setTimeout(() => {
                    setShowYearsList(true);
                  }, 500);
                }}>
                <Text style={styles.dateStyle}>{startYear}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
                    setAddNewEducationModal(false);
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
                    showCancel ? EditEducation() : addEducation()
                  }
                  isFlat
                  style={[styles.sfbutton, { width: '40%' }]}
                  textStyle={{
                    marginTop: 4,
                    fontSize: 12,
                    fontFamily: fontFamily.PoppinsSemiBold,
                  }}>
                  {showCancel ? 'Save' : 'Add'}
                </SFButton>
              </View>
              {showCancel && (
                <SFButton
                  hideIcon
                  onPress={() => DeleteEducation()}
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
                  setAddNewEducationModal(false);
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
                onPress={() => (showCancel ? EditEducation() : addEducation())}
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
      <Modal isVisible={showYearsList}>
        <View
          style={{
            backgroundColor: COLORS.appWhite,
            borderRadius: 10,
            width: '50%',
            alignSelf: 'center',
            height: '80%'
          }}>
          <ScrollView
            style={{
              width: '60%',
              alignSelf: 'center',
              backgroundColor: 'white',
            }}>
            {YearsArray.map((item, index) => {
              return (
                <TouchableOpacity style={{ marginVertical: 10 }}>
                  <Text
                    onPress={() => {
                      setStartYear(item);
                      setShowYearsList(false);
                      setTimeout(() => {
                        setAddNewEducationModal(true);
                      }, 500);
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
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      {/* <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          marginTop: 20,
        }}>
        <Pressable style={styles.marketingView}>
          <Text style={styles.marketingText}>CANCEL</Text>
        </Pressable>
        <Pressable style={styles.marketingView2}>
          <Text style={[styles.marketingText, {color: COLORS.appWhite}]}>
            NEXT PAGE
          </Text>
        </Pressable>
      </View> */}
      <Loader visible={showLoader} />
    </View>
  );
};

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  rowView2: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  blueTextStyle: {
    color: COLORS.appLightBlue,
    fontFamily: fontFamily.PoppinsMedium,
    fontSize: 14,
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
  sfbutton: {
    width: 105,
    height: 35,
    borderRadius: 25,
    marginTop: 20,
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
  blueTextStyle2: {
    color: COLORS.appLightBlue,
    fontFamily: fontFamily.PoppinsBold,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  marketingView2: {
    width: '50%',
    height: 60,
    backgroundColor: COLORS.appAccentBlue,
    justifyContent: 'center',
  },
  marketingText: {
    color: COLORS.appAccentBlue,
    fontFamily: fontFamily.PoppinsSemiBold,
    fontSize: 14,
    textAlign: 'center',
  },
  fieldContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
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
});
export default EditQualification;
