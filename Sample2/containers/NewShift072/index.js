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
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { connect } from 'react-redux';
import moment from 'moment';
import { NEWSHIFT072_PROP_CHANGED, NEWSHIFT073_PROP_CHANGED, NEWSHIFT073_PROPS_CHANGED } from '../../actions/Actions';
import { propChanged, propsChanged } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
import NetInfo from "@react-native-community/netinfo";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
const {height, width} = Dimensions.get('window');

class NewShift072 extends Component {

    renderGooglePlacesInput = (placeholder, stateKey, variable, zIndexPassed) => {
        return (
            <GooglePlacesAutocomplete
                placeholder={placeholder}
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed='true'    // true/false/undefined
                fetchDetails={true}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    console.log('data-->: ' + JSON.stringify(data))
                    console.log('details-->: ' + JSON.stringify(details))
                    // console.log('testingDetails-->: ', typeof details.geometry.location.lat, JSON.stringify(details.geometry.location.lat))
                    this.props.propChanged(NEWSHIFT072_PROP_CHANGED, stateKey, details.formatted_address);
                }}

                getDefaultValue={() => variable}

                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: Platform.OS === "ios" ? 'AIzaSyBnQo-ym58Cpal3ri1A1iZTZEriZbK5sdA': 'AIzaSyDD4wosTgxAGxjTKfG1kN_QJTqStTudWG8',
                    language: 'en', // language of the results
                    types: '(cities)' // default: 'geocode'
                }}

                styles={{
                    container: {
                        alignItems: 'center',
                        zIndex:zIndexPassed
                    },
                    listView: {
                        marginTop: 50,
                        elevation: 1,
                        backgroundColor: '#000',
                        position: 'absolute',
                        width: '100%',
                        zIndex:zIndexPassed
                    },
                    row:{
                        height: 45,
                        backgroundColor: '#fff',
                        zIndex:zIndexPassed
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
                        paddingLeft: 5,
                        height:30,
                        paddingBottom:2,
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
                    type: 'cafe'
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
                {imageActive}
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

    renderShiftInfoTabs(){
        return (
            <View style={{width: '100%', marginTop: 10, alignItems: 'center'}}>
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    {this.renderAdditionalItem(0)}
                    {this.renderAdditionalItem(1)}
                    {this.renderAdditionalItem(2)}
                </View>
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    {this.renderAdditionalItem(3)}
                    {this.renderAdditionalItem(4)}
                    {this.renderAdditionalItem(5)}
                </View>
            </View>
        )
    }

    renderAdditionalItem(index){
        return (
            <TouchableOpacity 
                style={[styles.tabButton,this.selectedUnselectedShiftInfoTabStyle(this.props.shiftInfoTabs[index].active)]}
                onPress={()=>{this.changeSelectedItemsState(index)}}>
                <Text style={[styles.tabButtonText,this.selectedUnselectedShiftInfoTabStyle(this.props.shiftInfoTabs[index].active)]}>{this.props.shiftInfoTabs[index].label}</Text>
            </TouchableOpacity>
        )
    }

    changeSelectedItemsState(index){
        let shiftInfoTabsTemp = this.props.shiftInfoTabs;
        let preState = shiftInfoTabsTemp[index].active
        if(index === 0 || index === 1 || index === 2){
            shiftInfoTabsTemp[0].active = false
            shiftInfoTabsTemp[1].active = false
            shiftInfoTabsTemp[2].active = false
            shiftInfoTabsTemp[index].active = !preState
        } else if(index === 3){
            shiftInfoTabsTemp[index].active = !preState
        } else if(index === 4 || index === 5){
            shiftInfoTabsTemp[4].active = false
            shiftInfoTabsTemp[5].active = false
            shiftInfoTabsTemp[index].active = !preState
        }
        this.props.propChanged(NEWSHIFT072_PROP_CHANGED, "shiftInfoTabs", shiftInfoTabsTemp);
        this.forceUpdate()
        console.log('State: ' + JSON.stringify(shiftInfoTabsTemp[index].active))
    }

    selectedUnselectedShiftInfoTabStyle(isSelected) {
        if(isSelected) {
            return styles.selectedStyle;
        } else {
            return styles.unSelectedStyle;
        }
    }

    onNextButtonPress(){
        if (!this.checkFields()) {
            return false;
        } else {
            this.calculationsForProps()
        }
        Keyboard.dismiss();
    }

    calculationsForProps(){
        console.log(moment(this.props.endShiftDate).diff(moment(this.props.startShiftDate), 'days'))
        let count = Math.ceil(Math.abs(moment(this.props.endShiftDate).diff(moment(this.props.startShiftDate), 'days'))) + 1
        let listTemp = []
        if (this.props.selectedTab == 0 && moment(this.props.endShiftDate).format('DDMM') != moment(this.props.startShiftDate).format('DDMM')){
            listTemp.push(0)
        }
        for (let index = 0; index < count; index++) {
            listTemp.push(index)
        }
        let selectedPosition = this.props.workingPositionsData.positions.find((item) => item.id == this.props.positionID)
        let num = selectedPosition.num
        let managerPayout = this.props.managerAssigned == '2' ? 100 : 0;
        let managerBill = this.props.managerAssigned == '2' ? 100 : 0;
        let workerPayout = this.props.workingPositionsData.tariff[`payout_${num}`];
        let workerBill = this.props.workingPositionsData.tariff[`billing_${num}`];
        let shiftDuration = this.props.shiftDuration;
        let workers = parseInt(this.props.noOfStaffInShift);
        let totalPayout = count * ( shiftDuration * workerPayout * workers + managerPayout );
        let totalBill = count * ( shiftDuration * workerBill * workers + managerBill );
        let estimatedCostFirst = count * ( shiftDuration * workerBill * workers + managerBill );
        let estimatedCostSecond = count * ( shiftDuration * workerBill * workers + managerBill + ( 4 * workerBill * 1.5 ));
        this.props.propsChanged(NEWSHIFT073_PROPS_CHANGED, {
            count: count,
            managerHourlyBill: managerBill,
            workerHourlyBill: workerBill,
            totalPayout: totalPayout,
            totalBill: totalBill,
            list: listTemp,
            selectedPositionTitle: selectedPosition.title_en,
            estimatedCostFirst: estimatedCostFirst,
            estimatedCostSecond: estimatedCostSecond,
        });
        this.props.navigation.navigate('NewShift073')
    }

    checkFields() {
        const nameReg = /^[a-zA-Z ]+$/;
        const phoneReg = /^\+[0-9]{1}\ \([0-9]{3}\)\ [0-9]{3}-[0-9]{4}$/;
        if (this.props.address === ""){
            alert("Add address is required");
            return false;
        }
        if (this.props.shiftLocation === "") {
            alert("Shift location field is required");
            return false;
        } else if (this.props.checkInLocation === "") {
            alert("Check in location field is required");
            return false;
        } else if (this.props.name === "") {
            alert("Name field is required");
            return false;
        } else if (nameReg.test(this.props.name) == false) {
            alert("Invalid Name Format");
            return false;
        } else if (this.props.phoneNumber === "") {
            alert("Phone number field is required");
            return false;
        } else if (phoneReg.test(this.props.phoneNumber) == false) {
            alert("Invalid Phone Number Format");
            return false;
        } else
            return true;
    }

    updateAddress = (address) => {
        this.props.propChanged(NEWSHIFT072_PROP_CHANGED, "address", address);
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.props.navigation.goBack()}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
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
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', textAlign: 'center', fontSize: 20, marginTop: 20}}>
                                    {'Shift Address:'}
                                </Text>
                                <View style={{width: '100%', justifyContent: 'center',borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 10}}>
                                    <Text style={{fontSize: 16, padding: 4, textAlign: 'center'}}>{this.props.address}</Text>
                                </View>
                                <TouchableOpacity style={{width: '100%', justifyContent: 'center', marginTop: 10}}
                                                  onPress={()=>{this.props.navigation.navigate('NewShift076',{updateAddress: this.updateAddress})}}
                                                  disabled={false}>
                                    <Text style={{fontSize: 16, padding: 4, textAlign: 'center'}}>{'+ add new address'}</Text>
                                </TouchableOpacity>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', textAlign: 'center', fontSize: 20, marginTop: 20}}>
                                    {'Shift location'}
                                </Text>
                                <View style={styles.forminputContainer}>
                                    <TextInput
                                        style={styles.inputText}
                                        value={this.props.shiftLocation}
                                        onChangeText={(text) => {
                                            this.props.propChanged(NEWSHIFT072_PROP_CHANGED, "shiftLocation", text);
                                        }}
                                        placeholder={'Enter shift location'}
                                        placeholderTextColor={'#9A9A9A'}
                                        scrollEnabled={false}/>
                                </View>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', textAlign: 'center', fontSize: 20, marginTop: 20}}>
                                    {'Check in location'}
                                </Text>
                                <View style={styles.forminputContainer}>
                                    <TextInput
                                        style={styles.inputText}
                                        value={this.props.checkInLocation}
                                        onChangeText={(text) => {
                                            this.props.propChanged(NEWSHIFT072_PROP_CHANGED, "checkInLocation", text);
                                        }}
                                        placeholder={'Enter check in location'}
                                        placeholderTextColor={'#9A9A9A'}
                                        scrollEnabled={false}/>
                                </View>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', textAlign: 'center', fontSize: 20, marginTop: 20}}>
                                    {'Additional shift info'}
                                </Text>
                                {this.renderShiftInfoTabs()}
                                <View style={styles.forminputContainer}>
                                    <TextInput
                                        style={styles.inputText}
                                        value={this.props.additionalShiftInfo}
                                        onChangeText={(text) => {
                                            this.props.propChanged(NEWSHIFT072_PROP_CHANGED, "additionalShiftInfo", text);
                                        }}
                                        placeholder={'Enter additional shift info'}
                                        placeholderTextColor={'#9A9A9A'}
                                        scrollEnabled={false}/>
                                </View>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', textAlign: 'center', fontSize: 20, marginTop: 20}}>
                                    {'On site contact'}
                                </Text>
                                <View style={styles.forminputContainer}>
                                    <TextInput
                                        style={styles.inputText}
                                        value={this.props.name}
                                        onChangeText={(text) => {
                                            this.props.propChanged(NEWSHIFT072_PROP_CHANGED, "name", text);
                                        }}
                                        placeholder={'Enter name'}
                                        placeholderTextColor={'#9A9A9A'}
                                        scrollEnabled={false}/>
                                </View>
                                <View style={[styles.forminputContainer, {marginTop: 10}]}>
                                    <TextInput
                                        style={styles.inputText}
                                        value={this.props.phoneNumber}
                                        keyboardType={'phone-pad'}
                                        onFocus={(text)=>{
                                            if(this.props.phoneNumber.length == 0)
                                                this.props.propChanged(NEWSHIFT072_PROP_CHANGED, "phoneNumber", '+1 (');
                                        }}
                                        onChangeText={(text) => {
                                            if(text.length >= 4) {
                                                if (this.props.phoneNumber.length < text.length && text.length == 7)
                                                    text += ') '
                                                else if (this.props.phoneNumber.length < text.length &&text.length == 12)
                                                    text += '-'
                                                this.props.propChanged(NEWSHIFT072_PROP_CHANGED, "phoneNumber", text);
                                            }
                                        }}
                                        placeholder={'Phone number'}
                                        maxLength={17}
                                        placeholderTextColor={'#9A9A9A'}
                                        scrollEnabled={false}/>
                                </View>
                            </View>
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity 
                                    style={styles.navigationButton}
                                    onPress={()=>{this.onNextButtonPress()}}>
                                    <Text style={styles.navigationButtonText}>Next</Text>
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
    forminputContainer: {
        height: 35,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center',
        width: "100%",
    },
    inputText:{
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
        height:40,
        width: "100%",
        paddingBottom:2,
    },
    tabButtonText:{
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 14,
        color: '#fff',
        width: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    selectedStyle:{
        backgroundColor: '#007AFF',
    },
    unSelectedStyle:{
        color: '#007AFF',
    }
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
        loading, checked, list, managerHourlyBill, workerHourlyBill, totalPayout, totalBill, 
        selectedPositionTitle, estimatedCostFirst, estimatedCostSecond, count, isConnected
    } = NewShift073State;
    const {shirtTabs, pantTabs, shoesTabs} = NewShift078State;
    return {
        loading, toggleTabs, selectedTab, startShiftDate, endShiftDate, minimumDate, maximumDate,
        showdatepicker, showtimepicker, dresscodeShirts, dresscodePants, count,
        dresscodeShoes, index, noOfStaffInShift, managerAssigned, positionID, workingPositionsData, shiftDuration,
        shirtTabs, pantTabs, shoesTabs, shiftInfoTabs, address, shiftLocation, checkInLocation,
        additionalShiftInfo, name, phoneNumber, checked, managerHourlyBill, workerHourlyBill,
        totalPayout, totalBill, selectedPositionTitle, list, estimatedCostFirst, estimatedCostSecond, isConnected
    };
};

export default connect(mapStateToProps, {propChanged, propsChanged})(NewShift072)