import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  SafeAreaView,
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
import { useDispatch } from 'react-redux';
import {
  updateProfilePhoto,
  addTeamHistoryAPI,
  deleteTeamHistoryAPI,
  editTeamHistoryAPI,
  getUserProfile
} from '../api/methods/auth';
import Loader from '../components/Loader';
import EditSvg from '../assets/images/edit_icon.svg';

const EditTeamHistory = props => {
  // let teamHistoryList = props.userProfile.teamHistory;
  let isEdit = props.isEdit;

  let YearsArray = [];
  for (let i = 1990; i <= 2021; i++) {
    YearsArray.push(i);
  }
  
  const dispath = useDispatch()

  const [teamName, setTeamName] = useState('');
  const [teamLevel, setTeamLevel] = useState('');
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [addNewEducationModal, setAddNewEducationModal] = useState(false);
  const [startYear, setStartYear] = useState('');
  const [teamHistoryList, setTeamHistoryList] = useState(props.userProfile?.teamHistory);
  const [endYear, setEndYear] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [uniId, setUniversityId] = useState(-1);
  const [showYearsList, setShowYearsList] = useState(false);
  const [startYearModel, setStartYearModel] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const userProfile = async () => {
    setShowLoader(true)
    try {
      const response = await getUserProfile();
      setShowLoader(false);
      if (response.data.success == true) {
        setTeamHistoryList(response.data.profile_data.teamHistory);
      }
    } catch (error) {
      // Toast.show(error.response.data.error.message)
      setShowLoader(false);
    }
  }

  const addTeamHistory = async () => {
    if (teamName == '') {
      Toast.show('Team Name Required ');
      return;
    }
    if (teamLevel == '') {
      Toast.show('Team Level Required');
      return;
    }
    if (startYear == '') {
      Toast.show('Start Year Required');
      return;
    }
    if (endYear == '') {
      Toast.show('End Year Required ');
      return;
    }
    setAddNewEducationModal(false);
    let data = {
      team_name: teamName,
      level: teamLevel,
      start_date: startYear,
      end_date: endYear,
    };
    setShowLoader(true);
    try {
      const response = await addTeamHistoryAPI(data);
      setShowLoader(false);
      setTeamName('');
      setTeamLevel('');
      setStartYear('');
      setEndYear('');
      setShowCancel(false);
      if (response.data.success == true) {
        Toast.show(response.data.message);
        userProfile();
        // props.navigation.goBack();
      }
    } catch (error) {
      Toast.show(error.response.data.error.message);
      if (error.response.data.error.message == "Session Expired.") {
        dispath(logoutUser())
    }
      console.log('eror===>', error.response.data);
      setShowLoader(false);
    }
  };

  const DeleteTeamHistory = async () => {
    if (uniId == -1) {
      Toast.show('select University first');
      return;
    }
    setAddNewEducationModal(false);
    let data = {
      user_team_id: uniId,
    };
    setShowLoader(true);
    try {
      const response = await deleteTeamHistoryAPI(data);
      console.log('my response===>', response);
      setShowLoader(false);
      setTeamName('');
      setTeamLevel('');
      setStartYear('');
      setEndYear('');
      setUniversityId(-1);
      setShowCancel(false);
      if (response.data.success == true) {
        Toast.show(response.data.message);
        userProfile();
        // props.navigation.goBack();
      }
    } catch (error) {
      Toast.show(error.response.data.error.message);
      if (error.response.data.error.message == "Session Expired.") {
        dispath(logoutUser())
    }
      console.log('eror===>', error.response.data);
      setShowLoader(false);
    }
  };
  const EditTeamHistory = async () => {
    if (uniId == -1) {
      Toast.show('select University first');
      return;
    }
    if (teamName == '') {
      Toast.show('Team Name Required ');
      return;
    }
    if (teamLevel == '') {
      Toast.show('Team Level Required');
      return;
    }
    if (startYear == '') {
      Toast.show('Start Year Required');
      return;
    }
    if (endYear == '') {
      Toast.show('End Year Required ');
      return;
    }
    setAddNewEducationModal(false);
    let data = {
      team_name: teamName,
      level: teamLevel,
      start_date: startYear,
      end_date: endYear,
      user_team_id: uniId,
    };
    console.log('my response===>', data);
    setShowLoader(true);
    try {
      const response = await editTeamHistoryAPI(data);
      console.log('my response===>', response);
      setShowLoader(false);
      setTeamName('');
      setTeamLevel('');
      setStartYear('');
      setEndYear('');
      setUniversityId(-1);
      setShowCancel(false);
      if (response.data.success == true) {
        Toast.show(response.data.message);
        userProfile();
        // props.navigation.navigate('ProfileScreen');
      }
    } catch (error) {
      Toast.show(error.response.data.error.message);
      if (error.response.data.error.message == "Session Expired.") {
        dispath(logoutUser())
    }
      console.log('eror===>', error.response.data);
      setShowLoader(false);
    }
  };

  const renderItem = (item, index) => {
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "90%" }}>
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
                <Text style={styles.blueTextStyle}>Start Year</Text>
                <Text style={styles.grayTextStyle}>{item?.StartDate}</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.blueTextStyle}>End Year</Text>
                <Text style={styles.grayTextStyle}>{item?.EndDate}</Text>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => {
              setTeamName(item.teamName);
              setTeamLevel(item.Level);
              setStartYear(item.StartDate);
              setEndYear(item.EndDate);
              setShowCancel(true);
              setAddNewEducationModal(true);
              setUniversityId(item.user_teams_id);
            }}
            style={{
              width: 20,
              height: 20,
              justifyContent:'center',
              alignSelf:'center',
              right:10
            }}>
            <EditSvg style={{ alignSelf: 'center' }} />
          </Pressable>
        </View>
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
            <Text style={styles.allAboutText}>Team History</Text>
            <SFButton
              onPress={() => setAddNewEducationModal(true)}
              isFlat
              style={[styles.sfbutton, { marginTop: 20 }]}
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
              data={teamHistoryList}
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
        <View style={{ backgroundColor: COLORS.appWhite, borderRadius: 10 }}>
          <Text style={[styles.blueTextStyle2]}>
            {showCancel ? 'Edit Team History' : 'Add Team History'}
          </Text>
          <View style={styles.rowView}>
            <View style={{ width: '47%' }}>
              <Text style={styles.blueTextStyle}>Team Name</Text>
              <InputField
                placeholderTextColor={COLORS.appAccentGreyDark}
                value={teamName}
                placeholder={'Team name'}
                onChangeText={text => {
                  setTeamName(text);
                }}
              />
            </View>
            <View style={{ width: '47%' }}>
              <Text style={styles.blueTextStyle}>Level</Text>
              <InputField
                //keyboardType={'number-pad'}
                placeholderTextColor={COLORS.appAccentGreyDark}
                value={teamLevel}
                placeholder={'Level'}
                onChangeText={text => {
                  setTeamLevel(text);
                }}
              />
            </View>
          </View>
          <View style={styles.rowView}>
            <View style={{ width: '47%' }}>
              <Text style={styles.blueTextStyle}>Start Year</Text>
              <TouchableOpacity
                onPress={() => {
                  setAddNewEducationModal(false);
                  setTimeout(() => {
                    setStartYearModel(true);
                    setShowYearsList(true);
                  }, 500);
                }}>
                <Text style={styles.dateStyle}>{startYear}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: '47%' }}>
              <Text style={styles.blueTextStyle}>End Year</Text>
              <TouchableOpacity
                onPress={() => {
                  setAddNewEducationModal(false);
                  setTimeout(() => {
                    setStartYearModel(false);
                    setShowYearsList(true);
                  }, 500);
                }}>
                <Text style={styles.dateStyle}>{endYear}</Text>
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
                    showCancel ? EditTeamHistory() : addTeamHistory()
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
                  onPress={() => DeleteTeamHistory()}
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
                onPress={() =>
                  showCancel ? EditTeamHistory() : addTeamHistory()
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
      <Modal isVisible={showYearsList}>
        <View
          style={{
            backgroundColor: COLORS.appWhite,
            borderRadius: 10,
            width: '50%',
            alignSelf: 'center',
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
                      if (startYearModel == true) {
                        setStartYear(item);
                        setStartYearModel(false);
                        setShowYearsList(false);
                        setTimeout(() => {
                          setAddNewEducationModal(true);
                        }, 500);
                      } else {
                        setEndYear(item);
                        setStartYearModel(false);
                        setShowYearsList(false);
                        setTimeout(() => {
                          setAddNewEducationModal(true);
                        }, 500);
                      }
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
  blueTextStyle: {
    color: COLORS.appLightBlue,
    fontFamily: fontFamily.PoppinsMedium,
    fontSize: 14,
  },
  blueTextStyle2: {
    color: COLORS.appLightBlue,
    fontFamily: fontFamily.PoppinsBold,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
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
export default EditTeamHistory;
