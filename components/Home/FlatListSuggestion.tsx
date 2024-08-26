import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import React, {useRef, useState} from 'react';

const {width} = Dimensions.get('window');

const FlatListSuggestion = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = [
    {
      id: 1,
      title: "Today's Feels Like Temperature",
      description: 'Humidity will make high feel like 110°F',
    },
    {
      id: 2,
      title: 'Suggestion 2',
      description: 'Description 2',
    },
    {
      id: 3,
      title: 'Suggestion 3',
      description: 'Description 3',
    },
  ];

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        // bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor:
                  index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 150,
    maxHeight: 150,
    width: width * 0.91,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  itemContainer: {
    padding: 8,
    height: '90%',
    width: width * 0.845,
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  title: {
    color: 'white',
    fontSize: width * 0.05,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  description: {
    color: 'white',
    fontSize: width * 0.036,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 5,
  },
});

export default FlatListSuggestion;
