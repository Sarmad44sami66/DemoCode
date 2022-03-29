import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { connect } from 'react-redux'
import { PAYMENTSCREEN400_PROP_CHANGED, PAYMENTSCREEN400_PROP_CLEAR, PaymentScreen4001_Api_Call} from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const {height, width} = Dimensions.get('window');

class PaymentScreen400 extends Component {

    componentDidMount(){
        this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "selectedIndex", Preference.get(mystorage.CARD_PRIMARY));
        this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "radioOptions", Preference.get(mystorage.CARD_OBJECT));
        this.checkInternet(this.getPaymentsAPICall);
    }

    componentWillUnmount(){
        this.props.propsClear(PAYMENTSCREEN400_PROP_CLEAR)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const prevProps = this.props
        if(prevProps.focusCount < nextProps.focusCount)
            this.checkInternet(this.getPaymentsAPICall);
    }

    checkInternet(callback = null) {    
        const subscribe = NetInfo.addEventListener(state => {
            // console.log("subscribe Connection type", state.type);
            // console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "isConnected", state.isConnected);             
            if(callback && typeof callback == 'function'){
                setTimeout(()=>{
                    callback()
                },500)
            }
        });
        subscribe();
    }

    getPaymentsAPICall = () => {
        if(this.props.isConnected){
            this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "loading", true);
            const {PaymentScreen4001_Api_Call} = this.props;
            PaymentScreen4001_Api_Call(
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response)=> {
        if(response){
            this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "loading", false);
            console.log('Payments: ' + JSON.stringify(response))
            this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "payments", response);
        }
    }

    onError = (error) => {
        this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        }
        if(errors.length > 0)
            alert(errors)
    }

    renderHeaderTabs(){
        return (
            <View style={styles.tabHeaderButton}>
                <View style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                </View>
                <View style={{flex: 1, width: '60%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17}}>{'Payments'}</Text>
                </View>
                <View style={{width: '20%', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}>
                </View>
            </View>
        )
    }

    onPayoutSettingsButtonPress(){
        this.props.screenIDHandler(401)
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
                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={[styles.textContainer,{paddingTop: 20}]}>
                                <Text style={[styles.textStyle,{color: '#000'}]}>{'Last shift\'s payment:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{'$' + this.props.payments.last_shift_payments}</Text>
                            </View>
                            <View style={[styles.textContainer,{paddingTop: 20}]}>
                                <Text style={[styles.textStyle,{color: '#000'}]}>{'Pending payments:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{'$' + this.props.payments.pending_payments}</Text>
                            </View>
                            <View style={[styles.textContainer,{paddingTop: 20}]}>
                                <Text style={[styles.textStyle,{color: '#000'}]}>{'Successful payments:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{'$' + this.props.payments.successful_payments}</Text>
                            </View>
                            <View style={[styles.textContainer,{marginTop: 20,paddingBottom: 20,borderBottomWidth: 1}]}>
                                <Text style={[styles.textStyle,{color: '#000'}]}>{'Total payments:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{'$' + this.props.payments.total_payments}</Text>
                            </View>
                            <View style={[styles.textContainer,{paddingTop: 20}]}>
                                <Text style={[styles.textStyle,{color: '#000'}]}>{'Total shifts hired:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{this.props.payments.total_shifts_hired + ' Shifts'}</Text>
                            </View>
                            <View style={[styles.textContainer,{marginTop: 20,paddingBottom: 20,borderBottomWidth: 1}]}>
                                <Text style={[styles.textStyle,{color: '#000'}]}>{'Total hours hired:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{this.props.payments.total_hours_hired + ' Hours'}</Text>
                            </View>
                            {(this.props.radioOptions.length > 0) &&
                                <View style={{width: '80%', padding: 15, justifyContent: 'space-between'}}>
                                    <Text style={[styles.textStyle,{color: '#000',marginBottom:20}]}>{'Primary payment method:'}</Text>
                                    <Text style={[styles.textStyle,{}]}>
                                        {
                                            'Credit card - xxxx xxxx xxxx ' + 
                                            ((this.props.radioOptions.length > 0) ?  this.props.radioOptions[this.props.selectedIndex].last4 : '')
                                        }
                                    </Text>
                                </View>
                            }
                        </View>
                    </KeyboardAwareScrollView>
                    <View style={styles.navigationButtonsContainer}>
                        <TouchableOpacity 
                            style={styles.navigationButton}
                            onPress={()=>{this.onPayoutSettingsButtonPress()}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Payment settings</Text>
                        </TouchableOpacity>
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
        color: '#9A9A9A',
        fontSize: 16,
        lineHeight: 20
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
        width: '80%',
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: '#9A9A9A',
    }
});

const mapStateToProps = ({PaymentScreen400State}) => {
    const { loading, payments, radioOptions, selectedIndex, isConnected } = PaymentScreen400State;
    return { loading, payments, radioOptions, selectedIndex, isConnected };
};

export default connect(mapStateToProps, {PaymentScreen4001_Api_Call, propChanged, propsClear})(PaymentScreen400)