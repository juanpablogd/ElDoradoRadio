/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{ Component, useState } from 'react';
import {Node} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Animated,
  Easing,
  ImageBackground,

} from 'react-native';

import { Slider,Icon } from 'react-native-elements';
//LISTADO ICONOS https://oblador.github.io/react-native-vector-icons/

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import MenuConnect from './src/components/MenuConnect';
//import ControlVolumen from './src/components/ControlVolumen';
import imageBG from './img/FondoApp3-01.jpg';
import imageRotate from './img/giratoria.png';
import imgNotification from './img/PiezzaApp2-01.jpg';

/******************* ROTACIÓN IMAGEN *******************/
let rotateValueHolder = new Animated.Value(0);
let RotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
/********************************************************/

class App extends Component {
  constructor() {
    super();
    this.state = {
      volue: 5,
    };    
  }

  componentDidMount() {
    console.log('Registro - evento didMount');
    this.start();                     //Inicia Audio
    this.startImageRotateFunction();  //Inicia Animación 

  }

  setVol(volValue){  //console.log(someValue);
    this.setState({volue: volValue});  //console.log(this.state.volue);
    let valcalulado = this.state.volue/10; //console.log(valcalulado);
    TrackPlayer.setVolume(valcalulado);
    this.color();
  };

/*************** COLOR CONTROL VOLUMEN ***************/
  interpolate (start, end) {
    let k = (this.state.volue - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  color () { //console.log("Set Color");
    let r = this.interpolate(255, 0);
    let g = this.interpolate(0, 255);
    let b = this.interpolate(0, 0);
    return `rgb(${r},${g},${b})`;
  };
/**********************************************************/

/*************** ANIMACIÓN IMÁGEN ***************/
   startImageRotateFunction (){
    rotateValueHolder.setValue(0);
    Animated.timing(rotateValueHolder, {
      toValue: 1,
      duration: 1000*50,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => this.startImageRotateFunction());
  };
/**********************************************************/

/******************* AUDIO EMISORA *******************/
  async start  () {
      // Set up the player
      await TrackPlayer.setupPlayer({
        //sstopWithApp: true,
      });
      // Media controls capabilities
      TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
            Capability.Play,
            Capability.Pause,
        ],
        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [Capability.Play, Capability.Pause],

    });

      // Add a track to the queue
    await TrackPlayer.add({
          id: '80075298',
          url: 'http://51.81.49.98:8300/',
          title: 'El Dorado Radio',
          artist: 'Gobernación de Cundinamarca',
          artwork: imgNotification,
      });

      // Start playing it
      await TrackPlayer.play();

      
  };
  //TrackPlayer.setVolume(0.4);
/**********************************************************/


  render () {
    console.log('Renderiza Registro');
    return (
      <View style={styles.container}>
        <ImageBackground source={imageBG} resizeMode="cover" style={styles.image}>
        
        <Animated.Image
            style={{
              width: 200,
              height: 200,
              transform: [{ rotate: RotateData }],
            }}
            source={imageRotate}
        />

          <MenuConnect ></MenuConnect>

          <View style={[styles.contentView]}>
          <Slider
            value={this.state.volue}
            onValueChange={(volValue) => this.setVol(volValue)}
            maximumValue={10}
            minimumValue={0}
            step={1}
            allowTouchTrack
            trackStyle={{ height: 5, backgroundColor: 'transparent' }}
            thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
            thumbProps={{
              children: (
                <Icon
                  name="volume-down"
                  type="font-awesome"
                  size={20}
                  reverse
                  containerStyle={{ bottom: 20, right: 20 }}
                  color={this.color()}
                />
              ),
            }}
          />
        </View>

          
        </ImageBackground>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  contentView: {
      top:'1%',
      width:'80%',
      //justifyContent: 'center',
      //alignItems: 'stretch',
  },
  image: {
    justifyContent: "center",
    alignItems: 'center',
    width: '100%',
    height:'100%',
  }
});

export default App;
