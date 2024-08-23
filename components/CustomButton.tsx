import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';

const CustomButton = ({
  title,
  isLoading,
  textStyles,
  imageStyles,
  icon,
  containerStyles,
  onPress,
}: {
  title: string;
  isLoading: boolean;
  textStyles?: object;
  imageStyles?: object;
  icon?: ImageSourcePropType;
  containerStyles?: object;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[containerStyles, styles.container]}
      disabled={isLoading}>
      <Text style={[textStyles, styles.text]}>{title}</Text>
      {icon && <Image source={icon} style={[styles.image, imageStyles]} />}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'teal',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 20,
    height: 20,
    objectFit: 'contain',
    tintColor: 'white',
  },
  text: {
    fontSize: 18,
  },
});
export default CustomButton;
