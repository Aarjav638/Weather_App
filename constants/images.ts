import {ImageSourcePropType} from 'react-native';

// Defining the ImageInterface type
type ImageInterface = {
  logo?: ImageSourcePropType;
  cloudyWeather?: ImageSourcePropType;
  sunnyWeather?: ImageSourcePropType;
  sunnyWeather1?: ImageSourcePropType;
  cloudy2?: ImageSourcePropType;
};

type OnBoardingImageInterface = {
  id: number;
  image: ImageSourcePropType;
};

// Exporting images for use
export const Images: ImageInterface = {
  logo: require('../assets/cloudy.png'),
  cloudyWeather: require('../assets/cloudyWeather.jpg'),
  sunnyWeather: require('../assets/sunny.jpg'),
  sunnyWeather1: require('../assets/sunny1.jpg'),
  cloudy2: require('../assets/cloudy2.png'),
};

export const OnBoardingImages: OnBoardingImageInterface[] = [
  {
    id: 1,
    image: require('../assets/cloudy.png'),
  },
  {
    id: 2,
    image: require('../assets/cloudy2.png'),
  },
  {
    id: 3,
    image: require('../assets/cloudy3.png'),
  },
  {
    id: 4,
    image: require('../assets/cloudy1.png'),
  },
];
