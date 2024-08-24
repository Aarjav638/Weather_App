import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationProp} from '@react-navigation/native';

const Home = ({navigation}: {navigation: NavigationProp<any>}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.HeaderText}>Home</Text>
        <View style={styles.iconView}>
          <Icon
            onPress={() => console.log('Notifications')}
            name="notifications"
            size={25}
            color="white"
          />
          <Icon
            onPress={() => navigation.navigate('Manage Cities')}
            name="reader-outline"
            size={25}
            color="white"
          />
          <Icon
            onPress={() => navigation.navigate('Settings')}
            name="cog"
            size={30}
            color="white"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'skyblue',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeaderText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  iconView: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
  },
});
export default Home;
