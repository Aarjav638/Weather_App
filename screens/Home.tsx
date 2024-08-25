import {StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Home/Header';
import {NavigationProp} from '@react-navigation/native';

const Home = ({navigation}: {navigation: NavigationProp<any>}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'skyblue',
  },
});
export default Home;
