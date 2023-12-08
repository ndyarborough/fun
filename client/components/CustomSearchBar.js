import React, { useRef } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SearchIcon from '../assets/search.webp'; // You may need to install this package

const CustomSearchBar = ({ search, updateSearch }) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    updateSearch('');
  };

  const handlePressOutside = () => {
    // Dismiss the keyboard when clicking outside the input
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.searchBarContainer}>
        <Image style={styles.icon} source={SearchIcon}></Image>
        <TextInput
          ref={inputRef}
          placeholder="Search events or tags..."
          onChangeText={updateSearch}
          value={search}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>X</Text>
          </Pressable>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('90%'),
    backgroundColor: '#fffffe',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: hp('1%'),
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    height: hp('4%'),
    paddingLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    alignItems: 'center',
    fontSize: 16,
  },
});

export default CustomSearchBar;
