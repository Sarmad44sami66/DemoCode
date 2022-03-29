import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import ProfileScreen200 from "../ProfileScreen200";
import ProfileScreen201 from "../ProfileScreen201";
import ProfileScreen202 from "../ProfileScreen202";
const {height, width} = Dimensions.get('window');

export default class ProfileScreen700 extends Component {
    constructor(props) {
        super(props);
        this.screenIDHandler = this.screenIDHandler.bind(this)
        this.state = {
            loading: false,
            screenID: 200,
        }
        this.screenFocusCount = 1
    }

    componentDidMount(){
        const { navigation } = this.props
        this.focusListener = navigation.addListener("didFocus", () => {
            this.screenFocusCount += 1
            this.screenIDHandler(200);
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
        if(screenID == 200){
            return <ProfileScreen200 navigation={this.props.navigation} focusCount={this.screenFocusCount} screenIDHandler={this.screenIDHandler}/>
        } else if (screenID == 201){
            return <ProfileScreen201 navigation={this.props.navigation} screenIDHandler={this.screenIDHandler}/>
        } else if (screenID == 202){
            return <ProfileScreen202 navigation={this.props.navigation} screenIDHandler={this.screenIDHandler}/>
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

