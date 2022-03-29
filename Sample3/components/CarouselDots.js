import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import AppStyles from '../utils/styles'
import fontFamily from '../assets/fonts';

const CarouselDots = (props) => {
  const dots = [];
  for (let index = 0; index < props.count; index++) {
    if (props.selectedIndex === index) {
      dots.push(
        <View key={index + 1} style={styles.dotsContainer}>
          <View style = { { width : 11 , height : 11 , backgroundColor : '#ffffff', borderRadius : 50}}/>
        </View>,
      );
    } else {
      dots.push(
        <View key={index + 1} style={styles.dotsContainer}>
          <View style = { { width : 11 , height : 11 , backgroundColor : 'transparent', borderRadius : 50, borderColor : '#ffffff', borderWidth : 1}}/>
        </View>,
      );
    }
  }
  return (
    <View style={{...styles.container, ...props.style}}>
      {dots}
      <Text style={AppStyles.carouselDotsText}>{props.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {},
  dotsContainer: {
    marginRight: 4,
  },
});

export default CarouselDots;
