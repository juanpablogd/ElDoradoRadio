/**
 * @format
 */

import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

//import SplashScreen from 'react-native-splash-screen'
//SplashScreen.show();

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('handled in the background when app close and kill...', remoteMessage);
  });

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./service'));
