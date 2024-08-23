import {ImageSourcePropType} from 'react-native';

// Defining the ImageInterface type
type ImageInterface = {
  logo?: ImageSourcePropType;
};

// Exporting images for use
export const Images: ImageInterface = {
  logo: require('../assets/cloudy.png'),
};

export const OnBoardingImages: ImageSourcePropType[] = [
  require('../assets/cloudy.png'),
  require('../assets/cloudy1.png'),
  require('../assets/cloudy2.png'),
  require('../assets/cloudy3.png'),
];
