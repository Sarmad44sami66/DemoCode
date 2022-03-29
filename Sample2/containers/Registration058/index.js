import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
const {height, width} = Dimensions.get('window');
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainButtomTab' })],
});
const resetActionTo070 = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'NewShift070' })],
});
export default class Registration058 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    onShiftButtonPress(){
        this.props.navigation.dispatch(resetActionTo070)
    }

    onSkipButtonPress(){
        this.props.navigation.dispatch(resetAction)
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 30}}>
                        <View style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            </View>
                        </View>
                        <View style={{flex: 1, width: '60%', alignItems: 'center', justifyContent: 'center'}}>

                        </View>
                        <View style={{width: '20%', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={{flex: 1, justifyContent:"center", alignItems: 'center', width:width}}>
                        <View style={{justifyContent:"center", alignItems: 'center', width:"80%", height:'60%'}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 24, marginBottom: 70}}>
                                {'Congratulations, now\nyou can reliably fill your\nshifts with verified\nprofessionals for your\nbusiness.'}
                            </Text>
                        </View>
                    </ScrollView>
                    <View style={styles.navigationButtonsContainer}>
                        <TouchableOpacity 
                            style={styles.navigationButton}
                            onPress={()=>{this.onShiftButtonPress()}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Fill your shift</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.navigationButton,{marginTop: 20, backgroundColor:'#00000000', borderWidth: 1, borderColor: '#007AFF'}]}
                            onPress={()=>{this.onSkipButtonPress()}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#007AFF'}}>Skip for now</Text>
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
        justifyContent: "flex-start",
    },
    navigationButtonsContainer:{
        width: '70%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 70,
    },
    navigationButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 10,
        height: 55,
        width: '100%',
    },
    selectImage:{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 120,
        marginTop: 30,
        marginBottom: 90,
        width: '50%',
        backgroundColor:'#00000000',
        borderWidth: 1
    },
    forminputContainer: {
        height: 40,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 8,
        width: "100%",
    },
    inputText:{
        fontSize: 16,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
        height:40,
        width: "100%",
        paddingBottom:2,
    },
});

