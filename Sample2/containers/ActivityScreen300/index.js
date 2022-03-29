import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import moment from 'moment';
import { connect } from 'react-redux'
import { ACTIVITYSCREEN300_PROP_CHANGED, ACTIVITYSCREEN300_PROP_CLEAR, ActivityScreen3001_Api_Call} from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
const {height, width} = Dimensions.get('window');

class ActivityScreen300 extends Component {
    
    constructor(props) {
        super(props);
        props.navigation.setParams({
            onTabFocus: this.handleTabFocus
        });
    }

    handleTabFocus = () => {
        this.forceUpdate()
    }

    componentDidMount(){
        const { navigation } = this.props
        this.focusListener = navigation.addListener("didFocus", () => {
            this.checkInternet(this.getActivitiesAPICall);
        })
    }

    componentWillUnmount(){
        this.props.propsClear(ACTIVITYSCREEN300_PROP_CLEAR)
    }

    componentWillUnmount() {
        if(this.focusListener){
            this.focusListener.remove()
        }
    }

    checkInternet(callback = null) {    
        const subscribe = NetInfo.addEventListener(state => {
            // console.log("subscribe Connection type", state.type);
            // console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(ACTIVITYSCREEN300_PROP_CHANGED, "isConnected", state.isConnected);             
            if(callback && typeof callback == 'function'){
                setTimeout(()=>{
                    callback()
                },500)
            }
        });
        subscribe();
    }

    getActivitiesAPICall = () =>{
        if(this.props.isConnected){
            this.props.propChanged(ACTIVITYSCREEN300_PROP_CHANGED, "loading", true);
            const {ActivityScreen3001_Api_Call} = this.props;
            ActivityScreen3001_Api_Call(
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response)=> {
        if(response){
            this.props.propChanged(ACTIVITYSCREEN300_PROP_CHANGED, "loading", false);
            var today = moment(new Date(new Date().toLocaleDateString('en-US'))).format("MM/DD/YYYY")
            var yesterday = moment(new Date(new Date().toLocaleDateString('en-US'))).subtract(1, 'days').format("MM/DD/YYYY")
            var older = moment(new Date(new Date().toLocaleDateString('en-US'))).subtract(1, 'days')
            let listActivityShiftsTodayTemp = response.results.filter(activity => {
                return activity.custom_created_date === today
            })
            let listActivityShiftsYesterdayTemp = response.results.filter(activity => {
                return activity.custom_created_date === yesterday
            })
            let listActivityShiftsOlderTemp = response.results.filter(activity => {
                return new Date(activity.custom_created_date) < older
            })
            this.props.propChanged(ACTIVITYSCREEN300_PROP_CHANGED, "listActivityShiftsToday", listActivityShiftsTodayTemp);
            this.props.propChanged(ACTIVITYSCREEN300_PROP_CHANGED, "listActivityShiftsYesterday", listActivityShiftsYesterdayTemp);
            this.props.propChanged(ACTIVITYSCREEN300_PROP_CHANGED, "listActivityShiftsOlder", listActivityShiftsOlderTemp);
        }
    }

    onError = (error) => {
        this.props.propChanged(ACTIVITYSCREEN300_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.detail){
            errors += error.detail + '\n'
        }
        if(errors.length > 0)
            alert(errors)
    }

    getImageSource = (activityType) => {
        if(activityType === "Payment succesfull")
            return require('../../assets/icons/rec_doller.png')
        else if(activityType === "Shift starting soon" || activityType === "Shift ending soon")
            return require('../../assets/icons/rec_clock.png')
        else if(activityType === "Shift finished")
            return require('../../assets/icons/rec_check.png')
        else if(activityType === "Shift extension rejected")
            return require('../../assets/icons/rec_cross.png')
        else if(activityType === "Shift extension accepted")
            return require('../../assets/icons/rec_plus.png')
    }

    renderHeaderTabs(){
        return (
            <View style={styles.tabHeaderButton}>
                <View style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                </View>
                <View style={{flex: 1, width: '60%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17}}>{'Activity'}</Text>
                </View>
                <View style={{width: '20%',alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}>
                    {/*<Image source={require('../../assets/icons/filter.png')} style={{ resizeMode: 'contain', width: 25, height: 25}}/>*/}
                </View>
            </View>
        )
    }

    renderList(list){
        return list.map((item, index)=> {
            return (
                <View style={[styles.listItem, {}]}>
                    <View style={{width: 60, height: '100%'}}>
                        <Image source={this.getImageSource(item.activity)}
                               style={{resizeMode: 'contain', width: '100%', height: '100%'}}/>
                    </View>
                    <View style={{width: '70%', marginLeft: 10, justifyContent: 'space-around',}}>
                        <Text style={{
                            fontFamily: 'HelveticaNeue-Medium',
                            color: '#000',
                            fontSize: 16
                        }}>{item.activity}</Text>
                        <Text style={{fontFamily: 'HelveticaNeue-Medium', fontSize: 16}}>
                            <Text style={{color: '#9A9A9A',}}>{item.custom_created_time + ' - '}</Text>
                            <Text style={{color: '#9A9A9A',}}>{item.custom_created_date}</Text>
                        </Text>
                    </View>
                </View>
            )
        })
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
                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 70}}>
                            {this.props.listActivityShiftsToday.length > 0 &&
                                <Text style={[styles.textStyle,{}]}>{'Today'}</Text>
                            }
                            {this.renderList(this.props.listActivityShiftsToday)}
                            {this.props.listActivityShiftsYesterday.length > 0 &&
                                <Text style={[styles.textStyle,{}]}>{'Yesterday'}</Text>
                            }
                            {this.renderList(this.props.listActivityShiftsYesterday)}
                            {this.props.listActivityShiftsOlder.length > 0 &&
                                <Text style={[styles.textStyle,{}]}>{'Older'}</Text>
                            }
                            {this.renderList(this.props.listActivityShiftsOlder)}
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
        marginTop: 10,
        fontFamily: 'HelveticaNeue-Light',
        color: '#007AFF',
        fontSize: 16,
        lineHeight: 25
    },
    listItem:{
        flexDirection: 'row',
        width: '90%',
        height: 70,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: '#9A9A9A',
        borderBottomWidth:1
    }
});

const mapStateToProps = ({ActivityScreen300State}) => {
    const {
        loading, listActivityShiftsToday, listActivityShiftsYesterday,
        listActivityShiftsOlder, isConnected
    } = ActivityScreen300State;
    return {
        loading, listActivityShiftsToday, listActivityShiftsYesterday,
        listActivityShiftsOlder, isConnected    
    };
};

export default connect(mapStateToProps, {ActivityScreen3001_Api_Call, propChanged, propsClear})(ActivityScreen300)