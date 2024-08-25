import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

import {NavigationProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
const Header = ({navigation}: {navigation: NavigationProp<any>}) => {
  return (
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
  );
};
const styles = StyleSheet.create({
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
export default Header;
