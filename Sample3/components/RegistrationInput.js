import React from 'react';
import { View, StyleSheet, TextInput, Text,  TouchableOpacity,} from 'react-native'
import { COLORS } from '../utils/colors';
import fontFamily from '../assets/fonts';

const InputBox = (props) => {
    return (
        <TextInput
            {...props} 
            style={[style.authInput,props.mainStyle]}
            placeholder={props.placeholder}
            placeholderTextColor={COLORS.appAccentGreyDark}
            onChangeText={(text) => {
                if (typeof props.onChangeText == 'function') {
                    props.onChangeText(text)
                }
            }}
            value={props.value}
            keyboardType={props.keyboardType}
            multiline={props.multiline}
            secureTextEntry={props.secureType}
        />
    )
}
export default InputBox
const style = StyleSheet.create({
    authInput: {
        paddingTop: 10,
        paddingBottom: 8,
        paddingStart: 10,
        paddingEnd: 10,
        borderRadius: 5,
        backgroundColor: COLORS.appAccentGreyLight,
        fontSize: 14,
        fontFamily: fontFamily.PoppinsSemiBold,
        color: COLORS.appAccentGreyDark
    },
   
});




