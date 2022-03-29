import React, {useState, useRef} from 'react';
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
} from 'react-native';
import {COLORS} from '../utils/colors';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import StarRating from 'react-native-star-rating';
import SFButton from '../components/SFButton';
import {CheckBox} from 'native-base';
import * as Progress from 'react-native-progress';
import fontFamily from '../assets/fonts';
import HTML from 'react-native-render-html';
import _ from 'lodash';

const UniversityRating = props => {
  let universityDetail = props.universityDetail;
  let tempTwoStarRating = 0;
  let tempTwoStarRatingLength = 0;
  let tempThreeStarRating = 0;
  let tempThreeStarRatingLength = 0;
  let tempFourStarRating = 0;
  let tempFourStarRatingLength = 0;
  let tempFiveStarRating = 0;
  let tempFiveStarRatingLength = 0;
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];

  const [reviewList, setReviewList] = useState(universityDetail.review);
  reviewList.length > 0 &&
    reviewList.map((item, index) => {
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
  let twoStarRating =
    tempTwoStarRating > 0 ? tempTwoStarRating / tempTwoStarRatingLength / 5 : 0;
  let threeStarRating =
    tempThreeStarRating > 0
      ? tempThreeStarRating / tempThreeStarRatingLength / 5
      : 0;
  let fourStarRating =
    tempFourStarRating > 0
      ? tempFourStarRating / tempFourStarRatingLength / 5
      : 0;
  let fiveStarRating =
    tempFiveStarRating > 0
      ? tempFiveStarRating / tempFiveStarRatingLength / 5
      : 0;
  let averageRating =
    (tempTwoStarRating +
      tempThreeStarRating +
      tempFourStarRating +
      tempFiveStarRatingLength) /
    reviewList.length;

  const listItems = (item, index) => {
    const source = `${item.description}`;
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#979797',
          borderRadius: 5,
          marginTop: 15,
          padding:15
        }}>
        <View style={[styles.itemContainer,{padding:4}]}>
          <Image
            source={
              item.from_review_user?.profile_picture !== null
                ? {uri: item.from_review_user?.profile_picture}
                : require('./../assets/images/default_profile_picturejpg.jpg')
            }
            style={{
              width: 56,
              height: 56,
              resizeMode: 'cover',
              borderRadius: 5,
            }}
          />
          <View style={{marginLeft: 13}}>
            <Text
              style={{
                color: '#979797',
                fontFamily: fontFamily.PoppinsMedium,
                fontSize: 12,
              }}>{`${item.from_review_user?.first_name} ${item.from_review_user?.last_name}`}</Text>
            <View style={{flexDirection: 'row'}}>
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
       {!_.isNil(item.description) && <HTML style={{padding:20}} html={source.toString()} />}
        {/* <Text style={{ color: '#979797', fontFamily: fontFamily.PoppinsItalic, fontSize: 14,padding:19,paddingTop:0 }}>{item.description}</Text> */}
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar backgroundColor={COLORS.appLightBlue} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View style={styles.reviewHeaderContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
              <View style={{flexDirection: 'row', marginLeft: 10}}>
                <StarRating
                  starSize={16}
                  disabled={true}
                  maxStars={5}
                  fullStarColor={'#FFC107'}
                  rating={averageRating}
                />
              </View>
            </View>
            <Text
              style={
                styles.reviewCoutHeaderText
              }>{`Based on ${reviewList.length} Reviews`}</Text>
          </View>
          <View style={{padding: 18}}>
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
          </View>
          <View style={{paddingLeft: 20, paddingRight: 20,}}>
            <FlatList
              data={reviewList}
              // contentContainerStyle={{alignItems:'center'}}
              renderItem={({item, index}) => {
                return listItems(item, index);
              }}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appWhite,
    // paddingLeft: 15,
    // paddingRight: 15
  },
  reviewHeaderContainer: {
    width: '100%',
    height: 75,
    backgroundColor: '#6C63FF',
    // marginTop: 5,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingText: {
    fontSize: 42,
    fontFamily: fontFamily.PoppinsBold,
    color: 'white',
    marginTop: 5,
  },
  reviewCoutHeaderText: {
    color: 'white',
    fontSize: 12,
    fontFamily: fontFamily.PoppinsMedium,
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 3,
    alignItems: 'center',
  },
  barText: {
    color: '#979797',
    fontSize: 12,
    marginLeft: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 19,
  },
});

export default UniversityRating;
