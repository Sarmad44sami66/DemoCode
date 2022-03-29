import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainButtomTab' })],
});
const resetActionTo070 = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'NewShift070' })],
});
const {height, width} = Dimensions.get('window');

export default class NewShift075 extends Component {
    constructor(props) {
        super(props);
    }

    onNextButtonPress(){
        this.props.navigation.dispatch(resetAction)
    }

    onFinishButtonPress(){
        this.props.navigation.dispatch(resetAction)
    }

    onPostPositionButtonPress(){
        this.props.navigation.dispatch(resetActionTo070)
    }


    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.props.navigation.dispatch(resetActionTo070)}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                {/*<Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>*/}
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                                          onPress={()=>{this.onNextButtonPress()}}>
                            {/* <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginEnd: 5}}>Next</Text> */}
                            <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        contentContainerStyle={{flex:1, justifyContent:"flex-start", alignItems: 'center', width:width}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', textAlign: 'center', fontSize: 22, margin: 20}}>
                            {'What\'s next?'}
                        </Text>
                        <View style={{flex: 1, justifyContent:"center", alignItems: 'center', width:"80%"}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 16}}>
                                {
                                    'Your shift has been posted on the ' +
                                    'HireApp platform.\n\n\n' +
                                    'Please check your email with ' +
                                    'detailed instructions about your shift.'
                                }
                            </Text>
                        </View>
                        <View style={styles.navigationButtonsContainer}>
                            <TouchableOpacity style={styles.navigationButton}
                                              onPress={()=>{this.onFinishButtonPress()}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Finish</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.navigationButton,{marginTop: 20, backgroundColor:'#00000000', borderWidth: 1, borderColor: '#007AFF'}]}
                                              onPress={()=>{this.onPostPositionButtonPress()}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#007AFF'}}>Post a new position</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
        marginTop:10,
        marginBottom:70
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