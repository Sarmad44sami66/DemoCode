import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { SHIFTFEED080_PROP_CHANGED, SHIFTFEED080_PROP_CLEAR, ShiftDetails1051_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
const {height, width} = Dimensions.get('window');

class ShiftDetails105 extends Component {

    componentDidMount(){
        this.checkInternet();
    }

    checkInternet() {    
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "isConnected", state.isConnected);            
        });
        subscribe();
    }

    renderHeaderTabs(){
        return (
            <View style={styles.tabHeaderButton}>
                <TouchableOpacity style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}
                                  onPress={()=>{
                                      this.props.screenIDHandler(101)
                                  }}>
                    <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17}}>Back</Text>
                </TouchableOpacity>
                <View style={{flex: 1, width: '60%',alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, textAlign: 'center'}}>{'Manual Clock In'}</Text>
                </View>
                <View style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}>
                </View>
            </View>
        )
    }

    onClockInButtonPress(){
        if (!this.checkFields()) {
            return false;
        } else {
            if(this.props.isConnected){
                this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", true);
                var details = {
                    status_clock_in: 'Confirm'
                };
                var formBody = [];
                for (var property in details) {
                    var encodedKey = encodeURIComponent(property);
                    var encodedValue = encodeURIComponent(details[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");
                const {ShiftDetails1051_Api_Call} = this.props;
                ShiftDetails1051_Api_Call(
                    {
                        accountID : this.props.manualClockInAccountID,
                        shiftD : this.props.selectedShiftItemID,
                    },
                    formBody,
                    this.onSuccess,
                    this.onError
                );
            } else {alert('Please check your internet')}
        }
    }

    onSuccess = (response) => {
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
        if (response) {
            console.log('Response: ' + JSON.stringify(response))
            this.props.screenIDHandler(101)
        }
    }
    onError = (error) => {
        console.log('Error: ' + JSON.stringify(error))
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        } else {
            errors += JSON.stringify(error)
        }
        if(errors.length > 0)
            alert(errors);
    }

    checkFields(){
        if (this.props.manualClockInAccountID === "") {
            alert("Account ID field is required");
            return false;
        }
        else return true
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{flexDirection: 'row', width: '100%', backgroundColor: '#F8F8F8'}}>
                        {this.renderHeaderTabs()}
                    </View>
                    <KeyboardAwareScrollView
                        innerRef={ref => {this.scroll = ref}}
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow:1}}
                        style={{flex:1, width:width}}>
                        <View style={{flexGrow:1, width: '100%', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <View style={{flex:1, width: '50%', height: width*0.5, backgroundColor: '#fff', marginTop: 20}}>
                                <Image source={require('../../assets/images/qr_code.png')}
                                       resizeMode={'contain'}
                                       style={{width: '100%', height: '100%'}}/>
                            </View>
                            <Text style={[styles.textStyle,{textAlign: 'center',marginTop: 30, width: '75%'}]}>
                                {
                                    'The Hero can either scan the QR ' +
                                    'code, or you can manually enter ' +
                                    'the Account ID, to do the clock in.'
                                }
                            </Text>
                            <Text style={[styles.textStyle,{marginTop: 30, fontSize: 22, color: '#9A9A9A'}]}>{'Account ID'}</Text>
                            <View style={styles.forminputContainer}>
                                <TextInput
                                    style={styles.inputText}
                                    value={this.props.manualClockInAccountID}
                                    onChangeText={(text) => {
                                        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "manualClockInAccountID", text);
                                    }}
                                    placeholder={'Enter account id'}
                                    placeholderTextColor={'#9A9A9A'}
                                    scrollEnabled={false}/>
                            </View>
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity style={styles.navigationButton}
                                                  onPress={()=>{this.onClockInButtonPress()}}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Clock In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <ProgressBar visible={this.props.loading}/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        width: width,
        backgroundColor: "#fff",
        justifyContent: "flex-start",
    },
    tabHeaderButton:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: 55,
    },
    textStyle:{
        fontFamily: 'HelveticaNeue-Roman',
        color: '#000',
        fontSize: 17,
        lineHeight: 25
    },
    forminputContainer: {
        width: "70%",
        height: 35,
        borderBottomColor: '#4d4d4d',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center',
    },
    inputText:{
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
        width: '100%' ,
        paddingBottom:2,
    },
    navigationButtonsContainer:{
        width: '70%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 20,
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
});

const mapStateToProps = ({ShiftFeed080State}) => {
    const { 
        loading, selectedShiftItemID, selectedShiftItem, manualClockInAccountID, isConnected 
    } = ShiftFeed080State;
    return { 
        loading, selectedShiftItemID, selectedShiftItem, manualClockInAccountID, isConnected 
    };
};

export default connect(mapStateToProps, {ShiftDetails1051_Api_Call, propChanged, propsClear})(ShiftDetails105);