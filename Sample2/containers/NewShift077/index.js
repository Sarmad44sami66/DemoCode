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
import { PAYMENTSCREEN400_PROP_CHANGED, PAYMENTSCREEN400_PROP_CLEAR} from '../../actions/Actions';
import ProgressBar from '../../components/ProgressBar';
import { propChanged, propsClear } from '../../actions/CommonActions';
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const {height, width} = Dimensions.get('window');
const uncheckIcon = require('../../assets/icons/rounded_uncheck.png');
const checkedIcon = require('../../assets/icons/rounded_check.png');

class NewShift077 extends Component {

    componentDidMount(){
        this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "selectedIndex", Preference.get(mystorage.CARD_PRIMARY));
        this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "radioOptions", Preference.get(mystorage.CARD_OBJECT));
    }

    onSelectButtonPress () {
        Preference.set(mystorage.CARD_PRIMARY, this.props.selectedIndex);
        this.props.navigation.goBack()
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
                        this.props.propChanged(PAYMENTSCREEN400_PROP_CHANGED, "selectedIndex", index);
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: index === 0 ? 0: 15}}>
                        <Image source={this.renderCheckOrUncheckIcon(index)} style={{height: 22, width: 22, marginRight:15}} resizeMode={'contain'}/>
                        <Text style={{fontFamily: 'HelveticaNeue-Medium', color: 'black', fontSize: 15}}>
                            {item.brand} 
                            <Text style={{color: '#9A9A9A'}}>{' Ending In '}</Text>
                            {item.last4}
                        </Text>
                    </View>
                </TouchableOpacity>
            )

        });
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 55, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 20, backgroundColor: '#F8F8F8'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                onPress={()=>{
                                    this.props.navigation.goBack()
                                }}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                {/* <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text> */}
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Roman', color: '#007AFF', fontSize: 17}}></Text>
                        </View>
                        <TouchableOpacity 
                            style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                            onPress={()=>{this.onSelectButtonPress()}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginEnd: 5}}>Select</Text>
                            <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color: '#9A9A9A', fontFamily: 'HelveticaNeue-Medium', textAlign: 'center', fontSize: 20}}>
                        {'Select payment method:'}
                    </Text>
                    <KeyboardAwareScrollView
                        innerRef={ref => {this.scroll = ref}}
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow:1}}
                        style={{flex:1, width:width}}>
                        <View style={{flexGrow:1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{justifyContent:"center", alignItems: 'center', width:"80%",}}>
                                <View style={{alignSelf: 'center', marginTop: 20}}>
                                    {this.renderRadioButtons()}
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{ margin:20}}
                                onPress={()=>{
                                    this.props.navigation.navigate('Registration057_1')
                                }}>
                                <Text style={{fontFamily: 'HelveticaNeue-Medium', fontSize: 16, color: '#007AFF'}}>{'+ Add New Card...'}</Text>
                            </TouchableOpacity>
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity 
                                    style={styles.navigationButton}
                                    onPress={()=>{
                                        this.onSelectButtonPress()
                                    }}>
                                    <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Select</Text>
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
        marginTop: 10,
        width: '70%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
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

const mapStateToProps = ({PaymentScreen400State}) => {
    const { loading, radioOptions, selectedIndex, isConnected } = PaymentScreen400State;
    return { loading, radioOptions, selectedIndex, isConnected };
};

export default connect(mapStateToProps, {propChanged, propsClear})(NewShift077)