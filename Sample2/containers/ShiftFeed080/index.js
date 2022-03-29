import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    StatusBar
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux'
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { SHIFTFEED080_PROP_CHANGED, SHIFTFEED080_PROP_CLEAR, ShiftFeed0801_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
import AvatarComponent from '../../components/AvatarComponent';
const {height, width} = Dimensions.get('window');

class ShiftFeed080 extends Component {

    componentDidMount(){
        this.checkInternet(this.getShiftsAPICall);
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const prevProps = this.props
        if(prevProps.focusCount < nextProps.focusCount)
            this.checkInternet(this.getShiftsAPICall);
    }

    checkInternet(callback = null) {
        const subscribe = NetInfo.addEventListener(state => {
            // console.log("subscribe Connection type", state.type);
            // console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "isConnected", state.isConnected);
            if(callback && typeof callback == 'function'){
                setTimeout(()=>{
                    callback()
                },500)
            }
        });
        subscribe();
    }

    getShiftsAPICall = () => {
        let currentDateForAPI =  '';
        // if(date) currentDateForAPI = moment(date).format('YYYY-MM-DD');
        // console.log("Date: " +  moment(date).format('YYYY-MM-DD'))
        // console.log("API Is called? ", this.props.isConnected);
        if(this.props.isConnected){
            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", true);
            const {ShiftFeed0801_Api_Call} = this.props;
            ShiftFeed0801_Api_Call(
                {
                    date: currentDateForAPI
                },
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response) => {
        this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "loading", false);
        if (response) {
            // console.log('count: ' + JSON.stringify(response))
            var today = moment(new Date(new Date().toLocaleDateString('en-US')))
            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "listDataPostedShifts", response.results);
            let tempList = response.results.filter(shift => {
                                // console.log('Shift Start: ' + JSON.stringify(new Date(shift.custom_starts_date) >= today))
                                // console.log('Shift end: ' + JSON.stringify(new Date(shift.custom_ends_date) === today))
                                return today >= new Date(shift.custom_starts_date) &&
                                        today <= new Date(shift.custom_ends_date)
                            })
            this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "listDataInProgressShifts", tempList);
            setTimeout(() => {
                //console.log('positionID: ' + this.props.positionID)
            }, 300)
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
        else alert(error)
    }

    // renderShiftTabs(){
    //     return this.props.toggleTabs.map((item, index)=>{
    //         return (
    //             <TouchableOpacity style={styles.tabButton}
    //                 onPress={()=>{
    //                     this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedTab", index);
    //                     this.getShiftsAPICall()
    //                 }}>
    //                 <Text style={[styles.navigationButtonText,this.selectedUnselectedTabStyle(index)]}>{item.label}</Text>
    //             </TouchableOpacity>
    //         )
    //     })
    // }

    // selectedUnselectedTabStyle(index) {
    //     if(this.props.selectedTab === index) {
    //         return styles.selectedStyle;
    //     } else {
    //         return styles.unSelectedStyle;
    //     }
    // }

    renderHeaderTabs(){
        return this.props.toggleHeaderTabs.map((item, index)=>{
            return (
                <TouchableOpacity style={styles.tabHeaderButton}
                onPress={()=>{
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "headerSelectTab", index);
                    this.getShiftsAPICall()
                }}>
                    <Text style={[this.selectedUnSelectedHeaderTabStyle(index)]}>{item.label}</Text>
                </TouchableOpacity>
            )
        })
    }

    selectedUnSelectedHeaderTabStyle(index) {
        if(this.props.headerSelectTab === index) {
            return styles.selectedHeaderStyle;
        } else {
            return styles.unSelectedHeaderStyle;
        }
    }

    // renderNavigationTabs(){
    //     return (
    //         <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
    //             <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
    //                 {
    //                     (moment(this.props.currentDate).format('MM/DD/YYYY') != moment((new Date())).format('MM/DD/YYYY') ||
    //                     moment(this.props.currentDate).format('MM/YYYY') != moment((new Date())).format('MM/YYYY')) &&
    //                     <TouchableOpacity
    //                         style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
    //                         onPress={() => {
    //                         let updatedDate = new Date(moment(this.props.currentDate).subtract(1, this.props.selectedTab == 0 ? 'days' : 'month'));
    //                         this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "currentDate", updatedDate);
    //                         // let date = ''
    //                         // if(this.props.selectedTab === 1)
    //                         //     this.getShiftsAPICall(date)
    //                         // else
    //                             this.getShiftsAPICall();
    //                         }}>
    //                         {this.props.headerSelectTab === 0 &&
    //                         <Image source={require('../../assets/icons/back_arrow.png')}
    //                                style={{resizeMode: 'contain', width: 20, height: 20}}/>}
    //                     </TouchableOpacity>
    //                 }
    //             </View>
    //             <TouchableOpacity
    //                 style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}
    //                 onPress={()=>{
    //                 if(this.props.headerSelectTab === 0)
    //                     this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "show", true)
    //                 }}>
    //                 <Text style={{fontFamily: 'HelveticaNeue-Roman', color: '#007AFF', fontSize: 17}}>
    //                     {
    //                         moment(this.props.currentDate).format(this.props.selectedTab == 0 ? 'MM/DD/YYYY' : this.props.headerSelectTab == 1 ?  'MM/DD/YYYY': 'MM/YYYY')
    //                     }
    //                 </Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity
    //                 style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
    //                 onPress={()=>{
    //                 let updatedDate = new Date(moment(this.props.currentDate).add(1, this.props.selectedTab == 0 ? 'days' : 'month'));
    //                 this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "currentDate", updatedDate);
    //                 // let date = ''
    //                 // if(this.props.selectedTab === 1)
    //                 //     this.getShiftsAPICall(date)
    //                 // else
    //                     this.getShiftsAPICall();
    //                 }}>
    //                 {this.props.headerSelectTab === 0 && <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>}
    //             </TouchableOpacity>
    //         </View>
    //     )
    // }

    onPostNewShiftButtonPress(){
        this.props.navigation.navigate('NewShift070')
    }

    renderPostedShiftItem(item){
        return (
            <TouchableOpacity style={[styles.listItem,{}]}
                onPress={()=>{
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedShiftItemID", item.id);
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedShiftItem", item);
                    //let screenID = this.props.headerSelectTab == 0 ? 100 : 101
                    this.props.screenIDHandler(100)
                }}>
                <View style={{width: '15%', height: 50, alignItems: 'flex-start'}}>
                    <AvatarComponent
                        size={"small"}
                        defaultSource={require('../../assets/icons/rec.png')}
                        source={item.company_logo}
                        style={{resizeMode: item.company_logo ? 'cover' : 'contain', width: '100%', height: '100%', backgroundColor: "#ccc"}}
                    />
                </View>
                <View style={{width: '40%', paddingLeft:10, justifyContent: 'center'}}>
                    {/* <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#000', fontSize: 13}}>{item.company_name}</Text> */}
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#9A9A9A', fontSize: 13}}>{item.position.title_en}
                        <Text style={{color: '#000'}}>{' x' + item.of_staff}</Text>
                    </Text>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', fontSize: 13}}>
                        <Text style={{color: '#9A9A9A',}}>{'Location: '}</Text>
                        <Text style={{color: '#000',}}>{item.location}</Text>
                    </Text>
                </View>
                <View style={{width: '40%', alignItems: 'flex-end', justifyContent: 'space-around'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#9A9A9A', fontSize: 13}}>{item.custom_starts_time + ' - ' + item.custom_ends_time}</Text>
                    {/* <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#9A9A9A', fontSize: 13}}>{"$" + item.price_billing}</Text>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#9A9A9A', fontSize: 13}}>{item.of_staff + " Heroes"}</Text> */}
                </View>
                <View style={{width: '5%', height: 60, alignItems: 'center',justifyContent: 'center', paddingLeft: 5}}>
                    <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: '100%', height: '25%'}}/>
                </View>
            </TouchableOpacity>
        )
    }
    renderInProgressShiftItem(item){
        // console.log('Now: ' + new Date())
        // console.log('start: ' + item.starts)
        // console.log('end: ' + item.ends)
        // console.log('moment(new Date(item.starts)).isBefore(moment(),\'hour\'): ' + moment(new Date(item.starts)).isBefore(moment(),'hour'))
        return (
            <TouchableOpacity style={[styles.listItem,{}]}
                onPress={()=>{
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedShiftItemID", item.id);
                    this.props.propChanged(SHIFTFEED080_PROP_CHANGED, "selectedShiftItem", item);
                    //let screenID = this.props.headerSelectTab == 0 ? 100 : 101
                    this.props.screenIDHandler(101)
                }}>
                <View style={{width: '15%', height: 50, alignItems: 'flex-start'}}>
                    <AvatarComponent
                        size={"small"}
                        source={item.company_logo == "" ? require('../../assets/icons/rec.png') : item.company_logo}
                        style={{resizeMode: 'cover', width: '100%', height: '100%', backgroundColor: "#ccc"}}
                    />
                </View>
                <View style={{width: '40%', paddingLeft:10, justifyContent: 'center'}}>
                    {/* <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#000', fontSize: 13}}>{item.company_name}</Text> */}
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#9A9A9A', fontSize: 13}}>{item.position.title_en}
                        <Text style={{color: '#000'}}>{' x' + item.of_staff}</Text>
                    </Text>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', fontSize: 13}}>
                        <Text style={{color: '#9A9A9A',}}>{'Location: '}</Text>
                        <Text style={{color: '#000',}}>{item.location}</Text>
                    </Text>
                </View>
                <View style={{width: '40%', alignItems: 'flex-end', justifyContent: 'space-around'}}>
                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#9A9A9A', fontSize: 13}}>
                        {moment(new Date(item.starts)).isBefore(moment()) ?
                            (moment(item.ends).isBefore(moment()) ?
                                "Ended @ " + moment(item.ends).format('LT')
                                :
                                "Started @ " + moment(item.starts).format('LT'))
                            :
                            "Starting @ " + moment(item.starts).format('LT')}
                    </Text>
                    {
                    (moment(item.starts).isBefore(moment()) && moment(item.ends).isBefore(moment())) ?
                        <TouchableOpacity
                            style={{height: 20, width: '80%', alignItems: 'flex-end', justifyContent: 'center'}}
                            onPress={()=>{}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 13}}>{'Rate heroes'}</Text>
                        </TouchableOpacity>
                        :
                        <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#9A9A9A', fontSize: 13}}>{item.applied_workers +'/' + item.of_staff + ' Heroes' }</Text>
                    }
                </View>
                <View style={{width: '5%', height: 60, alignItems: 'center',justifyContent: 'center', paddingLeft: 5}}>
                <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: '100%', height: '25%'}}/>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let selectedList = this.props.headerSelectTab == 0 ? this.props.listDataPostedShifts : this.props.listDataInProgressShifts;
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{flexDirection: 'row', width: '100%', backgroundColor: '#F8F8F8'}}>
                        {this.renderHeaderTabs()}
                    </View>
                    {/* {this.renderNavigationTabs()} */}
                    <View style={{width: width, justifyContent: 'center', alignItems: 'center', flex:1}}>
                        {/* {this.props.headerSelectTab === 0 &&
                            <View style={{flexDirection: 'row', width: '80%', borderWidth: 2,borderRadius: 5,borderColor: '#007AFF', marginTop: 10}}>
                                {this.renderShiftTabs()}
                            </View>
                        } */}
                        <View style={{flex:1, alignItems: 'center',marginTop: 10, marginBottom:70}}>
                            <FlatList
                                data={selectedList}
                                keyExtractor={item => item.id}
                                extraData={this.props}
                                showsVerticalScrollIndicator={false}
                                numColumns={1}
                                contentContainerStyle={{alignItems: 'center', width: '100%'}}
                                removeClippedSubviews={false}
                                renderItem={({item, index}) => {
                                    return (
                                        <View style={{width: '100%', alignItems: 'center'}}>
                                            {index == 0 ?
                                                <Text style={styles.descriptionText}>{item.custom_starts_date + (this.props.headerSelectTab === 1 ? ' - Today' : '')}</Text>
                                                : this.props.listDataPostedShifts[index-1].custom_starts_date !== this.props.listDataPostedShifts[index].custom_starts_date
                                                && <Text style={styles.descriptionText}>{item.custom_starts_date}</Text>
                                            }
                                            {this.props.headerSelectTab === 0 ?
                                                this.renderPostedShiftItem(item)
                                                :
                                                this.renderInProgressShiftItem(item)
                                            }
                                        </View>
                                    )
                                }}
                            />
                        </View>
                        <View style={styles.navigationButtonsContainer}>
                            <TouchableOpacity
                                style={styles.navigationButton}
                                onPress={() => {
                                    this.onPostNewShiftButtonPress()
                                }}>
                                <Image
                                    style={{resizeMode: 'contain', width: '50%', height: '50%'}}
                                    source={require('../../assets/icons/add_post.png')}
                                />
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: "#fff",
        justifyContent: "flex-start",
    },
    navigationButtonsContainer:{
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 20,
        bottom: 80,
    },
    navigationButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 30,
        zIndex: 500,
        height: '100%',
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
        width: '50%',
    },
    tabHeaderButton:{
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: 55,
    },
    tabButtonText:{
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 13,
        color: '#fff'
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
    selectedStyle:{
        padding: 3,
        borderWidth:1,
        borderColor: '#007AFF',
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#007AFF',
    },
    unSelectedStyle:{
        padding: 3,
        width: '100%',
        textAlign: 'center',
        color: '#007AFF',
    },
    selectedHeaderStyle:{
        padding: 3,
        width: '100%',
        color: '#007AFF',
        textAlign: 'center',
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 18,
    },
    unSelectedHeaderStyle:{
        padding: 3,
        fontFamily: 'HelveticaNeue-Light',
        fontSize: 18,
        width: '100%',
        textAlign: 'center',
        color: '#9A9A9A',
    },
    listItem:{
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
    },
    descriptionText:{
        fontFamily: 'HelveticaNeue-Roman',
        color: '#9A9A9A',
        fontSize: 14,
        marginTop:10
    },
});

const mapStateToProps = ({ShiftFeed080State}) => {
    const {
        loading, currentDate, show, toggleHeaderTabs, headerSelectTab, toggleTabs, selectedTab,
        listDataPostedShifts, listDataInProgressShifts, selectedShiftItemID, isConnected
    } = ShiftFeed080State;
    return {
        loading, currentDate, show, toggleHeaderTabs, headerSelectTab, toggleTabs, selectedTab,
        listDataPostedShifts, listDataInProgressShifts, selectedShiftItemID, isConnected };
};

export default connect(mapStateToProps, {ShiftFeed0801_Api_Call, propChanged, propsClear})(ShiftFeed080);
