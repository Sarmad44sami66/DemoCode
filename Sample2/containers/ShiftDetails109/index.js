import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { Picker } from 'native-base'
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import {
    SHIFTFEED080_PROP_CHANGED,
    SHIFTFEED080_PROP_CLEAR,
    ShiftDetails1091_Api_Call,
    NewShift0701_Api_Call,
    NEWSHIFT070_PROP_CHANGED
} from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
const {height, width} = Dimensions.get('window');
const extensionLimitArray = Array.from({length: 6}, (v, k) => k+1);

class ShiftDetails109 extends Component {

    componentDidMount() {
        let extendableTo = 12 - parseInt(this.props.selectedShiftItem.time_difference)
        let extensionLimitArrayTemp = Array.from({length: extendableTo}, (v, k) => k+1);
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "extensionLimitArray", extensionLimitArrayTemp);
        // this.checkInternet(this.getWorkingPositionsAPICall);
    }

    checkInternet(callback = null) {
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "isConnected", state.isConnected);
            if(callback && typeof callback == 'function'){
                setTimeout(()=>{
                    callback()
                },500)
            }
        });
        subscribe();
    }

    getWorkingPositionsAPICall = () => {
        console.log("API Is called? ", this.props.isConnected);
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", true);
        if(this.props.isConnected){
            const {NewShift0701_Api_Call} = this.props;
            NewShift0701_Api_Call(
                onSuccess = (response) => {
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
                    if (response) {
                        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "workingPositionsTariff", response[0].tariff);
                        // console.log(JSON.stringify(response[0].tariff[`billing_${3}`]))
                    }
                },
                onError = (error) =>{
                    console.log('Error: ' + JSON.stringify(error))
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
                    let errors = ''
                    if(error.detail){
                        errors += error.detail + '\n'
                    }
                    if(errors.length > 0)
                        alert(errors);
                    else alert(error)
                }
            );
        } else {alert('Please check your internet')}
    }

    renderHeaderTabs(){
        return (
            <View style={styles.tabHeaderButton}>
                <TouchableOpacity
                    style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}
                    onPress={()=>{
                        this.props.screenIDHandler(101);
                    }}>
                    <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17}}>Back</Text>
                </TouchableOpacity>
                <View style={{flex: 1, width: '60%',alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, textAlign: 'center'}}>{'Extend shift'}</Text>
                </View>
                <View style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}>
                </View>
            </View>
        )
    }

    renderExtensionLimitPicker(){
        return(
            <View style={{width: 120, justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}>
                <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>
                <Picker
                    selectedValue={this.props.shiftExtensionLimit}
                    style={{height: 30, width: '100%', backgroundColor: '#00000000'}}
                    mode={'dialog'}
                    placeholder={'Choose Shift Limit'}
                    iosHeader={'Choose Shift Limit'}
                    onValueChange={(itemValue, itemIndex) => {
                        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "shiftExtensionLimit", itemValue);
                    }}>
                    {
                        this.props.extensionLimitArray.map((item, index)=>{
                            return <Picker.Item key={index} label={item + ' Hours'} value={item + ''} />
                        })
                    }
                </Picker>
            </View>
        )
    }

    onExtendShiftButtonPress(){
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", true);
        if(this.props.isConnected){
            var details = {
                extension_hours: this.props.shiftExtensionLimit
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            const {ShiftDetails1091_Api_Call} = this.props;
            ShiftDetails1091_Api_Call(
                {
                    ID: this.props.selectedShiftAppliedEmployee.id
                },
                formBody,
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response) => {
        console.log('\n\n\n\nAli: ' + JSON.stringify(response))
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
        if (response) {
            this.props.screenIDHandler(101);
        }
    }
    onError = (error) => {
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.details){
            errors += error.details + '\n'
        }
        if(error.error){
            errors += error.error + '\n'
        }
        if(errors.length > 0)
            alert(errors);
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
                        <View style={{flexGrow:1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={[styles.textStyle,{fontSize: 18, color: '#9A9A9A', margin: 20}]}>{'Your shift can be extended'}</Text>
                            <View style={styles.textContainer}>
                                <Text style={[styles.textStyle,{marginTop: 15}]}>{'It is possible to extend this shift for'}</Text>
                                <Text style={[styles.textStyle,{marginTop: 15, fontSize: 17,fontFamily: 'HelveticaNeue-Bold'}]}>
                                    {
                                        this.props.selectedShiftAppliedEmployee.first_name + ' ' +
                                        this.props.selectedShiftAppliedEmployee.last_name
                                    }
                                </Text>
                                <Text style={[styles.textStyle,{marginTop: 15}]}>{'Extend this shift by:'}</Text>
                                {this.renderExtensionLimitPicker()}
                                <Text style={[styles.textStyle,{textAlign: 'center',marginTop: 15}]}>
                                    {
                                        'If the extension is accepted, you ' +
                                        'will be billed an additional $'+
                                        (
                                            this.props.workingPositionsTariff !== "" &&
                                            (this.props.workingPositionsTariff[`billing_${this.props.selectedShiftAppliedEmployee.position.num}`] * 1.5 * this.props.shiftExtensionLimit).toFixed(2)
                                        )
                                    }
                                </Text>
                            </View>
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity style={styles.navigationButton}
                                                  onPress={()=>{this.onExtendShiftButtonPress()}}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Extend shift</Text>
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
        textAlign: 'center',
        color: '#000',
        fontSize: 16,
        lineHeight: 25
    },
    navigationButtonsContainer:{
        width: '70%',
        marginTop: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
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
    textContainer:{
        width: '85%',
        padding: 50,
        alignItems: 'center',
        borderBottomWidth:1,
        borderBottomColor: '#9A9A9A',
        borderTopWidth: 1,
        borderTopColor: '#9A9A9A'
    }
});

const mapStateToProps = ({ShiftFeed080State}) => {
    const {
        loading, selectedShiftItemID, selectedShiftItem, selectedShiftAppliedEmployees, extensionLimitArray,
        selectedShiftAppliedEmployee, shiftExtensionLimit, workingPositionsTariff, isConnected
    } = ShiftFeed080State;
    return {
        loading, selectedShiftItemID, selectedShiftItem, selectedShiftAppliedEmployees, extensionLimitArray,
        selectedShiftAppliedEmployee, shiftExtensionLimit, workingPositionsTariff, isConnected
    };
};

export default connect(mapStateToProps, {ShiftDetails1091_Api_Call, NewShift0701_Api_Call, propChanged, propsClear})(ShiftDetails109);
