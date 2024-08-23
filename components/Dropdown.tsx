import DropDownPicker from 'react-native-dropdown-picker';
import React from 'react';
import { Items } from '../screens/Settings';
import { StyleSheet, View, Image} from 'react-native';


const Dropdown = ({ open, setOpen, value, setValue, items, setItems }: {
    open: boolean,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    items: Items[],
    setItems: React.Dispatch<React.SetStateAction<Items[]>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}) => {

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={
                styles.container

            }
            dropDownContainerStyle={styles.dropDownContainer}


            selectedItemLabelStyle={styles.selectedItemLabel}

            listItemLabelStyle={styles.listItemLabel}

            // eslint-disable-next-line react/no-unstable-nested-components
            TickIconComponent={() => (
                <View>
                    <Image source={require('../assets/check.png')} style={styles.image} resizeMode="contain" />
                </View>
            )}

        />

    );
};

const styles = StyleSheet.create({
    container: {
        width: '50%',
        borderWidth: 0,
        shadowColor: 'black',
        elevation: 5,
        zIndex: 2000,  // Ensure dropdown is above everything else
        backgroundColor: 'white',
    },
    dropDownContainer: {
        backgroundColor: 'white',
        width: '50%',
        borderWidth: 0,
        shadowColor: 'black',
        elevation: 20,
        zIndex: 3000, // Higher than the dropdown itself
        // position: 'absolute',
        //top: 50, // Adjust to prevent overlap with TouchableOpacity
    },
    image: {
        width: 15,
        height: 15,
    },
    selectedItemLabel: {
        color: 'black',
    },
    listItemLabel: {
        color: 'grey',
    },


});


export default Dropdown;
