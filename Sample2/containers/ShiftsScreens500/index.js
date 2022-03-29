import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    StatusBar
} from 'react-native';
import ShiftFeed080 from "../ShiftFeed080";
import ShiftDetails100 from "../ShiftDetails100";
import ShiftDetails101 from "../ShiftDetails101";
import ShiftDetails105 from "../ShiftDetails105";
import ShiftDetails108 from "../ShiftDetails108";
import ShiftDetails109 from "../ShiftDetails109";
const {height, width} = Dimensions.get('window');

export default class ShiftScreens500 extends Component {
    constructor(props) {
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('#fff');
        super(props);
        this.screenIDHandler = this.screenIDHandler.bind(this)
        this.state = {
            loading: false,
            screenID: 80,
        }
        this.screenFocusCount = 1
    }

    componentDidMount(){
        const { navigation } = this.props
        this.focusListener = navigation.addListener("didFocus", () => {
            this.screenFocusCount += 1
            this.screenIDHandler(80);
        })

    }

    componentWillUnmount() {
        if(this.focusListener){
            this.focusListener.remove()
        }
    }

    screenIDHandler = (screenID) => {
        this.setState({
            screenID: screenID
        })
    }


    renderScreen(){
        const screenID = this.state.screenID;
        if(screenID == 80){
            return <ShiftFeed080 navigation={this.props.navigation} focusCount={this.screenFocusCount} screenIDHandler={this.screenIDHandler}/>
        }
        else if(screenID == 100){
            return <ShiftDetails100 navigation={this.props.navigation} screenIDHandler={this.screenIDHandler}/>
        }
        else if(screenID == 101){
            return <ShiftDetails101 navigation={this.props.navigation} screenIDHandler={this.screenIDHandler}/>
        }
        else if(screenID == 105){
            return <ShiftDetails105 navigation={this.props.navigation} screenIDHandler={this.screenIDHandler}/>
        }
        else if(screenID == 108){
            return <ShiftDetails108 navigation={this.props.navigation} screenIDHandler={this.screenIDHandler}/>
        }
        else if(screenID == 109){
            return <ShiftDetails109 navigation={this.props.navigation} screenIDHandler={this.screenIDHandler}/>
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

