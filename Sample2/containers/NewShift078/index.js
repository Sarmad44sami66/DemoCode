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
import { NEWSHIFT070_PROP_CHANGED, NEWSHIFT078_PROP_CHANGED } from '../../actions/Actions';
import { propChanged } from '../../actions/CommonActions';
const {height, width} = Dimensions.get('window');

class NewShift078 extends Component {

    componentDidMount(){
        this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedShirtTabIndex", this.props.dresscodeShirts);
        this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedPantTabIndex", this.props.dresscodePants);
        this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedShoesTabIndex", this.props.dresscodeShoes);
    }

    renderShirtTabs(){
        return (
            <View style={{width: '100%', marginTop: 10, alignItems: 'center'}}>
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style={[styles.tabButton,this.selectedUnselectedShirtTabStyle(0)]} 
                        onPress={()=>{
                            this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedShirtTabIndex", 0);
                        }}>
                        <Text style={[styles.tabButtonText,this.selectedUnselectedShirtTabStyle(0)]}>{this.props.shirtTabs[0].label}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabButton,this.selectedUnselectedShirtTabStyle(1)]}
                        onPress={()=>{
                            this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedShirtTabIndex", 1);
                        }}>
                            <Text style={[styles.tabButtonText,this.selectedUnselectedShirtTabStyle(1)]}>{this.props.shirtTabs[1].label}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style={[styles.tabButton,this.selectedUnselectedShirtTabStyle(2)]} 
                        onPress={()=>{
                            this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedShirtTabIndex", 2);
                        }}>
                        <Text style={[styles.tabButtonText,this.selectedUnselectedShirtTabStyle(2)]}>{this.props.shirtTabs[2].label}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    selectedUnselectedShirtTabStyle(index) {
        if(this.props.selectedShirtTabIndex === index) {
            return styles.selectedStyle;
        } else {
            return styles.unSelectedStyle;
        }
    }

    renderPantTabs(){
        return (
            <View style={{width: '100%', marginTop: 10, alignItems: 'center'}}>
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style={[styles.tabButton,this.selectedUnselectedPantTabStyle(0)]} 
                        onPress={()=>{
                            this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedPantTabIndex", 0);
                        }}>
                        <Text style={[styles.tabButtonText,this.selectedUnselectedPantTabStyle(0)]}>{this.props.pantTabs[0].label}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabButton,this.selectedUnselectedPantTabStyle(1)]} 
                        onPress={()=>{
                            this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedPantTabIndex", 1);
                        }}>
                        <Text style={[styles.tabButtonText,this.selectedUnselectedPantTabStyle(1)]}>{this.props.pantTabs[1].label}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style={[styles.tabButton,this.selectedUnselectedPantTabStyle(2)]} 
                        onPress={()=>{
                            this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedPantTabIndex", 2);
                        }}>
                        <Text style={[styles.tabButtonText,this.selectedUnselectedPantTabStyle(2)]}>{this.props.pantTabs[2].label}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    selectedUnselectedPantTabStyle(index) {
        if(this.props.selectedPantTabIndex === index) {
            return styles.selectedStyle;
        } else {
            return styles.unSelectedStyle;
        }
    }

    renderShoesTabs(){
        return (
            <View style={{width: '100%', marginTop: 10, alignItems: 'center'}}>
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style={[styles.tabButton,this.selectedUnselectedShoesTabStyle(0)]} 
                        onPress={()=>{
                            this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedShoesTabIndex", 0);
                        }}>
                        <Text style={[styles.tabButtonText,this.selectedUnselectedShoesTabStyle(0)]}>{this.props.shoesTabs[0].label}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabButton,this.selectedUnselectedShoesTabStyle(1)]} 
                        onPress={()=>{
                            this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedShoesTabIndex", 1);
                        }}>
                        <Text style={[styles.tabButtonText,this.selectedUnselectedShoesTabStyle(1)]}>{this.props.shoesTabs[1].label}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style={[styles.tabButton,this.selectedUnselectedShoesTabStyle(2)]} 
                        onPress={()=>{
                            this.props.propChanged(NEWSHIFT078_PROP_CHANGED, "selectedShoesTabIndex", 2);
                        }}>
                        <Text style={[styles.tabButtonText,this.selectedUnselectedShoesTabStyle(2)]}>{this.props.shoesTabs[2].label}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    selectedUnselectedShoesTabStyle(index) {
        if(this.props.selectedShoesTabIndex === index) {
            return styles.selectedStyle;
        } else {
            return styles.unSelectedStyle;
        }
    }

    onApplyButtonPress(){
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, 'dresscodeShirts', this.props.selectedShirtTabIndex);
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, 'dresscodePants', this.props.selectedPantTabIndex);
        this.props.propChanged(NEWSHIFT070_PROP_CHANGED, 'dresscodeShoes', this.props.selectedShoesTabIndex);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                              onPress={()=>{this.props.navigation.goBack();}}>
                                <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                {/*<Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Roman', color: '#007AFF', fontSize: 17}}>Outfit</Text>
                        </View>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 10}}
                                          onPress={()=>{this.onApplyButtonPress()}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginEnd: 5}}>Apply</Text>
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
                                    {'Shirts:'}
                                </Text>
                            </View>
                            {this.renderShirtTabs()}
                            <View style={{width: '80%'}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', textAlign: 'center', fontSize: 20, marginTop: 20}}>
                                    {'Pants:'}
                                </Text>
                            </View>
                            {this.renderPantTabs()}
                            <View style={{width: '80%'}}>
                                <Text style={{fontFamily: 'HelveticaNeue-Light', color: '#9A9A9A', textAlign: 'center', fontSize: 20, marginTop: 20}}>
                                    {'Shoes:'}
                                </Text>
                            </View>
                            {this.renderShoesTabs()}
                            <View style={{flexGrow:1}}/>
                            <View style={styles.navigationButtonsContainer}>
                                <TouchableOpacity style={styles.navigationButton}
                                                  onPress={()=>{this.onApplyButtonPress()}}>
                                    <Text style={styles.navigationButtonText}>Apply outfit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
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
        marginTop:10,
        marginBottom:70
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
        height:45,
        margin: 5,
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

const mapStateToProps = ({NewShift070State, NewShift078State}) => {
    const {dresscodeShirts, dresscodePants, dresscodeShoes} = NewShift070State;
    const {
        shirtTabs, selectedShirtTabIndex,
        pantTabs, selectedPantTabIndex,
        shoesTabs, selectedShoesTabIndex} = NewShift078State;
    return {
        shirtTabs, selectedShirtTabIndex,
        pantTabs, selectedPantTabIndex,
        shoesTabs, selectedShoesTabIndex,
        dresscodeShirts, dresscodePants, dresscodeShoes
    };
};

export default connect(mapStateToProps, {propChanged})(NewShift078)