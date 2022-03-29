import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    StatusBar,
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Carousel from 'react-native-snap-carousel';
const {height, width} = Dimensions.get('window');

export default class Tutorial030 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentSlide: 0,
            tutorialData : [
                {tutorialImage: require('../../assets/images/tutorialPlaceholder_logo.png')},
                {tutorialImage: require('../../assets/images/tutorialPlaceholder_logo.png')},
                {tutorialImage: require('../../assets/images/tutorialPlaceholder_logo.png')},
            ]
        }
    }

    moveNext(){
        this.setState({
            currentSlide: this.state.currentSlide + 1,
        });
    }

    moveBack(){
        if(this.state.currentSlide > 0) {
            this.setState({
                currentSlide : this.state.currentSlide - 1,
            });
        }
    }

    renderTutorial(item) {
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Image source={item.tutorialImage} style={{height: 250, resizeMode: 'contain'}} />
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

    renderDots(activeIndex) {
        let currentSlide = this.state.currentSlide
        const activeDot = require('../../assets/icons/dot-active.png');
        const inactiveDot = require('../../assets/icons/dot-inactive.png');
        const sizeActive = 10
        const imageActive = this.renderCarousel(activeDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        const imageInactive = this.renderCarousel(inactiveDot, {width: sizeActive, height: sizeActive, resizeMode: 'contain', margin: 5})
        if(currentSlide == 0){
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {imageActive}
                    {imageInactive}
                    {imageInactive}
                </View>
            )
        }
        if(currentSlide == 1){
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {imageInactive}
                    {imageActive}
                    {imageInactive}
                </View>
            )
        }
        if(currentSlide == 2){
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {imageInactive}
                    {imageInactive}
                    {imageActive}
                </View>
            )
        }
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 30}}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', marginStart: 10}}>
                            {this.state.currentSlide != 0 &&
                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                                                  onPress={()=>{this.moveBack()}}>
                                    <Image source={require('../../assets/icons/back_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                                    <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginStart: 5}}>Back</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{flex: 1, width: width - width*0.3, alignItems: 'center', justifyContent: 'center'}}>
                            {this.renderDots(this.state.currentSlide)}
                        </View>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 20}}
                                          onPress={()=>{this.props.navigation.navigate('Registration050')}}>
                            <Text style={{fontFamily: 'HelveticaNeue-Medium', color: '#007AFF', fontSize: 17, marginEnd: 5}}>Skip</Text>
                            <Image source={require('../../assets/icons/next_arrow.png')} style={{resizeMode: 'contain', width: 20, height: 20}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"center",width:"100%", flex:1}}>
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.tutorialData}
                            sliderWidth={width}
                            itemWidth={width}
                            inactiveSlideOpacity={0.0}
                            inactiveSlideScale={0.7}
                            firstItem={this.state.currentSlide}
                            enableMomentum={true}
                            swipeThreshold={5}
                            renderItem={({item, index})=>{
                                return this.renderTutorial(item)
                            }}
                            onSnapToItem={(slideIndex)=>{
                                this.setState({
                                    currentSlide: slideIndex
                                })
                            }}/>
                    </View>
                    <View style={styles.navigationButtonsContainer}>
                        <TouchableOpacity 
                            style={styles.navigationButton}
                            onPress={()=>{
                                if(this.state.currentSlide == 2){
                                    this.props.navigation.navigate('Registration050')
                                }
                                else this.moveNext();
                            }}>
                            <Text style={{fontFamily: 'HelveticaNeue-Light', fontSize: 16, color: '#fff'}}>Next</Text>
                        </TouchableOpacity>
                    </View>
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
        alignItems: 'center',
        justifyContent: "flex-start",
    },
    navigationButtonsContainer:{
        position: 'absolute',
        bottom: 70,
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
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

