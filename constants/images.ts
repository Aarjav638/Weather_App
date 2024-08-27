import {ImageSourcePropType} from 'react-native';

// Defining the ImageInterface type
type ImageInterface = {
  logo?: ImageSourcePropType;
  cloudyWeather?: ImageSourcePropType;
  sunnyWeather?: ImageSourcePropType;
  sunnyWeather1?: ImageSourcePropType;
  cloudy2?: ImageSourcePropType;
  cloudy?: ImageSourcePropType;
  cloudy3?: ImageSourcePropType;
  Rainy?: ImageSourcePropType;
  stormy?: ImageSourcePropType;
};

type OnBoardingImageInterface = {
  id: number;
  image: ImageSourcePropType;
};

// Exporting images for use
export const Images: ImageInterface = {
  logo: require('../assets/cloudy.png'),
  cloudy: require('../assets/cloudy.png'),
  cloudyWeather: require('../assets/cloudyWeather.jpg'),
  sunnyWeather: require('../assets/sunny.jpg'),
  sunnyWeather1: require('../assets/sunny1.jpg'),
  cloudy2: require('../assets/cloudy2.png'),
  cloudy3: require('../assets/cloudy3.png'),
  Rainy: require('../assets/RainyWeather.jpg'),
  stormy: require('../assets/stormy.jpg'),
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
