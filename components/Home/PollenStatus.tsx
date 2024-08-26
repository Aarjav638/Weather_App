import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const PollenStatus = () => {
  const [show, setShow] = React.useState(false);
  const rotate = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  React.useEffect(() => {
    Animated.timing(rotate, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [show, rotate, slideAnim]);

  const animatedHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });
  return (
    <TouchableOpacity
      onPress={() => setShow(!show)}
      activeOpacity={1}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...styles.mainContainer,
        borderRadius: show ? 10 : 25,
        gap: show ? 10 : 0,
      }}>
      <View style={styles.insideContainer}>
        <Icon name="flower" size={20} color="white" />
        <View>
          <Text style={styles.text}>Very High Pollen Count</Text>
        </View>
        <Animated.View
          style={[styles.dropDownIcon, {transform: [{rotate: spin}]}]}>
          <Icon
            name="chevron-down"
            size={20}
            color="white"
            onPress={() => setShow(!show)}
          />
        </Animated.View>
      </View>
      <Animated.View
        style={{
          height: animatedHeight,
        }}>
        {show && (
          <View style={styles.hiddenView}>
            <Icon name="alert-circle" size={20} color="white" />
            <Text style={styles.insideText}>
              Pollen count is very high today. It is recommended to stay indoors
              and avoid going outside.
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default PollenStatus;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    flex: 0.05,
    paddingHorizontal: 20,
    marginVertical: '4%',
  },
  insideContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dropDownIcon: {
    flex: 0.2,
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  insideText: {
    color: 'white',
    textAlign: 'justify',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 10,
  },
  hiddenView: {flexDirection: 'row'},
});
