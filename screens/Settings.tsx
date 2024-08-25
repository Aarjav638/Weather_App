import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import DropdownSection from '../components/Settings/DropDownSection';
export type Items = {
  label: string;
  value: string;
};

const Settings = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [valueTemperature, setValueTemperature] = useState('Celsius');
  const [valueWind, setWindValue] = useState('Kilometers per hour');
  const [valueAir, setAirValue] = useState('Hectopascal');
  const [valueVisible, setVisibleValue] = useState('Kilometers');

  const temperatureItems: Items[] = [
    {label: 'Celsius', value: 'Celsius(`C)'},
    {label: 'Fahrenheit', value: 'Fahrenheit(`F)'},
  ];

  const windItems: Items[] = [
    {label: 'Miles', value: 'Miles per hour'},
    {label: 'Kilometers', value: 'Kilometers per hour'},
    {label: 'Meters', value: 'Meters per second'},
  ];

  const airItems: Items[] = [
    {label: 'Hectopascals', value: 'Hectopascals'},
    {label: 'Millimeters of mercury', value: 'Millimeters of mercury'},
    {label: 'Inches of Mercury', value: 'Inches of Mercury'},
    {label: 'Millibars', value: 'Millibars'},
  ];

  const visibleItems: Items[] = [
    {label: 'Kilometers', value: 'kilometers'},
    {label: 'Miles', value: 'Miles'},
    {label: 'Metres', value: 'Metres'},
    {label: 'Feet', value: 'Feet'},
  ];

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };

  const handleDropdownPress = (dropdown: string) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  };

  return (
    <TouchableWithoutFeedback onPress={closeAllDropdowns}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          <DropdownSection
            label="Temperature"
            value={valueTemperature}
            items={temperatureItems}
            isOpen={openDropdown === 'temperature'}
            onOpen={() => handleDropdownPress('temperature')}
            setValue={setValueTemperature}
          />
          <DropdownSection
            label="Wind"
            value={valueWind}
            items={windItems}
            isOpen={openDropdown === 'wind'}
            onOpen={() => handleDropdownPress('wind')}
            setValue={setWindValue}
          />
          <DropdownSection
            label="Air pressure"
            value={valueAir}
            items={airItems}
            isOpen={openDropdown === 'air'}
            onOpen={() => handleDropdownPress('air')}
            setValue={setAirValue}
          />
          <DropdownSection
            label="Visibility"
            value={valueVisible}
            items={visibleItems}
            isOpen={openDropdown === 'visibility'}
            onOpen={() => handleDropdownPress('visibility')}
            setValue={setVisibleValue}
            showSeparator={false} // No separator after visibility
          />
        </View>
        <TouchableOpacity style={styles.aboutContainer}>
          <Text style={styles.aboutText}>About</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
    backgroundColor: 'lightskyblue',
  },
  mainContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 1,
  },
  aboutContainer: {
    marginTop: 50,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#efefef',
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
  },
});

export default Settings;
