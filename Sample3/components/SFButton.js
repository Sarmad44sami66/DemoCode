import React from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import AppStyles from '../utils/styles'
import fontFamily from '../assets/fonts';

const SFButton = (props) => {
  const conditionalStyle = {};
  if (props.disabled) {
    conditionalStyle.opacity = 0.7;
  }
  return (
    props.hideIcon ? 
    <TouchableOpacity
      {...props}
      onPress={props.onPress}
      style={[props.isFlat ? AppStyles.sfButtonFlat : AppStyles.sfButton, props.style, conditionalStyle]}>
      {/* <Image
        source={require('./../assets/images/plus.png')}
        style={{ width: 9, height: 9, resizeMode: 'contain',marginRight:6,tintColor:'white'}} /> */}
      <Text style={{ ...AppStyles.sfButtonText, ...props.textStyle }}>
        {props.children}
      </Text>
    </TouchableOpacity>
    :
    <TouchableOpacity
      {...props}
      onPress={props.onPress}
      style={[props.isFlat ? AppStyles.sfButtonFlat : AppStyles.sfButton, props.style, conditionalStyle]}>
     <Image
        source={require('./../assets/images/plus.png')}
        style={{ width: 9, height: 9, resizeMode: 'contain',marginRight:6,tintColor:'white'}} />
      <Text style={{ ...AppStyles.sfButtonText, ...props.textStyle }}>
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

export default SFButton;
