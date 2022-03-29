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
import { 
    NEWSHIFT073_PROP_CHANGED, 
    PAYMENTSCREEN400_PROP_CHANGED,
    NEWSHIFT070_PROP_CLEAR, 
    NEWSHIFT078_PROP_CLEAR, 
    NEWSHIFT073_PROP_CLEAR,
    NEWSHIFT072_PROP_CLEAR, 
    NewShift0731_Api_Call, 
    NewShift0732_Api_Call 
} from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'NewShift075' })],
});
const uncheckIcon = require('../../assets/icons/rounded_uncheck.png')
const checkedIcon = require('../../assets/icons/rounded_check.png');
const {height, width} = Dimensions.get('window');

class NewShift074 extends Component {

    componentDidMount(){
        this.checkInternet();
        this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "selectedIndex", Preference.get(mystorage.CARD_PRIMARY));
        this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "radioOptions", Preference.get(mystorage.CARD_OBJECT));
    }

    checkInternet() {
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(NEWSHIFT073_PROP_CHANGED, "isConnected", state.isConnected);
        });
        subscribe();
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
                {imageInactive}
                {imageActive}
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

    renderFooterText() {
        return (
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={this.renderCheckOrUncheckIcon()} style={{height: 20, width: 20}} resizeMode={'contain'}/>
                    <Text style={{color: '#000', fontSize: 15, marginLeft: 10, textAlign: 'center'}}>
                        {
                            'Credit card ending in ' +
                            ((this.props.radioOptions.length > 0) ?  this.props.radioOptions[this.props.selectedIndex].last4 : '')
                        }
                    </Text>
                </View>
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

    onPostShiftButtonPress(){
        if(this.props.selectedTab == 0){
            this.callSingleDayShiftApi();
        } else {
            this.callMultiDayShiftApi();
        }
    }

    callSingleDayShiftApi(){
        console.log('single day api callded')
        if(this.props.isConnected){
            this.props.propChanged(NEWSHIFT073_PROP_CHANGED, "loading", true);
            var details = {
                position: this.props.positionID,
                category: 'Single day',
                of_staff: this.props.noOfStaffInShift,
                starts: moment(this.props.startShiftDate).format('YYYY-MM-DD') + ' ' +
                        moment(this.props.startShiftDate).format('HH:mm'),
                ends: moment(this.props.endShiftDate).format('YYYY-MM-DD') + ' ' +
                        moment(this.props.endShiftDate).format('HH:mm'),
                manager: this.props.managerAssigned == '1' ? false : true,
                dresscode_shirts: this.props.shirtTabs[this.props.dresscodeShirts].label,
                dresscode_pants: this.props.pantTabs[this.props.dresscodePants].label,
                dresscode_shoes: this.props.shoesTabs[this.props.dresscodeShoes].label,
                company: Preference.get(mystorage.COMPANY_ID),
                address: this.props.address,
                location: this.props.shiftLocation,
                clock_in_location: this.props.checkInLocation,
                parking_no: this.props.shiftInfoTabs[0].active,
                parking_free: this.props.shiftInfoTabs[1].active,
                parking_paid: this.props.shiftInfoTabs[2].active,
                meal_provided: this.props.shiftInfoTabs[3].active,
                staff_entrance: this.props.shiftInfoTabs[4].active,
                main_entrance: this.props.shiftInfoTabs[5].active,
                info: this.props.additionalShiftInfo,
                contact_name: this.props.name,
                contact_phone: (this.props.phoneNumber).split(' ').join(''),
                price: this.props.totalPayout,
                price_billing: parseInt(this.props.totalBill),
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            const {NewShift0731_Api_Call} = this.props;
            NewShift0731_Api_Call(
                formBody,
                onSuccess = (response)=> {
                    console.log('success')
                    if(response){
                        this.props.propsClear(NEWSHIFT072_PROP_CLEAR)
                        this.props.propsClear(NEWSHIFT078_PROP_CLEAR)
                        this.props.propChanged(NEWSHIFT073_PROP_CHANGED, "loading", false);
                        this.props.navigation.dispatch(resetAction)
                    }
                },
                onError = (error) => {
                    console.log('error')
                    console.log('Error: ' + JSON.stringify(error))
                    this.props.propChanged(NEWSHIFT073_PROP_CHANGED, "loading", false);
                    let errors = ''
                    if(error.position){
                        errors += 'position: ' + error.position[0]
                    }
                    if(error.category){
                        errors += error.category[0]
                    }
                    if(error.of_staff){
                        errors += error.of_staff[0]
                    }
                    if(error.starts){
                        errors += error.starts[0]
                    }
                    if(error.ends){
                        errors += error.ends[0]
                    }
                    if(error.ends){
                        errors += error.ends[0]
                    }
                    if(error.company){
                        errors += error.company[0]
                    }
                    if(error.contact_phone){
                        errors += error.contact_phone[0]
                    }
                    if(errors.length > 0)
                        alert(errors);
                    else {alert(JSON.stringify(error))}
                }
            );
        } else {alert('Please check your internet')}
    }

    callMultiDayShiftApi(){
        console.log('multi day api callded')
        if(this.props.isConnected){
            this.props.propChanged(NEWSHIFT073_PROP_CHANGED, "loading", true);
            var details = {
                position: this.props.positionID,
                of_staff: this.props.noOfStaffInShift,
                begin_date: moment(this.props.startShiftDate).format('YYYY-MM-DD'),
                end_date: moment(this.props.endShiftDate).format('YYYY-MM-DD'),
                start_time: moment(this.props.startShiftDate).format('HH:mm'),
                end_time: moment(this.props.endShiftDate).format('HH:mm'),
                manager: this.props.managerAssigned == '1' ? 'False' : 'True',
                dresscode_shirts: this.props.shirtTabs[this.props.dresscodeShirts].label,
                dresscode_pants: this.props.pantTabs[this.props.dresscodePants].label,
                dresscode_shoes: this.props.shoesTabs[this.props.dresscodeShoes].label,
                company: Preference.get(mystorage.COMPANY_ID),
                address: this.props.address,
                location: this.props.shiftLocation,
                clock_in_location: this.props.checkInLocation,
                parking_no: this.props.shiftInfoTabs[0].active ? 'True' : 'False',
                parking_free: this.props.shiftInfoTabs[1].active ? 'True' : 'False',
                parking_paid: this.props.shiftInfoTabs[2].active ? 'True' : 'False',
                meal_provided: this.props.shiftInfoTabs[3].active ? 'True' : 'False',
                staff_entrance: this.props.shiftInfoTabs[4].active ? 'True' : 'False',
                main_entrance: this.props.shiftInfoTabs[5].active ? 'True' : 'False',
                info: this.props.additionalShiftInfo,
                contact_name: this.props.name,
                contact_phone: (this.props.phoneNumber).split(' ').join(''),
                price: this.props.totalPayout,
                price_billing: parseInt(this.props.totalBill),
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            const {NewShift0732_Api_Call} = this.props;
            NewShift0732_Api_Call(
                formBody,
                onSuccess = (response)=> {
                    if(response.status == 200){
                        this.props.propsClear(NEWSHIFT072_PROP_CLEAR)
                        this.props.propsClear(NEWSHIFT078_PROP_CLEAR)
                        this.props.propChanged(NEWSHIFT073_PROP_CHANGED, "loading", false);
                        this.props.navigation.dispatch(resetAction)
                    }
                },
                onError = (error) => {
                    console.log('Error: ' + JSON.stringify(error))
                    this.props.propChanged(NEWSHIFT073_PROP_CHANGED, "loading", false);
                    let errors = ''
                    if(error.position){
                        errors += 'position: ' + error.position[0]
                    }
                    if(error.category){
                        errors += error.category[0]
                    }
                    if(error.of_staff){
                        errors += error.of_staff[0]
                    }
                    if(error.starts){
                        errors += error.starts[0]
                    }
                    if(error.ends){
                        errors += error.ends[0]
                    }
                    if(error.ends){
                        errors += error.ends[0]
                    }
                    if(error.company){
                        errors += error.company[0]
                    }
                    if(error.contact_phone){
                        errors += error.contact_phone[0]
                    }
                    if(errors.length > 0)
                        alert(errors);
                    else {alert(JSON.stringify(error))}
                }
            );
        } else {alert('Please check your internet')}
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
                                    this.props.navigation.navigate('NewShift073')
                                }}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                {/*<Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            {this.renderDots()}
                        </View>
                        <TouchableOpacity 
                            style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                            onPress={()=>{this.onPostShiftButtonPress()}}>
                            {(this.props.radioOptions.length > 0) && <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginEnd: 5}}>Next</Text>}
                            {(this.props.radioOptions.length > 0) && <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>}
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
                            <View style={{width: '80%', alignItems: 'center'}}>
                                <Text style={[styles.descriptionText, {color: '#9A9A9A',fontSize: 18, textAlign: 'center', marginTop:10}]}>
                                    {'Payment Review:'}
                                </Text>
                                <Text style={[styles.descriptionText,{color: '#000', marginTop: 20}]}>
                                    {'Estimated cost for this shift:'}
                                </Text>
                                <Text style={[styles.descriptionText,{color: '#007AFF'}]}>
                                    {'$' + this.props.estimatedCostFirst.toFixed(0)  + ' - $' + this.props.estimatedCostSecond.toFixed(0)}
                                </Text>
                                <Text style={[styles.descriptionText,{color: '#9A9A9A'}]}>
                                    {'Total shift duration: ' + (this.props.shiftDuration * this.props.count) + ' hours'}
                                </Text>
                                {(this.props.radioOptions.length > 0) ?
                                    <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', marginTop:40}}>
                                        <Text style={[styles.descriptionText, {color: '#9A9A9A',fontSize: 18, textAlign: 'center'}]}>
                                            {'Select payment method:'}
                                        </Text>
                                        {(this.props.radioOptions.length > 0) && this.renderFooterText()}
                                        <TouchableOpacity
                                            style={{width: '100%', justifyContent: 'center', marginTop: 10}}
                                            onPress={()=>{
                                                this.props.navigation.navigate('NewShift077')
                                            }}>
                                            <Text style={{color: '#007AFF',fontSize: 15, padding: 4, textAlign: 'center'}}>{'Change payment method'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={[styles.navigationButtonsContainer, {marginTop: 40}]}>
                                        <TouchableOpacity 
                                            style={styles.navigationButton}
                                            onPress={()=>{this.props.navigation.navigate('Registration057')}}>
                                            <Text style={styles.navigationButtonText}>{'Add Card'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                <Text style={[styles.descriptionText, {color: '#9A9A9A',fontSize: 14, textAlign: 'center', marginTop:40}]}>
                                    {
                                        'We will place a hold on your payment method ' +
                                        '24 hours before the start of the shift.\n' +
                                        'You will only be charged based on the actual ' +
                                        'number of hours worked by our Heroes.'
                                    }
                                </Text>
                            </View>
                            <View style={{flexGrow:1}}/>
                            {(this.props.radioOptions.length > 0) &&
                                <View style={styles.navigationButtonsContainer}>
                                    <TouchableOpacity 
                                        style={styles.navigationButton}
                                        onPress={()=>{this.onPostShiftButtonPress()}}>
                                        <Text style={styles.navigationButtonText}>Post shift</Text>
                                    </TouchableOpacity>
                                </View>
                            }
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
        marginTop: 10
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

const mapStateToProps = ({NewShift070State, NewShift072State, NewShift073State, NewShift078State, PaymentScreen400State}) => {
    const {
        toggleTabs, selectedTab, startShiftDate, endShiftDate, minimumDate, maximumDate,
        showdatepicker, showtimepicker, dresscodeShirts, dresscodePants,
        dresscodeShoes, index, noOfStaffInShift, managerAssigned, positionID, workingPositionsData, shiftDuration
    } = NewShift070State;
    const {
        shiftInfoTabs, address, shiftLocation, checkInLocation, additionalShiftInfo, name, phoneNumber
    } = NewShift072State;
    const {
        loading, checked, list, managerHourlyBill, workerHourlyBill, totalPayout, totalBill, 
        selectedPositionTitle, estimatedCostFirst, estimatedCostSecond, count, isConnected
    } = NewShift073State;
    const {shirtTabs, pantTabs, shoesTabs} = NewShift078State;
    const { radioOptions, selectedIndex } = PaymentScreen400State;
    return {
        loading, toggleTabs, selectedTab, startShiftDate, endShiftDate, minimumDate, maximumDate,
        showdatepicker, showtimepicker, dresscodeShirts, dresscodePants, count,
        dresscodeShoes, index, noOfStaffInShift, managerAssigned, positionID, workingPositionsData, shiftDuration,
        shirtTabs, pantTabs, shoesTabs, shiftInfoTabs, address, shiftLocation, checkInLocation,
        additionalShiftInfo, name, phoneNumber, checked, managerHourlyBill, workerHourlyBill,
        totalPayout, totalBill, selectedPositionTitle, list, estimatedCostFirst, estimatedCostSecond, 
        radioOptions, selectedIndex, isConnected
    };
};

export default connect(mapStateToProps, {NewShift0731_Api_Call, NewShift0732_Api_Call, propChanged, propsClear})(NewShift074)
