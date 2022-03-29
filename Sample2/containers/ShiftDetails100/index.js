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
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { SHIFTFEED080_PROP_CHANGED, SHIFTFEED080_PROP_CLEAR, ShiftDetails1001_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import AvatarComponent from '../../components/AvatarComponent';
const {height, width} = Dimensions.get('window');

class ShiftDetails100 extends Component {

    componentDidMount(){
        this.checkInternet(this.getShiftsAPICall);
        // console.log(JSON.stringify(this.props.selectedShiftItem))
    }

    checkInternet(callback = null) {
        const subscribe = NetInfo.addEventListener(state => {
            // console.log("subscribe Connection type", state.type);
            // console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "isConnected", state.isConnected);
            if(callback && typeof callback == 'function'){
                setTimeout(()=>{
                    callback(this.props.selectedShiftItemID)
                },500)
            }
        });
        subscribe();
    }

    getShiftsAPICall = (shiftID) => {
        console.log("API Is called? ", this.props.isConnected);
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", true);
        if(this.props.isConnected){
            const {ShiftDetails1001_Api_Call} = this.props;
            ShiftDetails1001_Api_Call(
                {
                    shiftID: shiftID
                },
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response) => {
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
        if (response) {
            // console.log('Response: ' + JSON.stringify(response))
            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedShiftItem", response);
        }
    }
    onError = (error) => {
        console.log('1Error: ' + JSON.stringify(error))
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        }
        if(errors.length > 0)
            alert(errors);
        else alert(error)
    }

    renderHeaderTabs(){
        return (
            <View style={styles.tabHeaderButton}>
                <TouchableOpacity style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}
                      onPress={()=>{
                          this.props.screenIDHandler(80)
                      }}>
                    <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17}}>Back</Text>
                </TouchableOpacity>
                <View style={{flex: 1, width: '60%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, textAlign: 'center'}}>{'Posted shift'}</Text>
                </View>
                <View style={{width: '20%', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}>
                </View>
            </View>
        )
    }

    renderShiftInfoTabs(){
        let shiftInfoTabsList = [];
        if(this.props.selectedShiftItem.parking_no) shiftInfoTabsList.push('No parking');
        if(this.props.selectedShiftItem.parking_free) shiftInfoTabsList.push('Free parking');
        if(this.props.selectedShiftItem.parking_paid) shiftInfoTabsList.push('Paid parking');
        if(this.props.selectedShiftItem.meal_provided) shiftInfoTabsList.push('Meal provided');
        if(this.props.selectedShiftItem.staff_entrance) shiftInfoTabsList.push('Staff entrance');
        if(this.props.selectedShiftItem.main_entrance) shiftInfoTabsList.push('Main entrance');
        return (
            <View style={{width: '80%', alignItems: 'center'}}>
                {(this.props.selectedShiftItem.info !== '' || shiftInfoTabsList.length > 0)
                    &&
                    <View style={{width: '100%', marginTop: 10, alignItems: 'center'}}>
                        <Text style={[styles.textStyle,{textAlignVertical: 'center'}]}>{'Additional shift info:'}</Text>
                    </View>
                }  
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    {
                        shiftInfoTabsList.map((item, index)=> {
                            return ( index < 3 &&
                                <View style={styles.tabButton}>
                                    <Text style={[styles.tabButtonText]}>{item}</Text>
                                </View>
                            )
                        })}
                </View>
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    {
                        shiftInfoTabsList.map((item, index)=> {
                            return ( index >= 3 &&
                                <View style={styles.tabButton}>
                                    <Text style={[styles.tabButtonText]}>{item}</Text>
                                </View>
                            )
                        })}
                </View>
                {this.props.selectedShiftItem.info !== '' &&
                    <View style={[styles.forminputContainer,{width: '100%'}]}>
                        <Text style={styles.inputText}>
                            {this.props.selectedShiftItem.info}
                        </Text>
                    </View>
                }
            </View>
        )
    }

    render() {
        console.log("Item: " + JSON.stringify(this.props.selectedShiftItem.company_logo))
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
                        style={{flex:1, width:width}}>
                        <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 60}}>
                            <View style={{flex:1, width: '100%', backgroundColor: '#fff'}}>
                                <AvatarComponent
                                    size={"large"}
                                    source={this.props.selectedShiftItem.company_logo}
                                    style={{height:150,backgroundColor: '#eee'}}
                                />
                            </View>
                            <Text style={[styles.textStyle,{fontSize: 22, color: '#000'}]}>{this.props.selectedShiftItem.company_name}</Text>
                            <Text style={[styles.textStyle,{color: '#000'}]}>{this.props.selectedShiftItem.of_staff + ' x ' + this.props.selectedShiftItem.position.title_en}</Text>
                            {this.props.selectedShiftItem.manager &&
                                <Text style={[styles.textStyle,{color: '#000'}]}>{'1 x Shift Supervisor'}</Text>
                            }
                            <View style={{flexDirection: 'row', width: '60%', justifyContent: 'center', alignItems: 'space-between'}}>
                                <Text style={[styles.textStyle,{width: '50%', color: '#000'}]}>{parseFloat(this.props.selectedShiftItem.time_difference).toFixed(0) + ' hours'}</Text>
                                <Text style={[styles.textStyle,{width: '50%', textAlign: 'right', color: '#007AFF'}]}>{'$'+ this.props.selectedShiftItem.price_billing}</Text>
                            </View>
                            <View style={{flexDirection: 'row', width: '70%', justifyContent: 'center', alignItems: 'space-between'}}>
                                <Text style={[styles.textStyle,{width: '50%', color: '#000'}]}>{'Shift starts:'}</Text>
                                <Text style={[styles.textStyle,{width: '50%', textAlign: 'right'}]}>
                                    {
                                        moment(this.props.selectedShiftItem.custom_starts_date).format('DD/MM') +
                                        ' - ' +
                                        this.props.selectedShiftItem.custom_starts_time
                                    }
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', width: '70%', justifyContent: 'center', alignItems: 'space-between'}}>
                                <Text style={[styles.textStyle,{width: '50%', color: '#000'}]}>{'Shift ends:'}</Text>
                                <Text style={[styles.textStyle,{width: '50%', textAlign: 'right'}]}>
                                    {
                                        moment(this.props.selectedShiftItem.custom_ends_date).format('DD/MM') +
                                        ' - ' +
                                        this.props.selectedShiftItem.custom_ends_time
                                    }
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', width: '70%', justifyContent: 'center', alignItems: 'space-between'}}>
                                <Text style={[styles.textStyle,{width: '50%', color: '#000', alignSelf: 'center'}]}>{'Dresscode:'}</Text>
                                <Text style={[styles.textStyle,{width: '50%', textAlign: 'right'}]}>
                                    {
                                        this.props.selectedShiftItem.dresscode_shirts + ', ' +
                                        this.props.selectedShiftItem.dresscode_pants + ', ' +
                                        this.props.selectedShiftItem.dresscode_shoes
                                    }
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', width: '70%', justifyContent: 'center', alignItems: 'space-between'}}>
                                <Text style={[styles.textStyle,{width: '50%', color: '#000'}]}>{'Shift location:'}</Text>
                                <Text style={[styles.textStyle,{width: '50%', textAlign: 'right'}]}>{this.props.selectedShiftItem.location}</Text>
                            </View>
                            <View style={{flexDirection: 'row', width: '70%', justifyContent: 'center', alignItems: 'space-between'}}>
                                <Text style={[styles.textStyle,{width: '50%', color: '#000'}]}>{'Check In Location:'}</Text>
                                <Text style={[styles.textStyle,{width: '50%', textAlign: 'right'}]}>{this.props.selectedShiftItem.clock_in_location}</Text>
                            </View>
                            <View style={{flexDirection: 'row', width: '70%', justifyContent: 'center', alignItems: 'space-between'}}>
                                <Text style={[styles.textStyle,{width: '50%', color: '#000',alignSelf: 'center'}]}>{'Shift Address:'}</Text>
                                <Text style={[styles.textStyle,{width: '50%', textAlign: 'right'}]}>{this.props.selectedShiftItem.address}</Text>
                            </View>
                            {this.renderShiftInfoTabs()}
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
        marginTop:5,
        fontFamily: 'HelveticaNeue-Medium',
        color: '#9A9A9A',
        fontSize: 16,
        lineHeight: 25
    },
    tabButtonText:{
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 14,
        color: '#fff',
        width: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    tabButton:{
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#007AFF',
        backgroundColor: '#007AFF',
        width: '40%',
        height:40,
        margin: 5,
    },
    forminputContainer: {
        width: "80%",
        borderColor: '#9A9A9A',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'flex-start',
        padding: 10,
        paddingBottom:20,
        marginBottom: 30,
        marginTop: 10,
    },
    inputText:{
        textAlignVertical: 'top',
        fontSize: 16,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#9A9A9A',
        width: "100%",
        paddingBottom:2,
    },
});

const mapStateToProps = ({ShiftFeed080State}) => {
    const {
        loading, selectedShiftItemID, selectedShiftItem, isConnected
    } = ShiftFeed080State;
    return {
        loading, selectedShiftItemID, selectedShiftItem, isConnected };
};

export default connect(mapStateToProps, {ShiftDetails1001_Api_Call, propChanged, propsClear})(ShiftDetails100);
