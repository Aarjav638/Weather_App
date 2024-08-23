import {Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 24}}>Home</Text>
    </SafeAreaView>
  );
};

export default Home;
