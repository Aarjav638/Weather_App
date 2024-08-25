import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Items} from '../../screens/Settings';
import Dropdown from './Dropdown';
import React from 'react';
const DropdownSection = ({
  label,
  value,
  items,
  isOpen,
  onOpen,
  setValue,
  showSeparator = true,
}: {
  label: string;
  value: string;
  items: Items[];
  isOpen: boolean;
  onOpen: () => void | React.Dispatch<React.SetStateAction<any>>;
  setValue: (value: string) => void;
  showSeparator?: boolean;
}) => (
  // eslint-disable-next-line react-native/no-inline-styles
  <View style={{zIndex: isOpen ? 3000 : 1}}>
    <TouchableOpacity style={styles.container} onPress={onOpen}>
      <View style={styles.dropdownStyle}>
        <Text style={styles.textLeft}>{label}</Text>
        {isOpen ? (
          <Dropdown
            open={isOpen}
            setOpen={onOpen}
            value={value}
            setValue={setValue}
            items={items}
          />
        ) : (
          <Text style={styles.textRight}>{value}</Text>
        )}
      </View>
    </TouchableOpacity>
    {showSeparator && <View style={styles.separator} />}
  </View>
);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
    zIndex: 1,
  },
  textLeft: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    width: '40%',
  },
  textRight: {
    fontSize: 14,
    color: 'grey',
    fontFamily: 'Poppins-Medium',
    width: '60%',
    textAlign: 'right',
  },
  separator: {
    padding: 0.4,
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
});
export default DropdownSection;
