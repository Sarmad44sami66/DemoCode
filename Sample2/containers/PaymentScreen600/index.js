import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import PaymentScreen400 from "../PaymentScreen400";
import PaymentScreen401 from "../PaymentScreen401";
import PaymentScreen402 from "../PaymentScreen402";
import Preference from 'react-native-preference';
import * as mystorage from '../../Utils/constants';
const {height, width} = Dimensions.get('window');

export default class PaymentScreen600 extends Component {
    constructor(props) {
        super(props);
        this.screenIDHandler = this.screenIDHandler.bind(this)
        this.state = {
            loading: false,
            screenID: 400,
        }
        this.screenFocusCount = 1
    }

    screenIDHandler = (screenID) => {
        this.setState({
            screenID: screenID
        })
    }

    componentDidMount(){
        const { navigation } = this.props
        this.focusListener = navigation.addListener("didFocus", () => {
            this.screenFocusCount += 1
            this.screenIDHandler(400);
        })
    }

    componentWillUnmount() {
        if(this.focusListener){
            this.focusListener.remove()
        }
    }


    renderScreen(){
        const screenID = this.state.screenID;
        if(screenID == 400){
            return <PaymentScreen400 navigation={this.props.navigation} focusCount={this.screenFocusCount} screenIDHandler={this.screenIDHandler}/>
        }
        else if (screenID == 401){
            return <PaymentScreen401 navigation={this.props.navigation} screenIDHandler={this.screenIDHandler}/>
        }
        else if (screenID == 402){
            return <PaymentScreen402 navigation={this.props.navigation} screenIDHandler={this.screenIDHandler}/>
        }
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    {this.renderScreen()}
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
});

