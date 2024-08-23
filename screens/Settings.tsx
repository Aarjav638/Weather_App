import { Text, StyleSheet, SafeAreaView, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Dropdown from '../components/Dropdown';

export type Items = {
    label: string,
    value: string,
}

const Settings = () => {

    const [openTemperature, setOpenTemperature] = useState(false);
    const [valueTemperature, setValueTemperature] = useState('Celcius');
    const [temperatureItems, setTemperatureItems] = useState<Items[]>([
        { label: 'Celcius', value: 'Celcius(`C)' },
        { label: 'Fahrenheit', value: 'Fahrenheit(`F)' }
    ]);

    const [openWind, setOpenWind] = useState(false);
    const [windValue, setWindValue] = useState('Kilometers per hour');
    const [windItems, setWindItems] = useState<Items[]>([
        { label: 'Miles', value: 'Miles per hour' },
        { label: 'Kilometers', value: 'Kilometers per hour' },
        { label: 'Meters', value: 'Meters per second' },
    ]);

    const [openAir, setOpenAir] = useState(false);
    const [AirValue, setAirValue] = useState('Hectopascal');
    const [AirItems, setAirItems] = useState<Items[]>([
        { label: 'Hectopascals', value: 'Hectopascals' },
        { label: 'Millimeters of mercury', value: 'Millimeters of mercury' },
        { label: 'Inches of Mercury', value: 'Inches of Mercury' },
        { label: 'Millibars', value: 'Millibars' },
    ]);

    const [openVisible, setOpenvisible] = useState(false);
    const [visibleValue, setVisibleValue] = useState('Kilometers');
    const [visibleItems, setVisibleItems] = useState<Items[]>([
        { label: 'Kilometers', value: 'kilometers' },
        { label: 'Miles', value: 'Miles' },
        { label: 'Metres', value: 'Metres' },
        { label: 'Feet', value: 'Feet' },
    ]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.heading}>Settings</Text>
            <View style={styles.mainContainer}>
                {/* Temperature Dropdown */}
                <View style={{ zIndex: openTemperature ? 3000 : 1 }}>
                    <TouchableOpacity style={styles.container} onPress={() => { setOpenTemperature(!openTemperature); setOpenWind(false); setOpenAir(false) }}>
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

                <Text style={styles.line} />

                {/* Wind Dropdown */}
                <View style={{ zIndex: openWind ? 3000 : 1 }}>
                    <TouchableOpacity style={styles.container} onPress={() => { setOpenWind(!openWind); setOpenTemperature(false); setOpenAir(false); }}>
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

                <Text style={styles.line} />

                {/* Other fields */}
                <View style={{ zIndex: openAir ? 3000 : 1 }}>
                    <TouchableOpacity style={styles.container} onPress={() => { setOpenWind(false); setOpenTemperature(false); setOpenAir(!openAir); }}>

                        <View style={styles.dropdownStyle}>
                            <Text style={styles.textLeft}>Air pressure</Text>
                            {openAir ? (
                                <Dropdown
                                    open={openAir}
                                    setOpen={setOpenAir}
                                    value={AirValue}
                                    setValue={setAirValue}
                                    items={AirItems}
                                    setItems={setAirItems}
                                />
                            ) : (
                                <Text style={styles.textRight}>{AirValue}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.line} />
                <View style={{ zIndex: openVisible ? 3000 : 1 }}>
                    <TouchableOpacity style={styles.container} onPress={() => { setOpenWind(false); setOpenTemperature(false); setOpenAir(false); setOpenvisible(!openVisible) }}>

                        <View style={styles.dropdownStyle}>
                            <Text style={styles.textLeft}>Visibility</Text>
                            {openVisible ? (
                                <Dropdown
                                    open={openVisible}
                                    setOpen={setOpenvisible}
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
        padding: 20,
        borderRadius: 10,
        zIndex: 1, // Ensure base zIndex is low
    },
    textLeft: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        width: '50%',
        backgroundColor: 'white',
    },
    textRight: {
        fontSize: 16,
        color: 'black',
    },
    mainContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        zIndex: 1, // Base zIndex of main container
    },
    line: {
        height: '0.2%',
        backgroundColor: 'grey',
        width: '100%',
    },
    dropdownStyle: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    heading: {
        fontSize: 26,
        color: 'grey',
        fontWeight: 'bold',
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
