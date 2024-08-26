import { View, Text, StyleSheet, FlatList, ImageSourcePropType } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import { Images } from '../../constants/images';

const DATA = [
    {
        id: '1',
        time: '10:00 AM',
        image: Images.cloudy2,
        temperature: '31',
    },
    {
        id: '2',
        time: '12:00 AM',
        image: Images.cloudy2,
        temperature: '35',
    },
    {
        id: '3',
        time: '2:00 AM',
        image: Images.cloudy2,
        temperature: '31',
    },
    {
        id: '4',
        time: '4:00 AM',
        image: Images.cloudy2,
        temperature: '31',
    },
    {
        id: '5',
        time: '6:00 AM',
        image: Images.cloudy2,
        temperature: '31',
    },
    {
        id: '6',
        time: '8:00 AM',
        image: Images.cloudy2,
        temperature: '26',
    },

    {
        id: '7',
        time: '6:00 AM',
        image: Images.cloudy2,
        temperature: '31',
    },

    {
        id: '8',
        time: '6:00 AM',
        image: Images.cloudy2,
        temperature: '31',
    },
];

type ItemProps = { time: string, image: ImageSourcePropType | undefined, temperature: string };

const Item = ({ time, image, temperature }: ItemProps) => (

    <View style={styles.container} >

        <Text style={styles.timetext}>{time}</Text>
        <Image source={image} style={styles.image} />
        <Text style={styles.text}>{temperature}°</Text>

    </View>
);

const HorizontalWeatherDetails = () => {


    return (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', maxHeight: 100, minHeight: 100, flex: 0.2, borderRadius: 10 }}>
            <FlatList
                data={DATA}
                horizontal
                renderItem={({ item }) => <Item time={item.time} image={item.image} temperature={item.temperature} />}
                keyExtractor={item => item.id}
            />
        </View>

    );
};

const styles = StyleSheet.create({
    image: {
        height: 18,
        width: 18,

    },
    container: {
        justifyContent: 'center',
        padding: 8.5,
        alignItems: 'center',
        gap: 5,


    },
    text: {
        color: 'white',
        fontSize:14,
        fontFamily:'Poppins-SemiBold',
    },
    timetext: { 
        color: 'white',
        fontSize:10,
        fontFamily:'Poppins-Regular',
    },
});

export default HorizontalWeatherDetails;
