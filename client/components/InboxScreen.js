import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import messageApi from '../api/messageApi';

const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(Date.parse(timestamp));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid Date';
  }
};

const InboxScreen = ({ updateUser, userInfo, navigation }) => {
  console.log("inbox screen is rendered")
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const userId = userInfo?._id;

        if (!userId) {
          console.error('User ID is undefined');
          return;
        }

        const threadsData = await messageApi.getThreads(userId);

        // Log the threads to check their structure
        console.log(threadsData);

        // Modify the threadsData before setting the state
        const modifiedThreads = threadsData.map((thread) => {
          const otherUser = userInfo._id === thread.receiverInfo._id
            ? thread.senderInfo
            : thread.receiverInfo;

          // Update otherUser.username on the front end with a null check
          if (otherUser) {
            otherUser.username = '!user.username'; // Replace with your logic for updating the username
          }

          return {
            ...thread,
            receiverInfo: {
              ...otherUser,
              _id: otherUser?._id || 'otherUser', // Change to any value you prefer
            },
          };
        });

        setThreads(modifiedThreads);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching threads:', error);
        setError('Error fetching threads');
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchThreads();
    }
  }, [userInfo, isFocused]);

  const getThreadName = (thread) => {
    const senderName = thread.senderInfo?.fullName || 'Unknown User';
    const receiverName = thread.receiverInfo?.fullName || 'Unknown User';

    return userInfo._id === thread.receiverInfo._id ? senderName : receiverName;
  };

  const handleMarkAsRead = async (threadId) => {
    try {
      await messageApi.markMessageAsRead(threadId);
      console.log('Message marked as read successfully');
      // Perform any additional actions after marking the message as read
    } catch (error) {
      console.error('Error marking message as read:', error);
      // Handle the error as needed
    }
  };

  const handleThreadView = async (receiverId, threadId) => {
    try {
      await messageApi.markMessageAsRead(threadId);
      console.log('Message marked as read successfully');
      const updatedThreads = await messageApi.getThreads(userInfo?._id);
      setThreads(updatedThreads);
      // Navigate or perform other actions after updating the threads
      navigation.navigate('Message', { receiverId });
    } catch (error) {
      console.error('Error marking message as read:', error);
      // Handle the error as needed
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading && threads.length === 0 && <Text>No threads to display</Text>}
      {!loading && threads.length > 0 && (
        <ScrollView>
          {threads.map((thread) => (
            <TouchableOpacity
              key={thread._id}
              style={styles.threadContainer}
              onPress={() => handleThreadView(thread.receiverInfo._id, thread._id)}
            >
              <Text style={styles.receiverName}>{getThreadName(thread)}</Text>
              <View style={styles.lastMessageContainer}>
                {/* Render content conditionally based on userInfo._id and receiver._id */}
                {userInfo._id === thread.receiverInfo._id ? (
                  <Text style={styles.lastMessageContent}>{thread.content}</Text>
                ) : (
                  <Text style={styles.lastMessageContent}>You: {thread.content}</Text>
                )}
                <Text style={styles.timestamp}>{formatTimestamp(thread.timestamp)}</Text>
                {userInfo._id !== thread.senderInfo._id && !thread.read && (
                  <View style={styles.unreadIndicator} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  threadContainer: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  receiverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  lastMessageContent: {
    flex: 1,
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
  },
});

export default InboxScreen;
