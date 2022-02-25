/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';

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
  Linking,
  Share,
} from 'react-native';

import { Icon } from 'react-native-elements';
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

import imageBG from './img/FondoApp3-01.jpg';
import imageRotate from './img/giratoria.png';
import imgNotification from './img/PiezzaApp2-01.jpg';

const App: () => Node = () => {

  let rotateValueHolder = new Animated.Value(0);
  const RotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const startImageRotateFunction = () => {
    rotateValueHolder.setValue(0);
    Animated.timing(rotateValueHolder, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => startImageRotateFunction());
  };
  startImageRotateFunction();

  const start = async () => {
      // Set up the player
      await TrackPlayer.setupPlayer({
        //sstopWithApp: true,
      });

      TrackPlayer.updateOptions({
        // Media controls capabilities
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

      TrackPlayer.setVolume(0.4);
  };
  start();

  const onShare = async () => {

    let  urlShare = 'https://play.google.com/store/apps/details?id=com.skp.cundinamarca123&hl=es_CO&gl=US';
    if (Platform.OS == 'ios') urlShare = 'https://www.apple.com/co/app-store/';
    try {
      const result = await Share.share({
        message: urlShare,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imageBG} resizeMode="cover" style={styles.image}>
      <Animated.Image
          style={{
            bottom:'10%',
            left: '10%',
            width: 200,
            height: 200,
            transform: [{ rotate: RotateData }],
          }}
          source={imageRotate}
      />

      <Icon
          reverse
          name='facebook'
          type='font-awesome'
          color='#4267B2'
          onPress={() => Linking.openURL('https://google.com')} />
      <Icon
          reverse
          name='whatsapp'
          type='font-awesome'
          color='#25D366'
          onPress={() => Linking.openURL('whatsapp://send?phone=+573003461962')} />
      <Icon
          reverse
          name='phone'
          type='font-awesome'
          color='#FF5A5F'
          onPress={() => Linking.openURL(`tel:3003461962`)} />
      <Icon
          reverse
          name='share-alt'
          type='font-awesome'
          color='#0F9D58'
          onPress={onShare} />
      <Icon
          reverse
          name='web'
          type='foundation'
          onPress={() => Linking.openURL('http://www.eldoradoradio.co/inicio')} />

      </ImageBackground>

    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: '125%',
    height:'103%'
  },
  icoFB:{
    alignItems:'baseline'
  }
});

export default App;
