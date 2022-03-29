import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Linking
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { SHIFTFEED080_PROP_CHANGED, SHIFTFEED080_PROP_CLEAR, ShiftDetails1081_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
const checkedIcon = require('../../assets/icons/favorite_active.png');
const uncheckIcon = require('../../assets/icons/favorite_inactive.png')
const {height, width} = Dimensions.get('window');

class ShiftDetails108 extends Component {

    componentDidMount(){
        console.log('Employee: ' + JSON.stringify(this.props.selectedShiftAppliedEmployee))
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

    renderStarts(){
        return this.props.startlist.map((item, index)=> {
            return (
                <TouchableOpacity onPress={() => {
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedStarIndex", item.id);
                }}>
                    <Image source={this.favoriteIcon(item.id)} style={{resizeMode: 'contain', width: 30, height: 30}}/>
                </TouchableOpacity>
            )
        })
    }

    favoriteIcon(id){
        if(id <= this.props.selectedStarIndex){
            return checkedIcon
        }
        else return uncheckIcon
    }

    renderHeaderTabs(){
        return (
            <View style={styles.tabHeaderButton}>
                <TouchableOpacity 
                    style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}
                    onPress={()=>{
                        this.props.screenIDHandler(101)
                    }}>
                    <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17}}>Back</Text>
                </TouchableOpacity>
                <View style={{flex: 1, width: '60%',alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, textAlign: 'center'}}>{'Rate Hero'}</Text>
                </View>
                <View style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}>
                </View>
            </View>
        )
    }

    onRateWorkerButtonPress(){
        if (this.props.selectedStarIndex == 0)
            alert('Please select your rating')
        else {
            if(this.props.isConnected){
                this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", true);
                var details = {
                    user: this.props.selectedShiftAppliedEmployee.user,
                    shift: this.props.selectedShiftItemID,
                    stars: this.props.selectedStarIndex
                };
                var formBody = [];
                for (var property in details) {
                    var encodedKey = encodeURIComponent(property);
                    var encodedValue = encodeURIComponent(details[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");
                const {ShiftDetails1081_Api_Call} = this.props;
                ShiftDetails1081_Api_Call(
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
        if (error.detail){
            errors += error.detail + '\n'
        }
        if (error.non_field_errors){
            this.props.screenIDHandler(101)
            // errors += error.non_field_errors + '\n';
        } else {
            if(errors.length > 0)
                alert(errors);
            else alert(error);
        }
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
                        style={{flex:1, width:width}}>
                        <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <View style={{flex:1, width: '80%', backgroundColor: '#fff', marginTop: 20, alignItems: 'center'}}>
                                <Text style={[styles.textStyle,{textAlign: 'center', marginTop: 30}]}>
                                    {
                                        'It is very important to rate the workers ' +
                                        'that worked on your shift, so that they ' +
                                        'will have a feedback.'
                                    }
                                </Text>
                                <Text style={[styles.textStyle,{marginTop: 30, fontSize: 18}]}>{'Please rate the following hero:'}</Text>
                                <Text style={[styles.textStyle,{marginTop: 30, fontSize: 20}]}>
                                    {
                                        this.props.selectedShiftAppliedEmployee.first_name + ' ' +
                                        this.props.selectedShiftAppliedEmployee.last_name}
                                </Text>
                                <View style={{width: '70%', marginTop: 20, justifyContent: 'space-around', flexDirection: 'row'}}>
                                    {this.renderStarts()}
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={()=>{
                                    var urlScheme = `mailto:report@hireapp.me?subject=${this.props.selectedShiftItemID}&body=`
                                    Linking.canOpenURL(urlScheme).then(supported => {
                                        if(supported){
                                            Linking.openURL(urlScheme)
                                        }else{
                                            alert('Email client not installed!')
                                        }
                                    })
                                }}>
                                <Text style={[styles.textStyle,{marginTop: 30, fontSize: 12}]}>{'Report a problem with this hero'}</Text>
                            </TouchableOpacity>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity style={styles.navigationButton}
                                                  onPress={()=>{this.onRateWorkerButtonPress()}}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Rate Hero</Text>
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
        fontSize: 16,
        lineHeight: 25
    },
    navigationButtonsContainer:{
        width: '70%',
        marginTop: 20,
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
        margin: 20
    },
});

const mapStateToProps = ({ShiftFeed080State}) => {
    const {
        loading, selectedShiftItemID, selectedShiftItem, selectedShiftAppliedEmployees,
        selectedShiftAppliedEmployee, shiftExtensionLimit, selectedStarIndex, startlist, isConnected
    } = ShiftFeed080State;
    return {
        loading, selectedShiftItemID, selectedShiftItem, selectedShiftAppliedEmployees,
        selectedShiftAppliedEmployee, shiftExtensionLimit, selectedStarIndex, startlist, isConnected
    };
};

export default connect(mapStateToProps, {ShiftDetails1081_Api_Call, propChanged, propsClear})(ShiftDetails108);
