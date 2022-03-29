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
    Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { REGISTRATION053_PROP_CHANGED, REGISTRATION053_PROP_CLEAR, Registration0531_Api_Call, Registration0532_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import _ from 'lodash';
const {height, width} = Dimensions.get('window');
const uncheckIcon = require('../../assets/icons/rounded_uncheck.png')
const checkedIcon = require('../../assets/icons/rounded_check.png');

class Registration053 extends Component {

    googlePlacesText = ''

    componentDidMount(){
        this.checkInternet();
    }

    componentWillUnmount(){
        this.props.propsClear(REGISTRATION053_PROP_CLEAR)
    }

    checkInternet() {    
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(REGISTRATION053_PROP_CHANGED, "isConnected", state.isConnected);            
        });
        subscribe();
    }

    renderGooglePlacesInput = () => {
        return (
            <GooglePlacesAutocomplete
                ref={ref => this.googlePlacesAutocomplete = ref}
                placeholder='Address'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                // value={this.props.address}
                text={this.props.address}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed='true'    // true/false/undefined
                fetchDetails={true}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    // console.log('testingDetails-->: ', typeof details.geometry.location.lat, JSON.stringify(details.geometry.location.lat))
                    // console.log('\n\n\n\n\n\n\n\n\n\n\n\nDetails: ' + JSON.stringify(details))
                    let postalItem = details.address_components.find((item) =>{
                        if(Array.isArray(item.types)){
                            if(item.types.length > 0){
                                if(item.types[0] === 'postal_code'){
                                    return true
                                }
                            }
                        } 
                        return false
                    })
                    let addressDetailsArray = details.formatted_address.split(',')
                    let state = addressDetailsArray[addressDetailsArray.length == 4 ? 2 : 1].trim().split(' ')
                    this.props.propChanged(REGISTRATION053_PROP_CHANGED, "address", data.structured_formatting.main_text);
                    this.googlePlacesText = data.structured_formatting.main_text;
                    this.props.propChanged(REGISTRATION053_PROP_CHANGED, "city", addressDetailsArray.length == 4 ? addressDetailsArray[1].trim() : data.structured_formatting.main_text.trim());
                    this.props.propChanged(REGISTRATION053_PROP_CHANGED, "zip", _.isNil(postalItem) ? '' : postalItem.long_name);
                    this.props.propChanged(REGISTRATION053_PROP_CHANGED, "state", state[0]);
                }}

                textInputProps={{
                    onChangeText: (text) => { 
                        if(this.googlePlacesAutocomplete){
                            if(typeof this.googlePlacesAutocomplete._onChangeText == 'function'){
                                this.googlePlacesAutocomplete._onChangeText(text)
                                this.googlePlacesText = text
                            }
                        }
                    }
                }}
                
                getDefaultValue={() => this.props.address}

                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: Platform.OS === "ios" ? 'AIzaSyBnQo-ym58Cpal3ri1A1iZTZEriZbK5sdA': 'AIzaSyDD4wosTgxAGxjTKfG1kN_QJTqStTudWG8',
                    language: 'en', // language of the results 
                    types: ['cities','geocode', 'addresses'] // default: 'geocode'
                }}

                styles={{
                    container: Platform.OS == 'ios' ? { alignItems: 'center', zIndex: 9999} : { alignItems: 'center'},
                    listView: {
                        marginTop: 50,
                        elevation: 5,
                        backgroundColor: '#000',
                        position: 'absolute',
                        width: '100%',
                        zIndex:9999
                    },
                    row:{
                        height: 45,
                        backgroundColor: '#fff',
                        zIndex:99999
                    },
                    textInputContainer: {
                        backgroundColor: '#fff',
                        borderBottomColor: '#4d4d4d',
                        borderBottomWidth: 1,
                        borderTopWidth: 0,
                        width: '100%',
                    },
                    textInput: [styles.inputText,{
                        marginLeft: 0,
                        paddingLeft: Platform.OS == 'android' ? 5 : 0,
                        height:30,
                        paddingBottom:0,
                    }],
                    description: {
                        fontWeight: 'bold',
                    },
                    predefinedPlacesDescription: {
                        color: '#007AFF'
                    }
                }}

                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}
                GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    type: 'address'
                }}

                GooglePlacesDetailsQuery={{
                    // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                    fields: ["name", 'formatted_address', 'geometry']
                }}

                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                // renderLeftButton = {() => <Text>Custom text after the input</Text>}
                // renderRightButton={() => <Text>Custom text after the input</Text>}
            />
        );
    };

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

    onNextButtonPress(){
        if (!this.checkFields()) {
            return false;
        } else {
            this.props.propChanged(REGISTRATION053_PROP_CHANGED, "loading", true);
            if(this.props.isConnected){
                var details = {
                    name: this.props.businessName,
                    address: this.googlePlacesText,
                    city: this.props.city,
                    zip_code: this.props.zip,
                    state: this.props.state,
                    registered_in_us: true,
                };

                // if(this.props.address.length > 0){
                //     details.address = this.props.address
                // }else{
                //     details.address = this.googlePlacesText
                // }

                var formBody = [];
                for (var property in details) {
                    var encodedKey = encodeURIComponent(property);
                    var encodedValue = encodeURIComponent(details[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");
                const {Registration0531_Api_Call} = this.props;
                Registration0531_Api_Call(
                    formBody,
                    this.onSuccess,
                    this.onError
                );
            } else {alert('Please check your internet')}
        }
    }

    onSuccess = (response) => {
        let data_object = Preference.get(mystorage.DATA_OBJECT);
        data_object.company = response
        Preference.set(mystorage.DATA_OBJECT, data_object);
        if (response.id) {
            var details = {
                first_name: this.props.firstName,
                last_name: this.props.lastName,
                phone: this.props.phoneNumber,
                contact_info_screen: true,
                business_info_screen: true,
                type_business_screen: true
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            const {Registration0532_Api_Call} = this.props;
            Registration0532_Api_Call(
                formBody,
                onSuccess = (response2)=> {
                    this.props.propChanged(REGISTRATION053_PROP_CHANGED, "loading", false)
                    if(response2.id){
                        let data_object = Preference.get(mystorage.DATA_OBJECT);
                        data_object.profile = response2
                        Preference.set(mystorage.DATA_OBJECT, data_object);
                        this.props.navigation.navigate('Registration054')
                    }
                },
                onError = (error) => {
                    this.props.propChanged(REGISTRATION053_PROP_CHANGED, "loading", false);
                    let errors = ''
                    if(error.detail){
                        errors += error.detail + '\n'
                    } else {
                        errors += error + '\n'
                    }
                    if(errors.length > 0)
                        alert(errors)
                }
            );
        }
    }
    onError = (error) => {
        this.props.propChanged(REGISTRATION053_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.details){
            errors += error.details + '\n'
        }
        if(errors.length > 0)
            alert(errors);
        else alert(error);
    }

    checkFields() {
        if (this.props.firstName === "") {
            alert("First Name field is required");
            return false;
        } else if (!(/^[a-zA-Z ]+$/).test(this.props.firstName)) {
            alert("Invalid First Name Format");
            return false;
        } else if (this.props.lastName === "") {
            alert("Last Name field is required");
            return false;
        } else if (!(/^[a-zA-Z ]+$/).test(this.props.lastName)) {
            alert("Invalid Last Name Format");
            return false;
        } else if (this.props.phoneNumber === "") {
            alert("Phone number field is required");
            return false;
        } else if (!(/^\+[0-9]{1}\ \([0-9]{3}\)\ [0-9]{3}-[0-9]{4}$/).test(this.props.phoneNumber)) {
            alert("Invalid Phone Number Format");
            return false;
        } else if (this.props.businessName === "") {
            alert("Business Name field is required");
            return false;
        } else if (this.googlePlacesText === "") {
            alert("Address field is required");
            return false;
        } else if (this.props.city === "") {
            alert("City field is required");
            return false;
        } else if (!(/^[a-zA-Z ]+$/).test(this.props.city)) {
            alert("Invalid City Format");
            return false;
        } else if (this.props.zip === "") {
            alert("Zip field is required");
            return false;
        // } else if (!(/^[0-9]{5}$/).test(this.props.zip)) {
        //     alert("Invalid Zip Format");
        //     return false;
        } else if (this.props.state === "") {
            alert("State field is required");
            return false;
        } else
            return true;
    }

    renderContactInfo() {
        return (
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: 'black', fontSize: 24, marginTop: 2, fontWeight: '600', textAlign: 'center',}}>
                    Your contact info?
                </Text>
                <View style={{width: '80%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.forminputContainer}>
                    <TextInput
                        style={styles.inputText}
                        value={this.props.firstName}
                        onChangeText={(text) => {
                            this.props.propChanged(REGISTRATION053_PROP_CHANGED, "firstName", text);
                        }}
                        placeholder={'First Name'}
                        placeholderTextColor={'#9A9A9A'}
                        scrollEnabled={false}/>
                </View>
                <View style={styles.forminputContainer}>
                    <TextInput
                        style={styles.inputText}
                        value={this.props.lastName}
                        onChangeText={(text) => {
                            this.props.propChanged(REGISTRATION053_PROP_CHANGED, "lastName", text);
                        }}
                        placeholder={'Last Name'}
                        placeholderTextColor={'#9A9A9A'}
                        scrollEnabled={false}/>
                </View>
                <View style={styles.forminputContainer}>
                    <TextInput
                        style={styles.inputText}
                        value={this.props.phoneNumber}
                        keyboardType={'phone-pad'}
                        onFocus={(text)=>{
                            if(this.props.phoneNumber.length == 0)
                                this.props.propChanged(REGISTRATION053_PROP_CHANGED, "phoneNumber", '+1 (');
                        }}
                        onChangeText={(text) => {
                            if(text.length >= 4) {
                                if (this.props.phoneNumber.length < text.length && text.length == 7)
                                    text += ') '
                                else if (this.props.phoneNumber.length < text.length &&text.length == 12)
                                    text += '-'
                                this.props.propChanged(REGISTRATION053_PROP_CHANGED, "phoneNumber", text);
                            }
                        }}
                        placeholder={'Phone number'}
                        maxLength={17}
                        placeholderTextColor={'#9A9A9A'}
                        scrollEnabled={false}/>
                    </View>
                </View>
            </View>
        )
    }

    renderBusincessInfo() {
        return (
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: 'black', fontSize: 24, fontWeight: '600', textAlign: 'center', marginTop: 30}}>
                    Your business info?
                </Text>
                <View style={{width: '80%', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.forminputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={this.props.businessName}
                            onChangeText={(text) => {
                                this.props.propChanged(REGISTRATION053_PROP_CHANGED, "businessName", text);
                            }}
                            placeholder={'Business name'}
                            placeholderTextColor={'#9A9A9A'}
                            scrollEnabled={false}/>
                    </View>
                    <View style={styles.forminputContainer}>
                        {this.renderGooglePlacesInput()}
                    </View>
                    <View style={[styles.forminputContainer,{zIndex: -1}]}>
                        <TextInput
                            style={styles.inputText}
                            value={this.props.city}
                            onChangeText={(text) => {
                                this.props.propChanged(REGISTRATION053_PROP_CHANGED, "city", text);
                            }}
                            placeholder={'City'}
                            placeholderTextColor={'#9A9A9A'}
                            scrollEnabled={false}/>
                    </View>
                    <View style={[styles.forminputContainer,{borderBottomWidth: 0, justifyContent: 'space-between',zIndex: -1}]}>
                    <View style={[styles.forminputContainer, {width: '47%'}]}>
                        <TextInput
                            style={styles.inputText}
                            value={this.props.zip}
                            keyboardType={'number-pad'}
                            onChangeText={(text) => {
                                this.props.propChanged(REGISTRATION053_PROP_CHANGED, "zip", text);
                            }}
                            placeholder={'Zip'}
                            maxLength={5}
                            placeholderTextColor={'#9A9A9A'}
                            scrollEnabled={false}/>
                    </View>
                        <View style={[styles.forminputContainer, {width: '47%'}]}>
                            <TextInput
                                style={styles.inputText}
                                value={this.props.state}
                                onChangeText={(text) => {
                                    this.props.propChanged(REGISTRATION053_PROP_CHANGED, "state", text);
                                }}
                                placeholder={'State'}
                                placeholderTextColor={'#9A9A9A'}
                                scrollEnabled={false}/>
                        </View>
                    </View>
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


    renderFooterText() {
        return (
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, zIndex: -1}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>{
                        this.props.propChanged(REGISTRATION053_PROP_CHANGED, "checked", !this.props.checked);
                    }}>
                        <Image source={this.renderCheckOrUncheckIcon()} style={{height: 25, width: 25}} resizeMode={'contain'}/>
                    </TouchableOpacity>
                    <Text style={{color: '#7d7d7d', fontSize: 18, marginLeft: 20, textAlign: 'center'}}>My business is{`\n`}registered in the US</Text>
                </View>
            </View>
        )
    }


    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 20}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.props.navigation.goBack()}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            {this.renderDots()}
                        </View>
                        <TouchableOpacity 
                            style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
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
                        style={{flex:1, width:width}}>
                        <View style={{flexGrow:1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            {this.renderContactInfo()}
                            {this.renderBusincessInfo()}
                            {this.renderFooterText()}
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.navigationButton}
                                    onPress={()=>{this.onNextButtonPress()}}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Next</Text>
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
        marginTop: 20,
        marginBottom: 70,
        zIndex: -1
    },
    navigationButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 10,
        height: 55,
        width: '100%',
    },
    forminputContainer: {
        height: 40,
        borderBottomColor: '#4d4d4d',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 7,
        width: "100%",
    },
    inputText:{
        fontSize: 17,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
        height:40,
        width: "100%",
        paddingBottom:2,
    },
});

const mapStateToProps = ({Registration053State}) => {
    const {loading, firstName, lastName, phoneNumber, businessName, address, customAddress, city, zip, state, checked, isConnected} = Registration053State;
    return {loading, firstName, lastName, phoneNumber, businessName, address, customAddress, city, zip, state, checked, isConnected};
};

export default connect(mapStateToProps, {Registration0531_Api_Call, Registration0532_Api_Call, propChanged, propsClear})(Registration053)