import {Dimensions, FlatList, Image, StyleSheet, View} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {OnBoardingImages} from '../../constants/images';

const AppInstructions = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        currentIndex + 1 < OnBoardingImages.length ? currentIndex + 1 : 0;

      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={OnBoardingImages}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={({item}) => (
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        onScrollToIndexFailed={() => {
          flatListRef.current?.scrollToIndex({index: 0, animated: true});
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.5,
  },
});

export default AppInstructions;
