/**
 * https://github.com/facebook/react-native
 */

import React,{ Component, useState } from 'react';

import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,Animated,Easing,ImageBackground,Alert,
} from 'react-native';

import { Slider,Icon } from 'react-native-elements';
//LISTADO ICONOS https://oblador.github.io/react-native-vector-icons/

import {Colors,DebugInstructions,Header,LearnMoreLinks,ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import TrackPlayer, {
  Capability,Event,RepeatMode,State,usePlaybackState,useProgress,useTrackPlayerEvents,
} from 'react-native-track-player';

import { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";

import Spinner from 'react-native-loading-spinner-overlay';

import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from 'react-native-splash-screen'

import messaging from '@react-native-firebase/messaging';

import MenuConnect from './src/components/MenuConnect';
//import ControlVolumen from './src/components/ControlVolumen';
import imageBG from './img/FondoApp7-01.jpg';
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
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.state = {
      volue: 99,
      reproduccion: true,
      //spinner: false,
    };
  }

  componentDidMount() {
    console.log('Registro - evento didMount');
    SplashScreen.hide();
    this.start();                     //Inicia Audio
    this.startImageRotateFunction();  //Inicia Animación
    this.setVol(100);

    // PlaybackState event listener
    TrackPlayer.addEventListener(Event.PlaybackState, event => {
      if (event.state === State.Playing) {
          // When playing set userDidPause to false
          this.setState({reproduccion: true});
          //this.setState({spinner: false});
      }
      else if (event.state === State.Paused) {
        this.setState({reproduccion: false});
          //IF NOT PAUSED BY THE USER (IN CASE OF ISSUE) FORCE RETRY
          if (this.userDidPause === false) {
              TrackPlayer.play();
              this.setState({reproduccion: true});
              //this.setState({spinner: false});
          }
      }
    })

    this.requestUserPermission();

  }
  componentWillUnmount() {
    console.log('Registro - evento UNMount');
  }

  setVol(volValue){  //console.log(someValue);
    if(this.state.volue != volValue){
      this.setState({volue: volValue});   //console.log(this.state.volue);
      let valcalulado = this.state.volue/100;  //console.log(valcalulado);
      TrackPlayer.setVolume(valcalulado);
      this.color();
    }
  };

/*************** COLOR CONTROL VOLUMEN ***************/
  interpolate (start, end) {
    let k = (this.state.volue - 0) / 100; // 0 =>min  && 10 => MAX
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
  async start  () { console.log("Start");
    this.setState({reproduccion: true});
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

  async pause  () { console.log("Pause");
    await TrackPlayer.pause();
  };
/**********************************************************/

/******************** NOTIFICACIONES PUSH ********************/
async requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    if(authStatus==1){
      this.VerificaSuscripcion();
    }
  }
}

async VerificaSuscripcion () {
  console.log('Verifica suscripcion');
  try {
    const suscrito = await AsyncStorage.getItem('@suscrito'); console.log('suscrito: ' + suscrito);
    if (suscrito == null) {
      messaging().subscribeToTopic('CUNDINAMARCA').then(() => console.log('Subscribed to CUNDINAMARCA!')).catch((error) => {console.log(error)});
      this.setLocalstorage('@suscrito', 'S');
    }

    this.createNotificationListenerFOREGROUND();
    this.createNotificationListenerBACKGROUND();
    this.getInitialNotification();
    this.createNotificationListenerGB();
    this.checkNotificacionPush();
  } catch (e) {
    console.log(e);
    // error reading value
  }
};

async createNotificationListenerFOREGROUND() {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('Nuevo Mensaje PRIMER PLANO!', JSON.stringify(remoteMessage));

      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);

  });
}

async createNotificationListenerBACKGROUND(){
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('++++++++++++++++++++++++Message handled in the background!', remoteMessage);
  });
}

async getInitialNotification() {
  // When a user tap on a push notification and the app is CLOSED
  messaging().getInitialNotification().then((remoteMessage) => {
    if (remoteMessage) {
      console.log('///////////////////++App Closed Push Notification opened!', remoteMessage);
      if(remoteMessage.data.url!=""){
        Alert.alert(
          remoteMessage.notification.title,
          remoteMessage.notification.body,
          [
            /*{
              text: "Cancelar",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },*/
            { text: "ok", onPress: () => {
              console.log(`getInitialNotification OK`);
              /*const supported = Linking.canOpenURL(remoteMessage.data.url);

              if (supported) {
                Linking.openURL(remoteMessage.data.url);
              } else {
                console.log(`Don't know how to open this URL: ${remoteMessage.data.url}`);
              }*/
            } 
          }
          ],
          { cancelable: false }
        );
      } else{
        Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
      }
    }
  });
}

async createNotificationListenerGB() {
  const unsubscribe = messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log('---------------------------Background Push Notification opened', JSON.stringify(remoteMessage));
    console.log("URL: " + remoteMessage.data.url);

    if(remoteMessage.data.url!=""){
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          { text: "Ok", onPress: () => {
              console.log(`createNotificationListenerGB OK`);
            } 
          }
        ],
        { cancelable: false }
      );
    } else{
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    }


  });
}

checkNotificacionPush = async () => {
  const msjPush = await AsyncStorage.getItem('@push');
  console.log("****************************push: " + msjPush);
}
/**********************************************************/

setLocalstorage = async (item, valor) => {
  console.log(item + ' ' + valor);
  await AsyncStorage.setItem(item, valor);
};

  render () { //console.log('Renderiza Registro');
    return (
      <View style={styles.container}>
        <ImageBackground source={imageBG} resizeMode="cover" style={styles.imageBG}>

        <Animated.Image
            style={{
              top: '5%',
              width: 200,
              height: 200,
              transform: [{ rotate: RotateData }],
            }}
            source={imageRotate}
        />

        <MenuConnect ></MenuConnect>

        <View style={[styles.contentVol]}>
          <Slider
            value={this.state.volue}
            onValueChange={(volValue) => this.setVol(volValue)}
            maximumValue={100}
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

        <View style={styles.icono}>
          {this.state.reproduccion == true ? (
            <Icon
            name='pause'
            type='foundation'
            color='#d2ab62'
            size={55}
            onPress={this.pause} />
          ) :
            <Icon
            name='play'
            type='font-awesome'
            color='#d2ab62'
            size={55}
            onPress={this.start} />
          }
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
  contentVol: {
      top:'5%',
      width:'80%',
  },
  imageBG: {
    justifyContent: "center",
    alignItems: 'center',
    width: '100%',
    height:'100%',
  },
  icono:{
    top:'10%',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

export default App;
