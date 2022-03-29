'use strict'

import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { COLORS }  from '../utils/colors'
import fontFamily from '../assets/fonts';

const BASE_SCREEN_HEIGHT = Dimensions.get("screen").height > 700 ? 850 : 650; 

export default StyleSheet.create({
    linearGradient : {
        flex : 1,
    },
    sfButton : {
        backgroundColor: COLORS.appAccentBlue,
        height : RFValue(60, BASE_SCREEN_HEIGHT),
        width : RFValue(160, BASE_SCREEN_HEIGHT),
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: RFValue(50, BASE_SCREEN_HEIGHT),
        flexDirection:'row'
    },
    sfButtonFlat : {
        flexDirection:'row',
        backgroundColor: COLORS.appAccentBlue,
        height : RFValue(60, BASE_SCREEN_HEIGHT),
        width : RFValue(160, BASE_SCREEN_HEIGHT),
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: RFValue(7, BASE_SCREEN_HEIGHT)
    },
    sfButtonText : {
        fontFamily : fontFamily.PoppinsMedium,
        fontSize : RFValue(16, BASE_SCREEN_HEIGHT),
        color: '#ffffff',
        textAlign: 'center'
    },
    header : {
        fontFamily : fontFamily.PoppinsLight,
        fontSize : RFValue(21, BASE_SCREEN_HEIGHT),
        color : COLORS.appWhite
    },
    pickerContainer : {
        width : '70%',
        backgroundColor : COLORS.appWhite,
        paddingStart : RFValue(10, BASE_SCREEN_HEIGHT),
        borderRadius : RFValue(5, BASE_SCREEN_HEIGHT)
    },
    pickerIcon : {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderTopWidth: RFValue(12, BASE_SCREEN_HEIGHT),
        borderTopColor: COLORS.appDarkBlue,
        borderRightWidth: RFValue(12, BASE_SCREEN_HEIGHT),
        borderRightColor: 'transparent',
        borderLeftWidth: RFValue(12, BASE_SCREEN_HEIGHT),
        borderLeftColor: 'transparent',
        borderRadius : RFValue(5, BASE_SCREEN_HEIGHT),
    },
    pickerIconContainer : {
        top: RFValue(5, BASE_SCREEN_HEIGHT)
    },
    pickerText : {
        color : COLORS.appLightBlue,
        fontSize : RFValue(15, BASE_SCREEN_HEIGHT),
        fontFamily : fontFamily.PoppinsSemiBold
    },
    BGheader : {
        fontFamily : fontFamily.PoppinsBold,
        fontSize : RFValue(30, BASE_SCREEN_HEIGHT),
        color : COLORS.appWhite
    },
    BGLine : {
        height : RFValue(1, BASE_SCREEN_HEIGHT),
        backgroundColor : COLORS.appWhite,
        width : '60%',
        marginBottom : RFValue(16, BASE_SCREEN_HEIGHT),
    },
    BGText : {
        fontSize : RFValue(16, BASE_SCREEN_HEIGHT),
        fontFamily : fontFamily.PoppinsLight,
        color : COLORS.appWhite,
        width : '60%',
        marginBottom : RFValue(20, BASE_SCREEN_HEIGHT),
        textAlign:'center'
    },
    BGFooter : {
        flexDirection : 'row',
        marginTop:35,
        marginBottom:60
    },
    authHeader : {
        fontFamily : fontFamily.PoppinsBold,
        fontSize : RFValue(30, BASE_SCREEN_HEIGHT),
        color : COLORS.appTitleBlue
    },
    authInput : {
        paddingEnd : 20,
        borderRadius : 5,
        backgroundColor : COLORS.appAccentGreyLight,
        // fontSize : RFValue(14, BASE_SCREEN_HEIGHT),
        fontSize : 18,
        fontFamily : fontFamily.PoppinsSemiBold,
        marginTop : 27,
        paddingTop: 0,
        paddingBottom: 0,
        height: 60,
        paddingLeft: 20
    },
    label : {
        fontSize : RFValue(16, BASE_SCREEN_HEIGHT),
        fontFamily : fontFamily.PoppinsRegular,
    }
});