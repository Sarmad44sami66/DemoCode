import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { SHIFTFEED080_PROP_CHANGED, SHIFTFEED080_PROP_CLEAR, ShiftDetails1011_Api_Call, ShiftDetails1012_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import AvatarComponent from '../../components/AvatarComponent';
const {height, width} = Dimensions.get('window');

class ShiftDetails101 extends Component {

    componentDidMount(){
        this.checkInternet(this.getShiftsAPICall);
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
        console.log("shiftID1: ", shiftID);
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", true);
        if(this.props.isConnected){
            const {ShiftDetails1011_Api_Call} = this.props;
            ShiftDetails1011_Api_Call(
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
            console.log('Response: ' + JSON.stringify(response.length))
            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedShiftAppliedEmployees", response);
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
    }

    confirmOrDenyAPICall(id, text){
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", true);
        const {ShiftDetails1012_Api_Call} = this.props;
            ShiftDetails1012_Api_Call(
                {
                    ID: id,
                },
                {
                    status_clock_in: text
                },
                onSuccess = (response) => {
                    console.log('response: ' + JSON.stringify(response))
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
                    if(response){
                        this.getShiftsAPICall(this.props.selectedShiftItemID)
                    }
                },
                onError = (error) => {
                    //console.log('\n\n\nError-->>: ' + JSON.stringify(error))
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
                    let errors = ''
                    if(error.detail){
                        errors += error.detail + '\n'
                    }
                    if(errors.length > 0)
                        alert(errors);
                }
            );
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
                <View style={{flex: 1, width: '60%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#007AFF', fontSize: 17, textAlign: 'center'}}>{'In progress shifts'}</Text>
                </View>
                <View 
                    style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}>
                    {/* <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17}}>QR Code</Text> */}
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{flexDirection: 'row', width: '100%', backgroundColor: '#F8F8F8'}}>
                        {this.renderHeaderTabs()}
                    </View>
                    <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'center'}}>
                        {/* <Text style={[styles.textStyle,{color: '#000', marginTop:10}]}>{this.props.selectedShiftItem.company_name}</Text> */}
                        <Text style={[styles.textStyle,{color: '#000',marginTop: 10}]}>
                            {
                                this.props.selectedShiftItem.custom_starts_time +
                                ' - ' +
                                this.props.selectedShiftItem.custom_ends_time
                            }
                        </Text>
                        <Text style={[styles.textStyle,{color: '#000', fontSize: 15}]}>
                            {this.props.selectedShiftItem.position.title_en}
                        </Text>
                        <Text style={[styles.textStyle,{color: '#000', marginTop:10}]}>{ this.props.selectedShiftAppliedEmployees.length +'/' + this.props.selectedShiftItem.of_staff + ' Heroes'}</Text>
                    </View>
                    <View style={{flexDirection: 'row', width: '100%', margin: 10, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: '40%', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#000', fontSize: 16}}>{'Clock in code'}</Text>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#000', fontSize: 20}}>{this.props.selectedShiftItem.clock_in_code}</Text>
                        </View>
                        <View style={{width: '40%', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#000', fontSize: 16}}>{'Clock out code'}</Text>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#000', fontSize: 20}}>{this.props.selectedShiftItem.clock_out_code}</Text>
                        </View>
                        {/* <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: 15, height: 15}}/> */}
                    </View>
                    <View style={{alignSelf: 'center', backgroundColor: '#dddddd', height: 1, width: '90%', marginTop: 10,}}></View>
                    <View style={{flex:1, alignItems: 'center', marginBottom:70}}>
                        <FlatList
                            data={this.props.selectedShiftAppliedEmployees}
                            keyExtractor={item => item.id}
                            extraData={this.props}
                            showsVerticalScrollIndicator={false}
                            numColumns={1}
                            contentContainerStyle={{alignItems: 'center', width: '100%'}}
                            removeClippedSubviews={false}
                            renderItem={({item, index}) => {
                                return (
                                    <View style={[styles.listItem, {borderTopWidth: index == 0 ? 0 : 1}]}>
                                        <View style={{width: '15%', height: 50, alignItems: 'flex-start'}}>
                                        <AvatarComponent
                                            size={"small"}
                                            defaultSource={require('../../assets/icons/rec.png')}
                                            source={item.avatar}
                                            style={{resizeMode: item.company_logo ? 'cover' : 'contain', width: '100%', height: '100%', backgroundColor: "#ccc"}}
                                        />
                                        </View>
                                        <View style={{width: '35%', paddingLeft:10, justifyContent: 'space-around'}}>
                                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#000', fontSize: 14}}>{item.first_name + ' ' + item.last_name}</Text>
                                            <Text style={{fontFamily: 'HelveticaNeue-Medium', fontSize: 14}}>
                                                <Text style={{color: '#9A9A9A',}}>{'Rating: '}</Text>
                                                <Text style={{color: '#000'}}>{parseFloat(item.rating).toFixed(1) + ' '}</Text>
                                                <Image source={require('../../assets/icons/favorite_active.png')} style={{resizeMode: 'contain', width: 13, height: 13}}/>
                                            </Text>
                                        </View>
                                        <View style={{width: '50%', alignItems: 'flex-end', justifyContent: 'space-around'}}>
                                            <Text style={{width: '100%', textAlign: 'center', fontFamily: 'HelveticaNeue-Medium', color: '#9A9A9A', fontSize: 16}}>
                                                {
                                                    item.is_clocked_in ?
                                                        item.is_clocked_out ?
                                                            'Clocked Out - ' + item.custom_clockout_time
                                                            :
                                                            'Clocked in - ' + item.custom_clockin_time
                                                        :
                                                        'Starting @ ' + this.props.selectedShiftItem.custom_starts_time
                                                }
                                            </Text>
                                            {(item.status_clock_in === 'Apply' && item.is_clocked_in)  ?
                                                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                                                    <TouchableOpacity style={{marginRight:10}}
                                                        onPress={()=>{
                                                            this.confirmOrDenyAPICall(item.id, "Confirm")
                                                        }}>
                                                        <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#4CCF31', fontSize: 14}}>{'Confirm'}</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{marginLeft:10}}
                                                        onPress={()=>{
                                                            this.confirmOrDenyAPICall(item.id, "Deny")
                                                        }}>
                                                        <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#DE5048', fontSize: 14}}>{'Deny'}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            :
                                            item.status_clock_in === "Confirm" &&
                                                (
                                                item.is_clocked_out ?
                                                    <TouchableOpacity
                                                        style={{width: '100%', alignItems: 'center'}}
                                                        onPress={()=>{
                                                            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedShiftAppliedEmployee", item);
                                                            this.props.screenIDHandler(108)
                                                        }}>
                                                        <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#000', fontSize: 14}}>{'Rate Hero'}</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                                                        <TouchableOpacity style={{marginRight:5}}
                                                            onPress={()=>{
                                                                if(item.extension_status === 'None'){
                                                                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedShiftAppliedEmployee", item);
                                                                    this.props.screenIDHandler(109)
                                                                }
                                                            }}>
                                                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#000', fontSize: 14}}>{'Extend shift'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{marginLeft:5}}
                                                            onPress={()=>{
                                                                Alert.alert(
                                                                    'Are you sure?',
                                                                    'You want to clock out',
                                                                    [
                                                                        {text: 'No', onPress: () => {}, style: 'cancel',},
                                                                        {text: 'Yes',
                                                                            onPress: () => {
                                                                                
                                                                            }
                                                                        },
                                                                    ],
                                                                    {cancelable: true},
                                                                );
                                                            }}>
                                                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#DE5048', fontSize: 14}}>{'Clock Out'}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                        </View>
                                    </View>
                                )
                            }}/>
                    </View>
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
        fontFamily: 'HelveticaNeue-Medium',
        color: '#007AFF',
        fontSize: 16,
        lineHeight: 25
    },
    listItem:{
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
    }
});

const mapStateToProps = ({ShiftFeed080State}) => {
    const {
        loading, selectedShiftItemID, selectedShiftItem, selectedShiftAppliedEmployees,
        selectedShiftAppliedEmployee, isConnected
    } = ShiftFeed080State;
    return {
        loading, selectedShiftItemID, selectedShiftItem, selectedShiftAppliedEmployees,
        selectedShiftAppliedEmployee, isConnected
    };
};

export default connect(mapStateToProps, {ShiftDetails1011_Api_Call, ShiftDetails1012_Api_Call, propChanged, propsClear})(ShiftDetails101);
