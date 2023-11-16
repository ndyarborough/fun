import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import userApi from '../api/userApi';

const EditProfile = ({ updateUser, userInfo }) => {
    const [editedUserInfo, setEditedUserInfo] = useState({
        email: userInfo.email,
        fullName: userInfo.fullName,
        profilePic: userInfo.profilePic,
        // Add other fields you want to edit
    });

    const [image, setImage] = useState(null);

    const handleProfilePicChange = async () => {
        const newProfilePic = await pickImage();
        if (newProfilePic) {
            setEditedUserInfo({ ...editedUserInfo, profilePic: newProfilePic });
            setImage(newProfilePic);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            const selectedAssets = result.assets || [];
            const selectedAsset = selectedAssets[0];
            return selectedAsset ? selectedAsset.uri : null;
        } else {
            alert('You did not select any image.');
            return null;
        }
    };

    const handleEditProfile = async () => {
        try {
            // Call the updateProfile function from the userApi module
            await userApi.updateProfile(userInfo._id, editedUserInfo);

            // If the update is successful, you might want to refresh the user data
            // by calling the updateUser function or any other method you have for this purpose
            updateUser({
                ...userInfo,
                email: editedUserInfo.email,
                fullName: editedUserInfo.fullName,
                // Add other fields you want to update
            });

            console.log('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle the error (e.g., display an error message to the user)
        }
    };

    return (
        <View style={styles.container}>
            <Text>Email:</Text>
            <TextInput
                style={styles.input}
                value={editedUserInfo.email}
                onChangeText={(text) => setEditedUserInfo({ ...editedUserInfo, email: text })}
            />

            <Text>Full Name:</Text>
            <TextInput
                style={styles.input}
                value={editedUserInfo.fullName}
                onChangeText={(text) => setEditedUserInfo({ ...editedUserInfo, fullName: text })}
            />

            {/* Profile Picture Input */}
            <TouchableOpacity onPress={handleProfilePicChange}>
                <View style={styles.profilePicContainer}>
                    {editedUserInfo.profilePic ? (
                        <>
                            <Image source={{ uri: editedUserInfo.profilePic }} style={styles.imagePreview} />
                            <Text style={styles.changeProfilePicText}>Change Profile Pic</Text>
                        </>
                    ) : (
                        <Text style={styles.profilePicPlaceholder}>Select Profile Picture</Text>
                    )}
                </View>
            </TouchableOpacity>

            {/* Image Preview */}
            {image && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity onPress={handleEditProfile} style={styles.submitButton}>
                <Text>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    profilePicContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 32, // Increase the marginBottom for more space
        marginTop: 16,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5, // For Android
    },
    profilePicPlaceholder: {
        color: 'gray',
    },
    changeProfilePicText: {
        marginTop: 8,
        color: 'blue',
    },
    imagePreviewContainer: {
        width: 200, // Set the width to the desired size
        height: 200, // Set the height to the desired size
        borderRadius: 10,
        marginBottom: 16,
    },
    imagePreview: {
        width: '100%', // Take up 100% of the container's width
        height: '100%', // Take up 100% of the container's height
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 16, // Add marginTop to the Submit button
    },
});

export default EditProfile;
