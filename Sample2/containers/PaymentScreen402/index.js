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
    Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { REGISTRATION057_PROP_CHANGED, REGISTRATION057_PROP_CLEAR, Registration0571_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
import stripe from 'tipsi-stripe';
const {height, width} = Dimensions.get('window');

class PaymentScreen402 extends Component {
    
    componentDidMount(){
        this.checkInternet(this.settingStripe);
    }

    componentWillUnmount(){
        this.props.propsClear(REGISTRATION057_PROP_CLEAR)
    }

    checkInternet(callback = null) {    
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(REGISTRATION057_PROP_CHANGED, "isConnected", state.isConnected);             
            if(callback && typeof callback == 'function'){
                setTimeout(()=>{
                    callback()
                },500)
            }
        });
        subscribe();
    }

    settingStripe(){
        stripe.setOptions({
            publishableKey: 'pk_test_q8iRYrgjsC4BSV6OQ4RxIZq600jt5h5xzF',
            //merchantId: 'MERCHANT_ID', // Optional
            androidPayMode: 'test', // Android only
        })
        
    }

    onSaveButtonPress = async (shouldPass = true) =>{
       if (!this.checkFields()) {
            return false;
        } else if (Preference.get(mystorage.CARD_LIMIT) < 5){
            const params = {
                number: this.props.creditCardNumber.split(' ').join(''),
                expMonth: parseInt(this.props.expiryDate.substring(0, 2)),
                expYear: parseInt(this.props.expiryDate.substring(3, 5)),
                cvc: this.props.CVVOrCVC,
                name: this.props.nameOnCard,
            }
            try {
                this.props.propChanged(REGISTRATION057_PROP_CHANGED, "loading", true);
                const token = await stripe.createTokenWithCard(params);
                console.log("StripeToken:", "--"+JSON.stringify(token));
                if(token){
                    console.log("\n\nStripeTokenID:", token.tokenId);
                    const {Registration0571_Api_Call} = this.props;
                    Registration0571_Api_Call(
                        { 
                            token: token.tokenId,
                        },
                        this.onSuccess,
                        this.onError
                    );
                }
            } catch (error) {
                this.props.propChanged(REGISTRATION057_PROP_CHANGED, "loading", false);
                alert(error.message)
            }
        } else { alert("Your card limit exceed") }
        Keyboard.dismiss();
    }

    onSuccess = (response)=> {
        this.props.propChanged(REGISTRATION057_PROP_CHANGED, "loading", false)
        console.log('\n\nCard Success: ' + JSON.stringify(response.data));
        if(response.data){
            let data = [];
            if(Preference.get(mystorage.CARD_LIMIT) >= 1) {
                data = Preference.get(mystorage.CARD_OBJECT)
                Preference.set(mystorage.CARD_LIMIT, Preference.get(mystorage.CARD_LIMIT) + 1)
            } else {
                Preference.set(mystorage.CARD_LIMIT, 1)
            }
            data.push(response.data);
            Preference.set(mystorage.CARD_PRIMARY, 0)
            Preference.set(mystorage.CARD_OBJECT, data);
            this.props.screenIDHandler(401)
        }
    }
    onError = (error) => {
        console.log('\n\nCard error: ' + JSON.stringify(error.error_message));
        this.props.propChanged(REGISTRATION057_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        } else if(error.error_message){
            errors += error.error_message + '\n'
        } else if(error.error){
            errors += error.error + '\n'
        } else {
            errors += JSON.stringify(error) + '\n'
        }
        if(errors.length > 0)
            alert(errors)
    }

    checkFields() {
        let cardNumberReg = /^[0-9]{4}\ [0-9]{4}\ [0-9]{4}\ [0-9]{1,4}$/
        let expiryDateReg = /^(((0)[0-9])|((1)[0-2]))(\/)\d{2}$/
        let cvvReg = /^[0-9]{3,4}$/
        let cardNameReg = /^[a-zA-Z ]+$/;
        if (this.props.creditCardNumber === "") {
            alert("Cradit card number field is required");
            return false;
        } else if (cardNumberReg.test(this.props.creditCardNumber) === false) {
            alert("Invalid Card Number Format");
            return false;
        } else if (this.props.expiryDate === "") {
            alert("Expiry date field is required");
            return false;
        } else if (expiryDateReg.test(this.props.expiryDate) === false) {
            alert("Invalid Date Format");
            return false;
        } else if (this.props.CVVOrCVC === "") {
            alert("CVV / CVC field is required");
            return false;
        } else if (cvvReg.test(this.props.CVVOrCVC) === false) {
            alert("Invalid CVV / CVC Format");
            return false;
        } else if (this.props.nameOnCard === "") {
            alert("Name on card field is required");
            return false;
        } else if (cardNameReg.test(this.props.nameOnCard) === false) {
            alert("Invalid Name Format");
            return false;
        } else
            return true;
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 55, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 30, backgroundColor: '#F8F8F8'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                onPress={()=>{
                                    this.props.screenIDHandler(401)
                                }}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Roman', color: '#007AFF', fontSize: 17}}>Add new card</Text>
                        </View>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                                          onPress={()=>{this.onSaveButtonPress()}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginEnd: 5}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView
                        innerRef={ref => {this.scroll = ref}}
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow:1}}
                        style={{flex:1, width:width}}>
                        <View style={{flexGrow:1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{justifyContent:"center", alignItems: 'center', width:"80%"}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 24, marginBottom: 40}}>
                                    {'Add the credit card with\nwhich you would prefer\nto pay the HireApp\nHeroes you hire'}
                                </Text>
                                <View style={styles.forminputContainer}>
                                    <TextInput
                                        style={styles.inputText}
                                        value={this.props.creditCardNumber}
                                        keyboardType={'number-pad'}
                                        onChangeText={(text) => {
                                            if (this.props.creditCardNumber.length < text.length && (text.length == 4 || text.length == 9 || text.length == 14)) {
                                                text += ' '
                                            }
                                            this.props.propChanged(REGISTRATION057_PROP_CHANGED, "creditCardNumber", text);
                                        }}
                                        maxLength={19}
                                        placeholder={'Credit card number'}
                                        placeholderTextColor={'#9A9A9A'}
                                        scrollEnabled={false}/>
                                </View>
                                <View style={[styles.forminputContainer,{marginTop:0,borderBottomWidth: 0, justifyContent: 'space-between'}]}>
                                    <View style={[styles.forminputContainer,{width: '47%'}]}>
                                        <TextInput
                                            style={styles.inputText}
                                            value={this.props.expiryDate}
                                            keyboardType={'number-pad'}
                                            onChangeText={(text) => {
                                                if (this.props.expiryDate.length < text.length && text.length == 2) {
                                                    text += '/';
                                                }
                                                this.props.propChanged(REGISTRATION057_PROP_CHANGED, "expiryDate", text);
                                            }}
                                            maxLength={5}
                                            placeholder={'MM/YY'}
                                            placeholderTextColor={'#9A9A9A'}
                                            scrollEnabled={false}/>
                                    </View>
                                    <View style={[styles.forminputContainer,{width: '47%'}]}>
                                        <TextInput
                                            style={styles.inputText}
                                            value={this.props.CVVOrCVC}
                                            keyboardType={'number-pad'}
                                            onChangeText={(text) => {
                                                this.props.propChanged(REGISTRATION057_PROP_CHANGED, "CVVOrCVC", text);
                                            }}
                                            maxLength={4}
                                            placeholder={'CVV / CVC'}
                                            placeholderTextColor={'#9A9A9A'}
                                            scrollEnabled={false}/>
                                    </View>
                                </View>
                                <View style={styles.forminputContainer}>
                                    <TextInput
                                        style={styles.inputText}
                                        value={this.props.nameOnCard}
                                        autoCapitalize={'characters'}
                                        onChangeText={(text) => {
                                            this.props.propChanged(REGISTRATION057_PROP_CHANGED, "nameOnCard", text);
                                        }}
                                        placeholder={'Name on card'}
                                        placeholderTextColor={'#9A9A9A'}
                                        scrollEnabled={false}/>
                                </View>
                            </View>
                            <Text style={{fontFamily: 'HelveticaNeue-Roman', color: '#7d7d7d', textAlign: 'center', fontSize: 14, marginTop: 40}}>
                                {/* {'*Currently we don\'t support American\nExpress cards. Visa and Master are fully\nsupported'} */}
                            </Text>
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity style={styles.navigationButton}
                                                    onPress={()=>{this.onSaveButtonPress()}}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Save</Text>
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

const mapStateToProps = ({Registration057State}) => {
    const {loading, creditCardNumber, expiryDate, CVVOrCVC, nameOnCard, isConnected} = Registration057State;
    return {loading, creditCardNumber, expiryDate, CVVOrCVC, nameOnCard, isConnected};
};

export default connect(mapStateToProps, {Registration0571_Api_Call, propChanged, propsClear})(PaymentScreen402)