import React, { useState, useEffect } from 'react';
import { View, Button, ScrollView, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MultiImagePicker = ({ onImagesSelected, initialImages }) => {
  const [images, setImages] = useState([]);

  // Use useEffect to update the images state when initialImages prop changes
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      // Transform each initialImage into { uri: initialImage }
      const transformedImages = initialImages.map((image) => ({
        uri: image,
      }));
      setImages(transformedImages);
    } else {
      // If initialImages is undefined or empty, set images to an empty array
      setImages([]);
    }
  }, [initialImages]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      multiple: true, // Enable multiple selection
    });

    if (!result.cancelled) {
      const newImages = [...images, ...result.assets];
      setImages(newImages);
      onImagesSelected(newImages); // Notify parent component about the selected images
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    onImagesSelected(updatedImages); // Notify parent component about the updated images
  };

  return (
    <View>
      <Button title="Pick images from camera roll" onPress={pickImage} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              {/* You can use any icon or text for the remove button */}
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 15,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MultiImagePicker;
