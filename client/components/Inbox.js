import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import messageApi from '../api/messageApi';
import { useAppContext } from './AppContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Inbox = () => {
  const navigation = useNavigation();
  const { user } = useAppContext();
  const [conversations, setConversations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getThreads = async () => {
    try {
      setIsLoading(true);
      const threads = await messageApi.getHistory(user._id);
      setConversations(threads);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getThreads();
  }, [user._id]);

  useFocusEffect(
    React.useCallback(() => {
      getThreads();
    }, [user._id])
  );

  const openChat = (senderId, receiverId) => {
    navigation.navigate('Send Message', {
      senderId: user._id,
      receiverId: user._id === receiverId ? senderId : receiverId
    });
  };

  const renderConversationItem = ({ item }) => {
    const latestMessage = item.messages[item.messages.length - 1];
    const createdAt = new Date(latestMessage.createdAt);

    const currentUser = user;
    const sender = latestMessage.sender;
    const receiver = latestMessage.receiver;
    // Determine the display name based on the comparison
    const displayName =
      currentUser._id === sender._id
        ? receiver.username
        : sender.username;

    // Determine the message receiver ID based on the comparison
    const messageReceiverId =
      currentUser._id === sender._id
        ? receiver._id
        : sender._id;

    const messageText =
      currentUser._id === sender._id
        ? 'You: ' + latestMessage.text
        : latestMessage.text;
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => openChat(currentUser._id, messageReceiverId)}
      >
        <View style={styles.contentColumn}>
          <View style={styles.contentContainer}>
            <Image source={{ uri: receiver.profilePic }} style={styles.receiverProfilePic} />
            <Text style={styles.receiverText}>{displayName}</Text>
          </View>
          <Text style={styles.messageText}>{messageText}</Text>
        </View>

        <Text style={styles.timestampText}>
          {createdAt.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {/* Add more details or styling as needed */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadMessage}>Loading messages</Text>
        </View>) : conversations && conversations.length > 0 ? (
          <FlatList
            data={conversations}
            keyExtractor={(item) => (item._id ? item._id.toString() : Math.random().toString())}
            renderItem={renderConversationItem}
          />
        ) : (
        <Text>No conversations yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMessage: {
    marginTop: 10
  },
  conversationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  contentColumn: {
    flexDirection: 'column',
  },
  receiverText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5
  },
  timestampText: {
    color: '#888',
  },
  receiverProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
});

export default Inbox;
