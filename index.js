/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Settings from './screens/Settings';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Settings);
