// DisplayTags.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const DisplayTags = ({ tags }) => { 

  return (
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) => {
        // If the tag includes a color (e.g., "#49ers"), extract it
        const [name, color] = tag.split(',');

        return (
          <Text key={index} style={[styles.tag, { backgroundColor: color || '#e0e0e0' }]}>
            {name}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('75%')
  },
  tag: {
    borderRadius: 8,
    backgroundColor: 'lightgray',
    elevation: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden', // This ensures that the border-radius is applied correctly
    borderWidth: 1,
    borderColor: 'transparent', // Set border color to transparent for no color
    padding: 5,
    marginRight: 5,
},
});

export default DisplayTags;
