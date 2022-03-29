import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

const CustomButton = (props) => {
    return (
        <TouchableOpacity
        {...props}
        disabled={props.disabled}
            onPress={() => props.onPress()}
            style={[styles.buttonContainer, props.style]}>
                <Image
                    style={props.imageStyle}
                    source={props.source}
                />
            <Text style={styles.buttonText, props.textStyle}>
                {props.label}
            </Text>
            <Image
                    style={props.secondIcon}
                    source={props.secondIconSource}
                />
        </TouchableOpacity>
    )
}

export default CustomButton;

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#15226b',
        color: 'white',
        width: '55%',
        height: 44,
        borderColor:'#00B3EC',
        borderWidth:1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent:'center',
        borderRadius: 10,
    },
    buttonText:{
        textAlign:'center',
        color:'#00B3EC',
        fontSize:15
    }
})