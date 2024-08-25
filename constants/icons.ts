import {ImageSourcePropType} from 'react-native';

interface ImageInterface {
  arrow: ImageSourcePropType;
  check: ImageSourcePropType;
}
export const Icons: ImageInterface = {
  arrow: require('../assets/right-arrow.png'),
  check: require('../assets/check.png'),
};
