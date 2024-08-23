/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
import OnBoarding from './screens/OnBoarding';
AppRegistry.registerComponent(appName, () => OnBoarding);
