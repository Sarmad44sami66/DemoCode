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
import moment from 'moment';
import {NavigationActions, StackActions} from "react-navigation";
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { NEWSHIFT073_PROP_CHANGED, NEWSHIFT073_PROPS_CHANGED, NEWSHIFT070_PROP_CLEAR, NEWSHIFT078_PROP_CLEAR, NEWSHIFT073_PROP_CLEAR, NEWSHIFT072_PROP_CLEAR, NewShift0731_Api_Call, NewShift0732_Api_Call } from '../../actions/Actions';
import { propChanged, propsChanged, propsClear } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'NewShift075' })],
});
const uncheckIcon = require('../../assets/icons/rounded_uncheck.png')
const checkedIcon = require('../../assets/icons/rounded_check.png');
const {height, width} = Dimensions.get('window');

class NewShift073 extends Component {

    renderTiming(){
        if (moment(this.props.endShiftDate).format('DDMM') == moment(this.props.startShiftDate).format('DDMM')){
            return (
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop:10}}>
                    <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                        {moment(this.props.startShiftDate).format('LT')  + ' - ' + moment(this.props.endShiftDate).format('LT')}
                    </Text>
                    <Text style={[styles.descriptionText,{color: '#9A9A9A', marginRight:40}]}>
                        {moment(this.props.startShiftDate).format('MM/DD/YY')}
                    </Text>
                </View>
            )
        } else {
            return (
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                        {moment(this.props.startShiftDate).format('LT')  + ' ' + moment(this.props.startShiftDate).format('MM/DD/YY') + "  -  "}
                    </Text>
                    <Text style={[styles.descriptionText,{color: '#9A9A9A', marginRight:40}]}>
                        {moment(this.props.endShiftDate).format('LT') + ' ' + moment(this.props.endShiftDate).format('MM/DD/YY')}
                    </Text>
                </View>
            )
        }
    }

    renderSingleDayShiftData(){
        return (
            <View style={{width: '100%'}}>
                <Text style={[styles.descriptionText,{}]}>
                    {this.props.noOfStaffInShift + 'x ' + this.props.selectedPositionTitle}
                </Text>
                <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                    {'Single day shift'}
                </Text>
                {this.renderTiming()}
                <Text style={[styles.descriptionText,{color: '#9A9A9A', marginTop:15}]}>
                    {'Total hours: ' + (this.props.shiftDuration * this.props.count) + ' hours'}
                </Text>
                <Text style={[styles.descriptionText,{}]}>
                    {'Hourly rate: $' + this.props.workerHourlyBill}
                </Text>
                {this.props.managerAssigned == 2 &&
                    <Text style={[styles.descriptionText,{marginTop:15}]}>
                        {'1x Shift Shift Supervisor'}
                    </Text>
                }
                {this.props.managerAssigned == 2 &&
                    <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                        {'Shift Supervisor fee: '}
                        <Text style={[styles.descriptionText,{color: '#000'}]}>
                            {'$100'}
                        </Text>
                    </Text>
                }
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop:25}}>
                    <View style={{width: '47%'}}>
                        <Text style={[styles.descriptionText,{}]}>
                            {'On site contact:'}
                        </Text>
                        <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                            {this.props.name}
                        </Text>
                        <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                            {this.props.phoneNumber}
                        </Text>
                    </View>
                    <View style={{width: '47%'}}>
                        <Text style={[styles.descriptionText,{}]}>
                            {'Dresscode:'}
                        </Text>
                        <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                            {
                                this.props.shirtTabs[this.props.dresscodeShirts].label + ', ' +
                                this.props.pantTabs[this.props.dresscodePants].label + ', ' +
                                this.props.shoesTabs[this.props.dresscodeShoes].label
                            }
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    renderMultiDay(){
        return(
            this.props.list.map((item, index)=>{
                return(
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                            {moment(this.props.startShiftDate).format('LT')  + ' - ' + moment(this.props.endShiftDate).format('LT')}
                        </Text>
                        <Text style={[styles.descriptionText,{color: '#9A9A9A', marginRight:40}]}>
                            {moment(this.props.startShiftDate).add(index, 'days').format('MM/DD/YY')}
                        </Text>
                    </View>
                )
            })
        )
    }

    renderMultiDayShiftData(){
        return (
            <View style={{width: '100%'}}>
                <Text style={[styles.descriptionText,{}]}>
                    {this.props.noOfStaffInShift + 'x ' + this.props.selectedPositionTitle}
                </Text>
                <Text style={[styles.descriptionText,{color: '#9A9A9A', marginBottom:10}]}>
                    {'Multi day shift'}
                </Text>
                {this.renderMultiDay()}
                <Text style={[styles.descriptionText,{color: '#9A9A9A', marginTop:15}]}>
                    {'Total hours: ' + (this.props.shiftDuration * this.props.count) + ' hours'}
                </Text>
                <Text style={[styles.descriptionText,{}]}>
                    {'Hourly rate: $' + this.props.workerHourlyBill}
                </Text>
                {this.props.managerAssigned == 2 &&
                    <Text style={[styles.descriptionText,{marginTop:15}]}>
                        {'1x Shift Shift Supervisor'}
                    </Text>
                }
                {this.props.managerAssigned == 2 &&
                    <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                        {'Shift Supervisor fee: '}
                        <Text style={[styles.descriptionText,{color: '#000'}]}>
                            {'$100'}
                        </Text>
                    </Text>
                }
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop:25}}>
                    <View style={{width: '47%'}}>
                        <Text style={[styles.descriptionText,{}]}>
                            {'On site contact:'}
                        </Text>
                        <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                            {this.props.name}
                        </Text>
                        <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                            {this.props.phoneNumber}
                        </Text>
                    </View>
                    <View style={{width: '47%'}}>
                        <Text style={[styles.descriptionText,{}]}>
                            {'Dresscode:'}
                        </Text>
                        <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                            {
                                this.props.shirtTabs[this.props.dresscodeShirts].label + ', ' +
                                this.props.pantTabs[this.props.dresscodePants].label + ', ' +
                                this.props.shoesTabs[this.props.dresscodeShoes].label
                            }
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    renderDots() {
        const activeDot = require('../../assets/icons/dot-active.png');
        const inactiveDot = require('../../assets/icons/dot-inactive.png');
        const sizeActive = 10
        const imageActive = this.renderCarousel(activeDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        const imageInactive = this.renderCarousel(inactiveDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {imageInactive}
                {imageInactive}
                {imageActive}
                {imageInactive}
            </View>
        )
    }

    renderCarousel(imageSource, styles){
        return(
            <View style={{width: 20, height: 15, alignItems: 'center', justifyContent: "center"}}>
                <Image
                    source={imageSource}
                    style={styles}/>
            </View>
        )
    }

    renderCheckOrUncheckIcon() {
        if(this.props.checked) {
            return checkedIcon;
        } else {
            return uncheckIcon;
        }
    }

    onContinueButtonPress(){
        this.props.navigation.navigate('NewShift074')
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                onPress={()=>{
                                    this.props.navigation.navigate('NewShift072')
                                }}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                {/*<Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            {this.renderDots()}
                        </View>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                                          onPress={()=>{this.onContinueButtonPress()}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginEnd: 5}}>Next</Text>
                            <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView
                        innerRef={ref => {this.scroll = ref}}
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow:1}}
                        style={{flex:1}}>
                        <View style={{flexGrow:1, width: width, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{width: '80%'}}>
                                <Text style={[styles.descriptionText, {color: '#9A9A9A',fontSize: 18, textAlign: 'center', marginTop:10}]}>
                                    {'Review Shift:'}
                                </Text>
                                {
                                    this.props.selectedTab == 0?
                                    this.renderSingleDayShiftData()
                                    :
                                    this.renderMultiDayShiftData()
                                }
                            </View>
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity 
                                    style={styles.navigationButton}
                                    onPress={()=>{this.onContinueButtonPress()}}>
                                    <Text style={styles.navigationButtonText}>{'Continue to payment'}</Text>
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
        backgroundColor: "#fff",
        justifyContent: "flex-start",
    },
    navigationButtonsContainer:{
        width: '70%',
        alignItems: 'center',
        alignSelf: 'center',
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
    navigationButtonText:{
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 16,
        color: '#fff'
    },
    tabButton:{
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#007AFF',
        width: '40%',
        height:40,
        margin: 5,
    },
    tabButtonText:{
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 14,
        color: '#fff'
    },
    forminputContainer: {
        height: 35,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center',
        width: "100%",
    },
    descriptionText:{
        fontFamily: 'HelveticaNeue-Roman',
        color: '#000',
        fontSize: 15,
        marginTop:5
    },
    selectedStyle:{
        padding: 3,
        borderWidth:1,
        borderColor: '#007AFF',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: '#007AFF',
    },
    unSelectedStyle:{
        padding: 3,
        width: '100%',
        textAlign: 'center',
        color: '#007AFF',
    },
});

const mapStateToProps = ({NewShift070State, NewShift072State, NewShift073State, NewShift078State}) => {
    const {
        toggleTabs, selectedTab, startShiftDate, endShiftDate, minimumDate, maximumDate,
        showdatepicker, showtimepicker, dresscodeShirts, dresscodePants,
        dresscodeShoes, index, noOfStaffInShift, managerAssigned, positionID, workingPositionsData, shiftDuration
    } = NewShift070State;
    const {
        shiftInfoTabs, address, shiftLocation, checkInLocation, additionalShiftInfo, name, phoneNumber
    } = NewShift072State;
    const {
        loading, checked, list, managerHourlyBill, workerHourlyBill, totalPayout, totalBill, selectedPositionTitle,count, isConnected
    } = NewShift073State;
    const {shirtTabs, pantTabs, shoesTabs} = NewShift078State;
    return {
        loading, toggleTabs, selectedTab, startShiftDate, endShiftDate, minimumDate, maximumDate,
        showdatepicker, showtimepicker, dresscodeShirts, dresscodePants, count,
        dresscodeShoes, index, noOfStaffInShift, managerAssigned, positionID, workingPositionsData, shiftDuration,
        shirtTabs, pantTabs, shoesTabs, shiftInfoTabs, address, shiftLocation, checkInLocation,
        additionalShiftInfo, name, phoneNumber, checked, managerHourlyBill, workerHourlyBill,
        totalPayout, totalBill, selectedPositionTitle, list, isConnected
    };
};

export default connect(mapStateToProps, {NewShift0731_Api_Call, NewShift0732_Api_Call, propChanged, propsChanged, propsClear})(NewShift073)
