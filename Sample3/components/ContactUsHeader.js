import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    StatusBar,
    Pressable,
    TouchableOpacity
} from 'react-native';
import { COLORS } from '../utils/colors';
import fontFamily from '../assets/fonts';

export default ContactUsHeader = (props) => {

    return (
        <SafeAreaView>
            <View style={[styles.container, props.containerStyle]} >
                <View style={{ flexDirection: 'row' }}>
                    <Pressable onPress={() => props.backPress()} style={{
                        justifyContent: "center",
                        flexDirection: 'row'
                    }}>
                        <Image style={{ width: 20, height: 20, alignSelf: "center", tintColor: '#ffffff' }} source={require('../assets/images/back.png')} />
                    <Text style={[styles.textStyle, props.headerTextStyle]}>{props.headerText}</Text>
                    </Pressable>
                </View>
                {props.isShowSave &&
                <Pressable onPress={() => props.backPress()} style={{
                    justifyContent: "center"
                }}>
                    <Text style={[styles.saveStyle, props.saveTextStyle]}>{'SAVE'}</Text>
                </Pressable>
                }
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        height: 65,
        width: "100%",
        backgroundColor: "#21287F",
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between'
    },
    textStyle: {
        fontSize: 18,
        color: COLORS.appWhite,
        marginLeft: 10,
        fontFamily: fontFamily.PoppinsSemiBold,
        alignSelf: "center"
    },
    saveStyle: {
        fontFamily: fontFamily.PoppinsSemiBold,
        fontSize: 14,
        color: '#6C63FF'
    }
})