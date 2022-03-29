import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const {height, width} = Dimensions.get('window');

export default class SplashScreen010 extends Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('#fff');
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.logoTextContainer}>
                        <Image source={require('../../assets/images/logo_black.png')} style={styles.logo}/>
                    </View>
                    <Text style={{fontFamily: 'HelveticaNeue-Roman',fontSize: 20}}>Shifts at your fingertips</Text>
                    <View style={{flex: 1}}/>
                    <View style={styles.navigationButtonsContainer}>
                        <TouchableOpacity
                            style={styles.navigationButton}
                            onPress={()=>{
                                Preference.set(mystorage.CARD_LIMIT, 0);
                                Preference.set(mystorage.CARD_OBJECT, '');
                                this.props.navigation.navigate('Tutorial030')
                            }}>
                            <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Sign Up</Text>
                        </TouchableOpacity>
                        <View style={{width: '60%', height: 1, backgroundColor: '#7d7d7d', marginVertical: 20}}/>
                        <TouchableOpacity
                            style={styles.navigationButton}
                            onPress={()=>{
                                Preference.set(mystorage.CARD_LIMIT, 0);
                                Preference.set(mystorage.CARD_OBJECT, '');
                                this.props.navigation.navigate('Login040')
                            }}>
                            <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: "center",
    },
    logoTextContainer:{
        marginTop: 100,
        height:120,
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        resizeMode: 'contain',
        width: '100%',
    },
    navigationButtonsContainer:{
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 70
    },
    navigationButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 10,
        height: 55,
        width: '100%',
    },
});

