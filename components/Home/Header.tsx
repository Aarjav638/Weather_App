import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

import {NavigationProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Badge} from 'react-native-paper';
const Header = ({
  navigation,
  city,
}: {
  navigation: NavigationProp<any>;
  city: string;
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.HeaderText}>
        {city} <Icon name="location" size={20} color="white" />
      </Text>
      <View style={styles.iconView}>
        <View style={styles.notification}>
          <Icon
            onPress={() => console.log('Notifications')}
            name="notifications"
            size={25}
            color="white"
          />
          <Badge style={styles.badge} size={15}>
            3
          </Badge>
        </View>
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
    width: '60%',
    letterSpacing: 1,
  },
  iconView: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'red',
    position: 'relative',
    left: -28,
    top: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification: {
    flexDirection: 'row',
  },
});
export default Header;
