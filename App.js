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
} from 'react-native';

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
          artwork: 'https://i.scdn.co/image/e5c7b168be89098eb686e02152aaee9d3a24e5b6',
      });

      // Start playing it
      await TrackPlayer.play();

      TrackPlayer.setVolume(0.4);
  };
  start();

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
  }
});

export default App;
