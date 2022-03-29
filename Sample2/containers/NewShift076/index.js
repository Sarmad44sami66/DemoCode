import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Platform
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import NetInfo from "@react-native-community/netinfo";
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import { connect } from 'react-redux';
import { NEWSHIFT076_PROP_CHANGED } from '../../actions/Actions';
import { propChanged } from '../../actions/CommonActions';

const { height, width } = Dimensions.get('window');

class NewShift076 extends Component {

    checkInternet() {
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(NEWSHIFT076_PROP_CHANGED, "isConnected", state.isConnected);
        });
        subscribe();
    }

    componentDidMount() {
        this.checkInternet();
        let checkConst = '';
        let platformConst = Platform.OS;
        if(platformConst === 'ios'){
            checkConst = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        } else if (platformConst === 'android') {
            checkConst = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        } else return;
        console.log(checkConst)
        setTimeout(() => {
            Permissions.check(checkConst)
            .then(result => {
                this.handleResults(result, checkConst)
            }).catch(error => {
                // …
            });
        }, 1000)
    }

    handleResults = (result, checkConst, count = 1) =>{
        if(count == 2){
            return// this.props.navigation.goBack();s
        }
        switch (result) {
            case RESULTS.UNAVAILABLE:
                console.log('This feature is not available (on this device / in this context)',);
                break;
            case RESULTS.DENIED:
                Permissions.request(checkConst).then(result => {
                    this.handleResults(result, checkConst, count + 1)
                });
                console.log('The permission has not been requested / is denied but requestable',);
                break;
            case RESULTS.GRANTED:
                    Geolocation.getCurrentPosition(
                        (position) => {
                            let regionTemp = {
                                ...this.props.region,
                                longitude: position.coords.longitude,
                                latitude: position.coords.latitude,
                            };
                            this.props.propChanged(NEWSHIFT076_PROP_CHANGED, "region", regionTemp);
                        },
                        (error) => {
                            // See error code charts below.
                            console.log('Error: ' + error.code, error.message);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                break;
            case RESULTS.BLOCKED:
                Permissions.openSettings().catch(() => console.warn('cannot open settings'));
                console.log('The permission is denied and not requestable anymore');
                break;
        }
    }

    getPinnedAddress() {
        if (this.props.isConnected) {
            var latlng = this.props.region.latitude + ',' + this.props.region.longitude;
            let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&sensor=false&key=AIzaSyD5YuagFFL0m0IcjCIvbThN25l0m2jMm2w'
            fetch(url, {
                method: 'GET', // or 'PUT'
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.status === 200) {
                    return response.json()
                }
            }).then(response => {
                console.log("Address:", JSON.stringify(response.results[0].formatted_address));
                this.props.navigation.state.params.updateAddress(
                    response.results[0].formatted_address
                );
                this.props.navigation.goBack();
            }).catch(error => {
                console.error('Error:', error);
            });
        } else {alert('Please check your internet')}
    }

    onOkPressed() {
        this.getPinnedAddress();
    }

    renderGooglePlacesInput = () => {
        return (
            <GooglePlacesAutocomplete
                ref={ref => this.googlePlacesAutocomplete = ref}
                placeholder='Search'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed='true'    // true/false/undefined
                fetchDetails={true}
                text={this.props.address}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    console.log('data-->: ' + JSON.stringify(data))
                    console.log('details-->: ' + JSON.stringify(details))
                    let regionTemp = {
                        ...this.props.region,
                        longitude: details.geometry.location.lng,
                        latitude: details.geometry.location.lat
                    };
                    this.props.propChanged(NEWSHIFT076_PROP_CHANGED, "address", details.formatted_address);
                    this.props.propChanged(NEWSHIFT076_PROP_CHANGED, "region", regionTemp);
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
                    container: {
                        alignItems: 'center',
                        zIndex: 500
                    },
                    listView: {
                        marginTop: 50,
                        elevation: 1,
                        backgroundColor: '#fff',
                        position: 'absolute',
                        width: '80%',
                        zIndex: 500
                    },
                    textInputContainer: {
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        borderBottomWidth: 0,
                        borderTopWidth: 0,
                        width: '100%',
                    },
                    textInput: [styles.inputText],
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
                renderLeftButton = {() =>
                    <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', width: 30}}
                        onPress={() => { this.props.navigation.goBack() }}>
                        <Image source={require('../../assets/icons/back_arrow.png')} style={{marginTop:5, resizeMode: 'contain', width: 20, height: 20 }} />
                    </TouchableOpacity>
                }
                renderRightButton={() =>
                    <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', width: 30}}
                        onPress={() => { 
                            console.log('isCalling')
                            if(typeof this.googlePlacesAutocomplete.clearText == 'function'){
                                this.googlePlacesAutocomplete.clearText()
                                this.googlePlacesText = ''
                            }
                            this.props.propChanged(NEWSHIFT076_PROP_CHANGED, "address", '');
                        }}>
                        <Text style={styles.inputText}>X</Text>
                    </TouchableOpacity>}
                />
        );
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.containerMain}>
                    {this.renderGooglePlacesInput()}
                    <View style={styles.mapContainer}>
                        <MapView
                            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                            style={styles.map}
                            loadingEnabled={true}
                            loadingIndicatorColor={'#606060'}
                            loadingBackgroundColor={'#ffffff'}
                            onRegionChangeComplete={(region) => {
                                this.props.propChanged(NEWSHIFT076_PROP_CHANGED, "region", region);
                            }}
                            region={this.props.region}>
                        </MapView>
                        <View style={{ resizeMode: 'contain', width: 40, height: 40 }}>
                            <Image source={require('../../assets/icons/marker.png')} style={{ resizeMode: 'contain', marginTop: -20, width: 40, height: 40 }} />
                        </View>
                    </View>
                    <TouchableOpacity
                        zIndex={9999}
                        style={styles.buttonContainer}
                        onPress={() => {
                            this.onOkPressed();
                        }}>
                        <Text style={{ fontFamily: 'HelveticaNeue-Medium', color: '#fff', fontSize: 16 }}>{'Ok'}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        height: height,
        backgroundColor: "#fff",
        justifyContent: "flex-start",
    },
    mapContainer: {
        flex: 1,
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        alignItems: 'center',
        justifyContent: 'center',
        ...StyleSheet.absoluteFillObject,
    },
    buttonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007AFF'
    },
    inputText:{
        marginTop:5,
        fontSize: 15,
        fontFamily: 'HelveticaNeue-Roman',
        color: '#030205',
    },
});

const mapStateToProps = ({ NewShift076State }) => {
    const { loading, addressCur, region, address, isConnected } = NewShift076State;
    return { loading, addressCur, region, address, isConnected };
};

export default connect(mapStateToProps, {propChanged})(NewShift076)