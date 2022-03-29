import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Alert
} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { RPOFILESCREEN200_PROP_CHANGED, SHIFTFEED080_PROP_CLEAR, RPOFILESCREEN200_PROP_CLEAR, ProfileScreen2001_Api_Call, ProfileScreen2002_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
import AvatarComponent from '../../components/AvatarComponent';
const {height, width} = Dimensions.get('window');
const resetActionToLogin = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LoginORSignUp020'})],
});
class ProfileScreen200 extends Component {

    componentDidMount(){
        this.checkInternet(this.getCompanyInfoAPICall);
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const prevProps = this.props
        if(prevProps.focusCount < nextProps.focusCount)
            this.checkInternet(this.getCompanyInfoAPICall);
    }

    checkInternet(callback = null) {    
        const subscribe = NetInfo.addEventListener(state => {
            // console.log("subscribe Connection type", state.type);
            // console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "isConnected", state.isConnected);             
            if(callback && typeof callback == 'function'){
                setTimeout(()=>{
                    callback()
                },500)
            }
        });
        subscribe();
    }

    // componentWillUnmount(){
    //     this.props.propsClear(RPOFILESCREEN200_PROP_CLEAR)
    // }
 
    getCompanyInfoAPICall = () => {
        this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "loading", true);
        if(this.props.isConnected){
            const {ProfileScreen2001_Api_Call} = this.props;
            ProfileScreen2001_Api_Call(
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response) => {
        if (response.id) {
            // console.log("\n\n\n\ndata: " + JSON.stringify(response));
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "businessLogo", response.logo);
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "businessName", response.name);
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "accountID", response.account_id);
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "status", response.status);
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "address", response.address);
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "city", response.city);
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "zip", response.zip_code);
            this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "state", response.state);
            const {ProfileScreen2002_Api_Call} = this.props;
            ProfileScreen2002_Api_Call(
                onSuccess = (response2) =>{
                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "loading", false);
                    if(response2){
                        this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "firstName", response2.first_name);
                        this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "lastName", response2.last_name);
                        this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "phoneNumber", response2.phone);
                    }
                },
                onError = (error) =>{
                    // console.log('Error1: ' + JSON.stringify(error))
                    this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "loading", false);
                    let errors = ''
                    if(error.detail){
                        errors += error.detail + '\n'
                    }
                    if(errors.length > 0)
                        alert(errors);
                }
            );
        }
    }
    onError = (error) => {
        // console.log('Error: ' + JSON.stringify(error))
        this.props.propChanged(RPOFILESCREEN200_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        }
        if(errors.length > 0)
            alert(errors);
    }

    renderHeaderTabs(){
        return (
            <View style={styles.tabHeaderButton}>
                <View style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                </View>
                <View style={{flex: 1, width: '60%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17}}>{'Business Profile'}</Text>
                </View>
                <TouchableOpacity style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                                  onPress={()=>{this.props.screenIDHandler(201)}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17}}>{'Edit'}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let data_object = Preference.get(mystorage.DATA_OBJECT);
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
                            <View style={{flex:1, width: '100%', backgroundColor: '#fff'}}>
                                <AvatarComponent
                                    size={"large"}
                                    source={this.props.businessLogo}
                                    style={{height:150, backgroundColor: '#eee'}}
                                />
                            </View>
                            <Text style={[styles.textStyle,{marginTop: 20,fontSize: 22, color: '#000',fontFamily: 'HelveticaNeue-Medium'}]}>{this.props.businessName}</Text>
                            <Text style={[styles.textStyle,{}]}>
                                <Text style={{color: '#9A9A9A'}}>{'Account ID: '}</Text>
                                <Text style={{color: '#007AFF'}}>{this.props.accountID}</Text>
                            </Text>
                            <Text style={[styles.textStyle,{}]}>
                                <Text style={{color: '#9A9A9A'}}>{'Account status: '}</Text>
                                <Text style={{color: '#007AFF'}}>{this.props.status}</Text>
                            </Text>
                            <View style={{flex: 1, width: '80%', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop:15}}>
                                <Text style={[styles.textStyle,{color: '#9A9A9A'}]}>{'Business address:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{this.props.address === '' ? '' : this.props.address + ', ' + this.props.city + ', ' + this.props.zip + ', ' + this.props.state}</Text>
                                <Text style={[styles.textStyle,{color: '#9A9A9A',marginTop:8}]}>{'Contact person:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{this.props.firstName + " " + this.props.lastName}</Text>
                                <Text style={[styles.textStyle,{color: '#9A9A9A',marginTop:8}]}>{'Phone nubmer:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{this.props.phoneNumber}</Text>
                                <Text style={[styles.textStyle,{color: '#9A9A9A',marginTop:8}]}>{'Email:'}</Text>
                                <Text style={[styles.textStyle,{}]}>{this.props.address === '' ? '' : data_object.user_email}</Text>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    <View style={styles.navigationButtonsContainer}>
                        <TouchableOpacity
                            style={styles.navigationButton}
                            onPress={()=>{
                                Alert.alert(
                                    'Are you sure?',
                                    'Are you sure you want to log out?',
                                    [
                                        {text: 'No', onPress: () => {}, style: 'cancel',},
                                        {text: 'Yes',
                                                onPress: () => {
                                                Preference.clear();
                                                this.props.propsClear(RPOFILESCREEN200_PROP_CLEAR)
                                                this.props.propsClear(SHIFTFEED080_PROP_CLEAR)
                                                this.props.navigation.dispatch(resetActionToLogin);
                                            }
                                        },
                                    ],
                                    {cancelable: true},
                                );
                            }}>
                            <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Logout</Text>
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
        color: '#007AFF',
        fontSize: 17,
        lineHeight: 23
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
});

const mapStateToProps = ({ProfileScreen200State}) => {
    const {loading, businessLogo, businessName, accountID, status, address, city, zip, state, firstName, lastName, phoneNumber, isConnected} = ProfileScreen200State;
    return {loading, businessLogo, businessName, accountID, status, address, city, zip, state, firstName, lastName, phoneNumber, isConnected};
};

export default connect(mapStateToProps, {ProfileScreen2001_Api_Call, ProfileScreen2002_Api_Call, propChanged, propsClear})(ProfileScreen200);