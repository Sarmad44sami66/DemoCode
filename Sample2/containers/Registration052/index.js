import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { connect } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import ProgressBar from '../../components/ProgressBar';
import { REGISTRATION052_PROP_CHANGED, REGISTRATION052_PROP_CLEAR, Registration0521_Api_Call } from '../../actions/Actions';
import { propChanged, propsClear } from '../../actions/CommonActions';
const {height, width} = Dimensions.get('window');

const uncheckIcon = require('../../assets/icons/rounded_uncheck.png');
const checkedIcon = require('../../assets/icons/rounded_check.png');

class Registration052 extends Component {

    componentDidMount(){
        this.checkInternet();
    }

    componentWillUnmount(){
        this.props.propsClear(REGISTRATION052_PROP_CLEAR)
    }

    checkInternet() {    
        const subscribe = NetInfo.addEventListener(state => {
            //console.log("subscribe Connection type", state.type);
            //console.log("subscribe Is connected? ", state.isConnected);
            this.props.propChanged(REGISTRATION052_PROP_CHANGED, "isConnected", state.isConnected);            
        });
        subscribe();
    }

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

    onNextButtonPress(){
        this.props.propChanged(REGISTRATION052_PROP_CHANGED, "loading", true);
        if(this.props.isConnected){
            var details = {
                type: this.props.radioOptions[this.props.selectedIndex].label,
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            const {Registration0521_Api_Call} = this.props;
            Registration0521_Api_Call(
                formBody,
                this.onSuccess,
                this.onError
            );
        } else {alert('Please check your internet')}
    }

    onSuccess = (response) => {
        console.log('\n\n\n\nAli: ' + JSON.stringify(response))
        this.props.propChanged(REGISTRATION052_PROP_CHANGED, "loading", false);
        if (response.id) {
            this.props.navigation.navigate('Registration053');
        }
    }
    onError = (error) => {
        this.props.propChanged(REGISTRATION052_PROP_CHANGED, "loading", false);
        let errors = ''
        if(error.details){
            errors += error.details + '\n'
        }
        if(errors.length > 0)
            alert(errors);
        else alert(error);
    }

    renderMainText() {
        return(
            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: 'black', fontSize: 24, marginTop: 2, fontWeight: '600', textAlign: 'center', lineHeight: 30}}>
                What type of{`\n`}business are you{`\n`}running?
            </Text>
        )
    }

    renderCheckOrUncheckIcon(index) {
        if(this.props.selectedIndex === index) {
            return checkedIcon;
        } else {
            return uncheckIcon;
        }
    }

    renderRadioButtons() {
       return this.props.radioOptions.map((item, index)=>{
            return (
                <TouchableOpacity 
                    onPress={()=>{
                        this.props.propChanged(REGISTRATION052_PROP_CHANGED, "selectedIndex", index);
                    }}>
                    <View style={{flexDirection: 'row',alignItems: 'center', marginTop: index === 0 ? 0: 20}}>
                        <Image source={this.renderCheckOrUncheckIcon(index)} style={{height: 25, width: 25, marginRight:10}} resizeMode={'contain'}/>
                        <Text style={{fontFamily: 'HelveticaNeue-Medium', color: 'black', fontSize: 18, marginLeft: 10}}>{item.label}</Text>
                    </View>
                </TouchableOpacity>
            )

        });
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 30}}>
                        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.props.navigation.goBack()}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            {this.renderDots()}
                        </View>
                        <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
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
                            {this.renderMainText()}
                            <View style={{ alignSelf: 'center', marginTop: 30}}>
                                {this.renderRadioButtons()}
                            </View>
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
        justifyContent: 'center',
        marginTop: 20,
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
});

const mapStateToProps = ({Registration052State}) => {
    const {loading, radioOptions, selectedIndex, isConnected} = Registration052State;
    return {loading, radioOptions, selectedIndex, isConnected};
};

export default connect(mapStateToProps, {Registration0521_Api_Call, propChanged, propsClear})(Registration052)