import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    SafeAreaView,
    StatusBar
} from 'react-native';
import _ from 'lodash'
import AppStyles from '../utils/styles'
import { COLORS } from '../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import fontFamily from '../assets/fonts';

export default Header = (props) => {
    return (
        <SafeAreaView>
            {/* <LinearGradient colors={['#4c669f', '#21287F', '#21287F']}  style={[styles.container, props.containerStyle]} > */}
            <View colors={['#4c669f', '#21287F', '#21287F']} style={[styles.container, props.containerStyle]} >
                <View style={[styles.centerComponentStyle, props.centerComponentExtraStyle]}>
                    {props.centerComponent &&
                        <TextInput value={props.value} onChangeText={props.onChangeText} keyboardType={'name-phone-pad'} style={styles.authInput} placeholder={'Search Universities '} placeholderTextColor={COLORS.appAccentGreyDark} />
                    }
                    {props.centerComponent &&
                        <TouchableOpacity onPress={() => props.onSearchPress()} style={{justifyContent: "center"}}>
                            <Image style={{width: 20,height: 20,tintColor: 'black'}} source={require('../assets/images/search.png')} />
                        </TouchableOpacity>

                    }
                </View>
                {props.rightIcon ? <TouchableOpacity
                    disabled={_.isNil(props.onRightAction)}
                    onPress={() => {
                        if (props.onRightAction && typeof props.onRightAction) {
                            props.onRightAction()
                        }
                    }}
                    style={[styles.buttonContainer, props.rightButtonContainerStyle2]}>
                    {props.rightIcon &&
                        <Image
                            style={[styles.buttonIcon, props.rightButtonIconStyle2]}
                            source={props.rightIcon}
                        />
                    }
                </TouchableOpacity> : null}
                {props.rightIcon2 || props.rightText2 ? <TouchableOpacity
                    disabled={_.isNil(props.onRightAction2)}
                    onPress={() => {
                        if (props.onRightAction2 && typeof props.onRightAction2) {
                            props.onRightAction2()
                        }
                    }}
                    style={[styles.buttonContainer, props.rightButtonContainerStyle2]}>
                    {props.rightIcon2 &&
                        <Image
                            style={[styles.buttonIcon, props.rightButtonIconStyle2]}
                            source={props.rightIcon2}
                        />
                    }
                    {props.rightText2 &&
                        <Text style={[styles.buttonText, props.rightButtonTextStyle2]}>
                            {props.rightText2}
                        </Text>
                    }
                </TouchableOpacity> : null}
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        width: '100%',
        backgroundColor: 'transparent',
        alignItems: 'center',
        paddingLeft: 22,
        paddingRight: 22,
        justifyContent:'space-between'
    },
    authInput: {
        paddingTop: 10,
        paddingBottom: 6,
        paddingStart: 20,
        paddingEnd: 20,
        borderRadius: 5,
        backgroundColor: COLORS.appAccentGreyLight,
        fontSize: 14,
        fontFamily: fontFamily.PoppinsSemiBold,
        width: "85%"
    },
    buttonContainer: {
        width: 22,
        height: 22,
        marginLeft: 15
    },
    centerComponentStyle: {
        width: '80%',
        height: 38,
        flexDirection: "row",
        backgroundColor: COLORS.appAccentGreyLight,
        borderRadius: 10
    },
    buttonIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        tintColor:'white'
    },
    hearderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
    }
})
