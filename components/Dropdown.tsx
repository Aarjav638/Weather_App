import DropDownPicker from 'react-native-dropdown-picker';
import React from 'react';
import {Items} from '../screens/Settings';
import {StyleSheet, View, Image} from 'react-native';
const TickIcon = () => {
  return (
    <View>
      <Image
        source={require('../assets/check.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};
const Dropdown = ({
  open,
  setOpen,
  value,
  setValue,
  items,
}: {
  open: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  items: Items[];
  setItems: React.Dispatch<React.SetStateAction<Items[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      placeholder={value}
      style={styles.container}
      dropDownContainerStyle={styles.dropDownContainer}
      showArrowIcon={false}
      selectedItemLabelStyle={styles.selectedItemLabel}
      listItemLabelStyle={styles.listItemLabel}
      TickIconComponent={TickIcon}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
    borderWidth: 0,
    shadowColor: 'black',
    elevation: 5,
    zIndex: 2000,
  },
  dropDownContainer: {
    backgroundColor: 'white',
    width: '50%',
    borderWidth: 0,
    shadowColor: 'black',
    elevation: 5,
    zIndex: 3000,
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
