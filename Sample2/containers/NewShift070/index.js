import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Appearance, useColorScheme } from 'react-native-appearance';
import moment from 'moment';
import { Picker } from 'native-base'
import {NavigationActions, StackActions} from "react-navigation";
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { NEWSHIFT070_PROP_CHANGED, NEWSHIFT072_PROP_CHANGED, NEWSHIFT070_PROP_CLEAR, NEWSHIFT078_PROP_CLEAR,NEWSHIFT072_PROP_CLEAR, NewShift0701_Api_Call, NewShift0702_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainButtomTab' })],
});

const {height, width} = Dimensions.get('window');
const noOfStaffArray = Array.from({length: 100}, (v, k) => k+1);

class NewShift070 extends Component {
    roundToNearestXXMinutes (start){
        let remainder = 30 - (start.minute()+ start.second()/60) % 30;
        remainder = (remainder >  30/2) ? remainder = - 30 + remainder : remainder;
        let changedDate = new Date(moment(start).add(remainder, "minutes" ).seconds(0));
        return changedDate
    }

    componentDidMount(){
        let start = this.roundToNearestXXMinutes(moment().add(1, 'days'))
        let end = new Date(start)
        end = moment(end).add(6, "hours");
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "startShiftDate", start);
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "endShiftDate", new Date(end));
        this.checkInternet(this.getWorkingPositionsAPICall);
        let data_object = Preference.get(mystorage.DATA_OBJECT);
        this.props.propChanged(NEWSHIFT072_PROP_CHANGED, "address", data_object.company.address);
    }

    componentWillUnmount(){
        this.props.propsClear(NEWSHIFT070_PROP_CLEAR)
    }

    checkInternet(callback = null) {
        const subscribe = NetInfo.addEventListener(state => {
            console.log("subscribe Connection type", state.type);
            console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "isConnected", state.isConnected);
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
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "loading", true);
        if(this.props.isConnected){
            const {NewShift0701_Api_Call} = this.props;
            NewShift0701_Api_Call(
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response) => {
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "loading", false);
        if (response) {
            this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "workingPositionsData", response[0]);
            // console.log('positionID: ' + JSON.stringify(response[0].positions[0]))
            // console.log('positionID: ' + JSON.stringify(response[0].positions[0].id))
            // console.log('tariff: ' + JSON.stringify(response[0].tariff))
            this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "positionID", response[0].positions[0].id);
            setTimeout(() => {
                console.log('positionID: ' + this.props.positionID)
            }, 300)
        }
    }
    onError = (error) => {
        console.log('Error: ' + JSON.stringify(error))
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        }
        if(errors.length > 0)
            alert(errors);
        else alert(error)
    }

    setStartShiftDate = (date) => {
        let startDate = new Date(date);
        let preHours = this.props.startShiftDate.getHours();
        let preMinutes = this.props.startShiftDate.getMinutes();
        startDate.setHours(preHours);
        startDate.setMinutes(preMinutes);
        let endDate = new Date(date);
        let preEndHours = this.props.endShiftDate.getHours()
        console.log("\n\nTest: " + startDate)
        let preEndMinutes = this.props.endShiftDate.getMinutes();
        endDate.setHours(preEndHours);
        endDate.setMinutes(preEndMinutes);
        if(preHours > preEndHours){
            endDate = moment(endDate).add(1, "days");
        }
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showdatepicker", false);
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "startShiftDate", new Date(startDate));
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "endShiftDate", new Date(endDate));
    }

    setEndShiftDate = (date) => {
        let newDate = new Date(date)
        let preHours = this.props.endShiftDate.getHours();
        let preMinutes = this.props.endShiftDate.getMinutes();
        newDate.setHours(preHours);
        newDate.setMinutes(preMinutes);
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showdatepicker", false);
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "endShiftDate", new Date(newDate));
    }

    setStartShiftTime = (time) => {
        let time1 = this.roundToNearestXXMinutes(moment(time))
        let startString = moment(this.props.startShiftDate).format("MM/DD/YYYY");
        let endString = moment(this.props.endShiftDate).format("MM/DD/YYYY");
        let newStartHours = time1.getHours();
        let newStartMinutes = time1.getMinutes();
        let startDate = new Date(startString);
        startDate.setHours(newStartHours);
        startDate.setMinutes(newStartMinutes);
        let newEndHours = newStartHours + 6;
        let endDate = new Date(endString)
        endDate.setHours(newEndHours);
        endDate.setMinutes(newStartMinutes);
        if(newEndHours > 23 && startString !== endString){
            endDate = moment(endDate).subtract(1, "days");
        } else if(newEndHours < 24 && startString !== endString && this.props.selectedTab == 0) {
            endDate = moment(endDate).subtract(1, "days");
        }
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showtimepicker", false);
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "startShiftDate", new Date(startDate));
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "endShiftDate", new Date(endDate));
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "shiftDuration", 6)
    }

    setEndShiftTime = (time) => {
        let startString = moment(this.props.startShiftDate).format("MM/DD/YYYY");
        let endString = moment(this.props.endShiftDate).format("MM/DD/YYYY");
        let endDate = new Date(endString)
        endDate.setHours(time.getHours());
        endDate.setMinutes(time.getMinutes());
        if(this.props.startShiftDate.getHours() > time.getHours() && startString === endString){
            endDate = moment(endDate).add(1, "days");
        } else if(this.props.selectedTab == 0 && this.props.startShiftDate.getHours() < time.getHours() && startString !== endString){
            endDate = moment(endDate).subtract(1, "days");
        }
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "endShiftDate", new Date(endDate));
    }

    setShiftSettings = (date) => {
        console.log("Date: " + moment(date).format('DD/MM/YYYY'))
        if(this.props.index == 0){
            if((moment(date).isBefore(moment(),'day'))){
                date = new Date();
            }
            this.setStartShiftDate(date);
        } else if(this.props.index == 1){
            if((moment(date).isBefore(moment(this.props.endShiftDate),'day'))) {
               date = moment(moment(this.props.startShiftDate)).add(6, 'hours');
            }
            this.setEndShiftDate(date);
        } else if(this.props.index == 2){
            this.setStartShiftTime(date);
        }
    }

    getdateVariable = () => {
        if(this.props.index == 0 || this.props.index == 2){
            return new Date(this.props.startShiftDate);
        } else if(this.props.index == 1 || this.props.index == 3){
            return new Date(this.props.endShiftDate);
        }
    }

    renderDots() {
        const activeDot = require('../../assets/icons/dot-active.png');
        const inactiveDot = require('../../assets/icons/dot-inactive.png');
        const sizeActive = 10
        const imageActive = this.renderCarousel(activeDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        const imageInactive = this.renderCarousel(inactiveDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {imageActive}
                {imageInactive}
                {imageInactive}
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

    renderShiftPositionPicker(){
        return(
            <View style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}>
                <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>
                <Picker
                    selectedValue={this.props.positionID}
                    style={{height: 30, width: '100%', backgroundColor: '#00000000'}}
                    mode={'dialog'}
                    placeholder={'Choose Position'}
                    iosHeader={'Choose Position'}
                    onValueChange={(itemValue, itemIndex) => {
                        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "positionID", itemValue)
                    }}>
                    {
                        this.props.workingPositionsData.positions.map((item, index)=>{
                            return <Picker.Item key={index} label={item.title_en} value={item.id} />
                        })
                    }
                </Picker>
            </View>
        )
    }

    renderNumberOfStaffPicker(){
        return(
            <View style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 9}}>
                <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>
                <Picker
                    selectedValue={this.props.noOfStaffInShift}
                    style={{height: 30, width: '100%', backgroundColor: '#00000000'}}
                    mode={'dialog'}
                    placeholder={'Choose no of Staff'}
                    iosHeader={'Choose no of Staff'}
                    onValueChange={(itemValue, itemIndex) =>{
                        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "noOfStaffInShift", itemValue)
                        if (itemValue >= 10)
                            this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "managerAssigned", '2')
                        else
                            this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "managerAssigned", '1')
                    }}>
                    {noOfStaffArray.map((item, index)=>{
                        return <Picker.Item key={index} label={item + ''} value={item + ''} />
                    })}
                </Picker>
            </View>
        )
    }

    renderShiftDurationPicker(){
        return(
            <View style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 8}}>
                <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>
                <Picker
                    selectedValue={this.props.shiftDuration}
                    style={{height: 30, width: '100%', backgroundColor: '#00000000'}}
                    mode={'dialog'}
                    placeholder={'Choose shift duration'}
                    iosHeader={'Choose shift duration'}
                    onValueChange={(itemValue, itemIndex) =>{
                        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "shiftDuration", itemValue)
                        let date = new Date(this.props.startShiftDate)
                        console.log('oldDate: ' + date)
                        date = moment(date).add(itemValue, "hours");
                        console.log('Date: ' + new Date(date))
                        this.setEndShiftTime(new Date(date))
                    }}>

                    <Picker.Item label="6 hours" value={6} />
                    <Picker.Item label="7 hours" value={7} />
                    <Picker.Item label="8 hours" value={8} />
                    <Picker.Item label="9 hours" value={9} />
                    <Picker.Item label="10 hours" value={10} />
                </Picker>
            </View>
        )
    }

    renderManagerPicker(){
        const isManager = this.props.noOfStaffInShift >= 10;
        const sourceDownArrow = isManager ? require('../../assets/icons/down_disabled.png') : require('../../assets/icons/down.png')
        return(
            <View style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: isManager ? '#9A9A9A' : '#000', marginTop: 8}}>
                <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={sourceDownArrow}/>
                <Picker
                    selectedValue={this.props.managerAssigned}
                    enabled={!isManager}
                    style={{height: 30, width: '100%', backgroundColor: '#00000000', color: isManager ? '#9A9A9A' : '#000'}}
                    mode={'dialog'}
                    placeholder={'Choose Shift Supervisor'}
                    iosHeader={'Choose Shift Supervisor'}
                    onValueChange={(itemValue, itemIndex) => {
                        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "managerAssigned", itemValue)
                    }}>
                    <Picker.Item label="No" value="1" />
                    <Picker.Item label="Yes" value="2" />
                </Picker>
            </View>
        )
    }

    renderShiftTabs(){
        return this.props.toggleTabs.map((item, index)=>{
            return (
                <TouchableOpacity style={styles.tabButton} onPress={()=>{
                    this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "selectedTab", index)
                }}>
                    <Text style={[styles.navigationButtonText,this.selectedUnselectedTabStyle(index)]}>{item.label}</Text>
                </TouchableOpacity>
            )
        })
    }

    selectedUnselectedTabStyle(index) {
        if(this.props.selectedTab === index) {
            return styles.selectedStyle;
        } else {
            return styles.unSelectedStyle;
        }
    }
    renderSingleShiftView(){
        return (
            <View style={{justifyContent:"center", alignItems: 'center', width:"80%"}}>
                <View style={{flexDirection: 'row', width: '100%', marginTop: 20, justifyContent: 'space-between'}}>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'Shift date'}
                        </Text>
                        <TouchableOpacity
                            style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}
                            onPress={()=>{
                                let maxDate = new Date(moment(new Date()).add(12,  'months'));
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "index", 0)
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "minimumDate", new Date(moment().add(1, 'days')))
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "maximumDate", maxDate)
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showdatepicker", true)
                            }}>
                            <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>
                            <Text style={{fontSize: 16, padding: 4}}>{moment(this.props.startShiftDate).format('MM/DD/YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'# of staff'}
                        </Text>
                        {this.renderNumberOfStaffPicker()}
                    </View>
                </View>
                <View style={{flexDirection: 'row', width: '100%', marginTop: 20, justifyContent: 'space-between'}}>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'Start time'}
                        </Text>
                        <TouchableOpacity style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}
                                          onPress={()=>{
                                            this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "index", 2)
                                            this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showtimepicker", true)
                                        }}>
                            <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>
                            <Text style={{fontSize: 16, padding: 4}}>{moment(this.props.startShiftDate).format('LT')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'Shift duration'}
                        </Text>
                        {this.renderShiftDurationPicker()}
                        {/*<TouchableOpacity style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}*/}
                        {/*                  onPress={()=>{*/}
                        {/*                    this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "index", 3)*/}
                        {/*                    this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showtimepicker", true)*/}
                        {/*                }}>*/}
                        {/*    <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>*/}
                        {/*    <Text style={{fontSize: 15, padding: 4}}>{moment(this.props.endShiftDate).format('LT')}</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity style={{width:20, height:20, position: 'absolute', right:10, top:15}}
                                          onPress={()=>{alert('The end time of the shift must be between 6 and 10 hours')}}>
                            <Image style={{resizeMode: 'contain', width: '100%', height: '100%'}} source={require('../../assets/icons/Info.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{width: '47%', marginTop:20}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                        {'Supervisor'}
                    </Text>
                    {this.renderManagerPicker()}
                    <TouchableOpacity style={{width:20, height:20, position: 'absolute', right:10, top:15}}
                                      onPress={()=>{alert('When you are posting a shift for 10 or more workers, the shift supervisor is required')}}>
                        <Image style={{resizeMode: 'contain', width: '100%', height: '100%'}} source={require('../../assets/icons/Info.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderMultiShiftView(){
        return (
            <View style={{justifyContent:"center", alignItems: 'center', width:"80%"}}>
                <View style={{flexDirection: 'row', width: '100%', marginTop: 20, justifyContent: 'space-between'}}>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'Begin date'}
                        </Text>
                        <TouchableOpacity
                            style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}
                            onPress={()=>{
                                let maxDate = new Date(moment(new Date()).add(12,  'months'));
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "index", 0)
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "minimumDate", new Date(moment().add(1, 'days')))
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "maximumDate", maxDate)
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showdatepicker", true)
                            }}>
                            <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>
                            <Text style={{fontSize: 16, padding: 4}}>{moment(this.props.startShiftDate).format('MM/DD/YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'End date'}
                        </Text>
                        <TouchableOpacity
                            style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}
                            onPress={()=>{
                                let maxDate = new Date(moment(this.props.startShiftDate).add(14,  'days'));
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "index", 1)
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "minimumDate", new Date(this.props.startShiftDate))
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "maximumDate", maxDate)
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showdatepicker", true)
                            }}>
                            <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>
                            <Text style={{fontSize: 16, padding: 4}}>{moment(this.props.endShiftDate).format('MM/DD/YYYY')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width:20, height:20, position: 'absolute', right:10, top:15}}
                            onPress={()=>{alert('The End date of the shift can be maximum of 14 days from the begin date')}}>
                            <Image style={{resizeMode: 'contain', width: '100%', height: '100%'}} source={require('../../assets/icons/Info.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection: 'row', width: '100%', marginTop: 20, justifyContent: 'space-between'}}>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'# of staff'}
                        </Text>
                        {this.renderNumberOfStaffPicker()}
                    </View>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'Supervisor'}
                        </Text>
                        {this.renderManagerPicker()}
                        <TouchableOpacity
                            style={{width:20, height:20, position: 'absolute', right:10, top:15}}
                            onPress={()=>{alert('When you are posting a shift for 10 or more workers, the shift upervisor is required')}}>
                            <Image style={{resizeMode: 'contain', width: '100%', height: '100%'}} source={require('../../assets/icons/Info.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection: 'row', width: '100%', marginTop: 20, justifyContent: 'space-between'}}>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'Start time'}
                        </Text>
                        <TouchableOpacity
                            style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}
                            onPress={()=>{
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "index", 2)
                                this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showtimepicker", true)
                            }}>
                            <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>
                            <Text style={{fontSize: 16, padding: 4}}>{moment(this.props.startShiftDate).format('LT')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '47%'}}>
                        <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 10}}>
                            {'Shift duration'}
                        </Text>
                        {this.renderShiftDurationPicker()}
                        {/*<TouchableOpacity*/}
                        {/*    style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}*/}
                        {/*    onPress={()=>{*/}
                        {/*        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "index", 3)*/}
                        {/*        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showtimepicker", true)*/}
                        {/*    }}>*/}
                        {/*    <Image resizeMode={'contain'} style={{position: 'absolute', right:10, width:15, height: 15}} source={require('../../assets/icons/down.png')}/>*/}
                        {/*    <Text style={{fontSize: 15, padding: 4}}>{moment(this.props.endShiftDate).format('LT')}</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity
                            style={{width:20, height:20, position: 'absolute', right:10, top:15}}
                            onPress={()=>{alert('The end time of the shift must be between 6 and 10 hours')}}>
                            <Image style={{resizeMode: 'contain', width: '100%', height: '100%'}} source={require('../../assets/icons/Info.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    onNextButtonPress(){
        if(this.props.positionID != '0'){
            this.props.navigation.navigate('NewShift072')
        } else {
            alert('Choose Position')
        }
    }

    onBackButtonPress(){
        Alert.alert(
            'Are you sure?',
            'Do you really wants to go back',
            [
                {text: 'No', onPress: () => {}, style: 'cancel',},
                {text: 'Yes',
                     onPress: () => {
                        this.props.propsClear(NEWSHIFT070_PROP_CLEAR)
                        this.props.propsClear(NEWSHIFT072_PROP_CLEAR)
                        this.props.propsClear(NEWSHIFT078_PROP_CLEAR)
                        this.props.navigation.dispatch(resetAction)
                    }
                },
            ],
            {cancelable: true},
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.onBackButtonPress()}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                {/*<Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            {this.renderDots()}
                        </View>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                                          onPress={()=>{this.onNextButtonPress()}}>
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
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', textAlign: 'center', fontSize: 18, marginTop: 10}}>
                                    {'Shift position:'}
                                </Text>
                                {this.renderShiftPositionPicker()}
                            </View>
                            <View style={{flexDirection: 'row', width: '80%', borderWidth: 2,borderRadius: 5,borderColor: '#007AFF', marginTop: 20}}>
                                {this.renderShiftTabs()}
                            </View>
                            {this.props.selectedTab == 0 ?
                                this.renderSingleShiftView()
                                :
                                this.renderMultiShiftView()
                            }
                            <View style={{width: '80%', marginTop: 10}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', fontSize: 18, marginTop: 20, textAlign: 'center'}}>
                                    {'Dresscode'}
                                </Text>
                                <TouchableOpacity style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}
                                                onPress={()=>{
                                                    this.props.navigation.navigate('NewShift078')
                                                }}>
                                    <Text style={{fontSize: 15, padding: 4}}>
                                    {
                                        this.props.shirtTabs[this.props.dresscodeShirts].label + ', ' +
                                        this.props.pantTabs[this.props.dresscodePants].label + ', ' +
                                        this.props.shoesTabs[this.props.dresscodeShoes].label
                                    }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.navigationButton}
                                    onPress={()=>{
                                        this.onNextButtonPress()
                                    }}>
                                    <Text style={styles.navigationButtonText}>Next</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <DateTimePickerModal
                    value={this.getdateVariable()}
                    date={this.getdateVariable()}
                    isVisible={this.props.showdatepicker}
                    mode="date"
                    headerTextIOS={'Pick Date'}
                    isDarkModeEnabled={Appearance.getColorScheme() === 'dark'}
                    minimumDate={this.props.minimumDate}
                    maximumDate={this.props.maximumDate}
                    onConfirm={(date) =>this.setShiftSettings(date)}
                    onCancel={() => {
                        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showdatepicker", false)
                    }}
                />
                <DateTimePickerModal
                    value={this.getdateVariable()}
                    date={this.getdateVariable()}
                    isVisible={this.props.showtimepicker}
                    mode={'time'}
                    headerTextIOS={'Pick Time'}
                    isDarkModeEnabled={Appearance.getColorScheme() === 'dark'}
                    is24Hour={false}
                    minuteInterval={30}
                    onConfirm={(date) =>this.setShiftSettings(date)}
                    onCancel={() => {
                        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, "showtimepicker", false)
                    }}
                />
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
        marginTop: 20,
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
        fontSize: 15,
        color: '#fff'
    },
    tabButton:{
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
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
        fontSize: 15,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
        height:40,
        width: "100%",
        paddingBottom:2,
    },
    selectedStyle:{
        padding: 3,
        borderWidth:1,
        borderColor: '#007AFF',
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#007AFF',
    },
    unSelectedStyle:{
        padding: 3,
        width: '100%',
        textAlign: 'center',
        color: '#007AFF',
    }
});

const mapStateToProps = ({NewShift070State, NewShift072State, NewShift078State}) => {
    const {shirtTabs, pantTabs, shoesTabs} = NewShift078State;
    const {
        loading, toggleTabs, selectedTab, startShiftDate, endShiftDate, minimumDate, maximumDate,
        showdatepicker, showtimepicker, dresscodeShirts, dresscodePants, shiftDuration,
        dresscodeShoes, index, noOfStaffInShift, managerAssigned, positionID, workingPositionsData, isConnected
    } = NewShift070State;
    return {
        loading, toggleTabs, selectedTab, startShiftDate, endShiftDate, minimumDate, maximumDate,
        showdatepicker, showtimepicker, dresscodeShirts, dresscodePants, shiftDuration,
        dresscodeShoes, index, noOfStaffInShift, managerAssigned, positionID, workingPositionsData,
        shirtTabs, pantTabs, shoesTabs, isConnected
    };
};

export default connect(mapStateToProps, {NewShift0701_Api_Call, NewShift0702_Api_Call, propChanged, propsClear})(NewShift070)
