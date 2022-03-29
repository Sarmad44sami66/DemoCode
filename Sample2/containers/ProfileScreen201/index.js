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
    Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { RPOFILESCREEN200_PROP_CHANGED, RPOFILESCREEN200_PROP_CLEAR, Registration0531_Api_Call, Registration0532_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AvatarComponent from '../../components/AvatarComponent';
import _ from 'lodash';
const {height, width} = Dimensions.get('window');

class ProfileScreen201 extends Component {

    googlePlacesText = this.props.address;

    componentDidMount(){
        this.checkInternet();
    }

    checkInternet() {    
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "isConnected", state.isConnected);
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
                    console.log('testing-->: ' + JSON.stringify(details))
                    // console.log('testingDetails-->: ', typeof details.geometry.location.lat, JSON.stringify(details.geometry.location.lat))
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
                    let state = (addressDetailsArray[addressDetailsArray.length == 4 ? 2 : 1]).trim().split(' ')
                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "address", data.structured_formatting.main_text);
                    this.googlePlacesText = data.structured_formatting.main_text;
                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "city", addressDetailsArray.length == 4 ? addressDetailsArray[1].trim() : data.structured_formatting.main_text.trim());
                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "zip", _.isNil(postalItem) ? '' : postalItem.long_name);
                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "state", state[0]);
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

    onSaveButtonPress(){
        if (!this.checkFields()) {
            return false;
        } else {
            console.log('\n\n\nAPI----->>>>>')
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "loading", true);
            if(this.props.isConnected){
                var details = {
                    name: this.props.businessName,
                    address: this.props.address,
                    city: this.props.city,
                    zip_code: this.props.zip,
                    state: this.props.state,
                    registered_in_us: true,
                };
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
        console.log('\n\n\n\nTest: ' + JSON.stringify(response))
        if (response.id) {
            var details = {
                first_name: this.props.firstName,
                last_name: this.props.lastName,
                phone: this.props.phoneNumber,
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
                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "loading", false)
                    console.log('\n\nid: ' + JSON.stringify(response2.id));
                    if(response2.id){
                        this.props.screenIDHandler(200)
                    }
                },
                onError = (error) => {
                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "loading", false);
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
        this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "loading", false);
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

    renderForm() {
        return (
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: '80%', justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.forminputContainer}>
                    <TextInput
                        style={styles.inputText}
                        value={this.props.firstName}
                        onChangeText={(text) => {
                            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "firstName", text);
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
                                this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "lastName", text);
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
                                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "phoneNumber", '+1 (');
                            }}
                            onChangeText={(text) => {
                                if(text.length >= 4) {
                                    if (this.props.phoneNumber.length < text.length && text.length == 7)
                                        text += ') '
                                    else if (this.props.phoneNumber.length < text.length &&text.length == 12)
                                        text += '-'
                                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "phoneNumber", text);
                                }
                            }}
                            placeholder={'Phone number'}
                            maxLength={17}
                            placeholderTextColor={'#9A9A9A'}
                            scrollEnabled={false}/>
                    </View>
                    <View style={styles.forminputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={this.props.businessName}
                            onChangeText={(text) => {
                                this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "businessName", text);
                            }}
                            placeholder={'Business name'}
                            placeholderTextColor={'#9A9A9A'}
                            scrollEnabled={false}/>
                    </View>
                    {this.renderGooglePlacesInput()}
                    {/* <View style={styles.forminputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={this.props.address}
                            onChangeText={(text) => {
                                this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "address", text);
                            }}
                            placeholder={'Address'}
                            placeholderTextColor={'#9A9A9A'}
                            scrollEnabled={false}/>
                    </View> */}
                    <View style={styles.forminputContainer}>
                        <TextInput
                            style={styles.inputText}
                            value={this.props.city}
                            onChangeText={(text) => {
                                this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "city", text);
                            }}
                            placeholder={'City'}
                            placeholderTextColor={'#9A9A9A'}
                            scrollEnabled={false}/>
                    </View>
                    <View style={[styles.forminputContainer,{borderBottomWidth: 0, justifyContent: 'space-between'}]}>
                        <View style={[styles.forminputContainer, {width: '47%'}]}>
                            <TextInput
                                style={styles.inputText}
                                value={this.props.zip}
                                keyboardType={'number-pad'}
                                onChangeText={(text) => {
                                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "zip", text);
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
                                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "state", text);
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

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 55, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#F8F8F8'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.props.screenIDHandler(200)}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, textAlign: 'center'}}>{'Profile edit'}</Text>
                        </View>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                                          onPress={()=>{this.onSaveButtonPress()}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginEnd: 5}}>Save</Text>
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
                        <View style={{flexGrow:1, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop:10}}>
                            <View style={{width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                                <AvatarComponent
                                    size={"small"}
                                    defaultSource={require('../../assets/images/user_logo.png')}
                                    source={this.props.businessLogo}
                                    style={{resizeMode: 'cover', width: '100%', height: '100%',backgroundColor: '#eee'}}
                                />
                            </View>
                            <TouchableOpacity style={{marginTop: 10}} onPress={()=>{this.props.screenIDHandler(202)}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#007AFF', fontSize: 16, textAlign: 'center'}}>{'Change photo'}</Text>
                            </TouchableOpacity>
                            {this.renderForm()}
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.navigationButton}
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

const mapStateToProps = ({ProfileScreen200State}) => {
    const {loading, businessLogo, businessName, accountID, status, address, city, zip, state, firstName, lastName, phoneNumber, isConnected} = ProfileScreen200State;
    return {loading, businessLogo, businessName, accountID, status, address, city, zip, state, firstName, lastName, phoneNumber, isConnected};
};

export default connect(mapStateToProps, {Registration0531_Api_Call, Registration0532_Api_Call, propChanged, propsClear})(ProfileScreen201);