import React from 'react';
import { SearchBar } from 'react-native-elements';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const CustomSearchBar = ({ search, updateSearch }) => {
  return (
    <SearchBar
      placeholder="Search events or tags..."
      onChangeText={updateSearch}
      value={search}
      containerStyle={{ width: wp('100%') }}
    />
  );
};

export default CustomSearchBar;
