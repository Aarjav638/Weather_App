import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import Dropdown from '../components/Dropdown';

export type Items = {
  label: string;
  value: string;
};

const Settings = () => {
  const [openTemperature, setOpenTemperature] = useState(false);
  const [valueTemperature, setValueTemperature] = useState('Celcius');
  const [temperatureItems, setTemperatureItems] = useState<Items[]>([
    {label: 'Celcius', value: 'Celcius(`C)'},
    {label: 'Fahrenheit', value: 'Fahrenheit(`F)'},
  ]);

  const [openWind, setOpenWind] = useState(false);
  const [windValue, setWindValue] = useState('Kilometers per hour');
  const [windItems, setWindItems] = useState<Items[]>([
    {label: 'Miles', value: 'Miles per hour'},
    {label: 'Kilometers', value: 'Kilometers per hour'},
    {label: 'Meters', value: 'Meters per second'},
  ]);

  const [openAir, setOpenAir] = useState(false);
  const [airValue, setAirValue] = useState('Hectopascal');
  const [airItems, setAirItems] = useState<Items[]>([
    {label: 'Hectopascals', value: 'Hectopascals'},
    {label: 'Millimeters of mercury', value: 'Millimeters of mercury'},
    {label: 'Inches of Mercury', value: 'Inches of Mercury'},
    {label: 'Millibars', value: 'Millibars'},
  ]);

  const [openVisible, setOpenVisible] = useState(false);
  const [visibleValue, setVisibleValue] = useState('Kilometers');
  const [visibleItems, setVisibleItems] = useState<Items[]>([
    {label: 'Kilometers', value: 'kilometers'},
    {label: 'Miles', value: 'Miles'},
    {label: 'Metres', value: 'Metres'},
    {label: 'Feet', value: 'Feet'},
  ]);

  const closeAllDropdowns = () => {
    setOpenTemperature(false);
    setOpenWind(false);
    setOpenAir(false);
    setOpenVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeAllDropdowns}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          {/* Temperature Dropdown */}
          <View style={{zIndex: openTemperature ? 3000 : 1}}>
            <TouchableOpacity
              style={styles.container}
              onPress={() => {
                setOpenTemperature(!openTemperature);
                setOpenWind(false);
                setOpenAir(false);
                setOpenVisible(false);
              }}>
              <View style={styles.dropdownStyle}>
                <Text style={styles.textLeft}>Temperature</Text>
                {openTemperature ? (
                  <Dropdown
                    open={openTemperature}
                    setOpen={setOpenTemperature}
                    value={valueTemperature}
                    setValue={setValueTemperature}
                    items={temperatureItems}
                    setItems={setTemperatureItems}
                  />
                ) : (
                  <Text style={styles.textRight}>{valueTemperature}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.separator} />

          {/* Wind Dropdown */}
          <View style={{zIndex: openWind ? 3000 : 1}}>
            <TouchableOpacity
              style={styles.container}
              onPress={() => {
                setOpenWind(!openWind);
                setOpenTemperature(false);
                setOpenAir(false);
                setOpenVisible(false);
              }}>
              <View style={styles.dropdownStyle}>
                <Text style={styles.textLeft}>Wind</Text>
                {openWind ? (
                  <Dropdown
                    open={openWind}
                    setOpen={setOpenWind}
                    value={windValue}
                    setValue={setWindValue}
                    items={windItems}
                    setItems={setWindItems}
                  />
                ) : (
                  <Text style={styles.textRight}>{windValue}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.separator} />

          {/* Air Pressure Dropdown */}
          <View style={{zIndex: openAir ? 3000 : 1}}>
            <TouchableOpacity
              style={styles.container}
              onPress={() => {
                setOpenWind(false);
                setOpenTemperature(false);
                setOpenAir(!openAir);
                setOpenVisible(false);
              }}>
              <View style={styles.dropdownStyle}>
                <Text style={styles.textLeft}>Air pressure</Text>
                {openAir ? (
                  <Dropdown
                    open={openAir}
                    setOpen={setOpenAir}
                    value={airValue}
                    setValue={setAirValue}
                    items={airItems}
                    setItems={setAirItems}
                  />
                ) : (
                  <Text style={styles.textRight}>{airValue}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.separator} />

          {/* Visibility Dropdown */}
          <View style={{zIndex: openVisible ? 3000 : 1}}>
            <TouchableOpacity
              style={styles.container}
              onPress={() => {
                setOpenWind(false);
                setOpenTemperature(false);
                setOpenAir(false);
                setOpenVisible(!openVisible);
              }}>
              <View style={styles.dropdownStyle}>
                <Text style={styles.textLeft}>Visibility</Text>
                {openVisible ? (
                  <Dropdown
                    open={openVisible}
                    setOpen={setOpenVisible}
                    value={visibleValue}
                    setValue={setVisibleValue}
                    items={visibleItems}
                    setItems={setVisibleItems}
                  />
                ) : (
                  <Text style={styles.textRight}>{visibleValue}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
  textLeft: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    width: '40%',
    backgroundColor: 'white',
  },
  textRight: {
    fontSize: 14,
    color: 'grey',
    fontFamily: 'Poppins-Medium',
    width: '60%',
    textAlign: 'right',
  },
  mainContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: 'grey',
    width: '90%',
    alignSelf: 'center',
  },
  dropdownStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    maxHeight: 40,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 26,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 50,
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
