import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import messageApi from '../api/messageApi';

const InboxScreen = ({ updateUser, userInfo, navigation }) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(Date.parse(timestamp));
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  };

  const handleThreadView = (receiverId) => {
    // Perform navigation or any other action you want when a thread is clicked
    // console.log('Clicked on thread with ID:', re);
    // Example: navigate to a thread view screen
    // navigation.navigate('ThreadViewScreen', { threadId });
    
    navigation.navigate('Message', { receiverId });
  };

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const userId = userInfo._id;

        if (!userId) {
          console.error('User ID is undefined');
          return;
        }

        const threadsData = await messageApi.getThreads(userId);
        setThreads(threadsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    };

    fetchThreads();
  }, [userInfo]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading threads...</Text>
      ) : (
        <ScrollView>
          {threads.map((thread, index) => (
            <TouchableOpacity
              key={index}
              style={styles.threadContainer}
              onPress={() => handleThreadView(thread.receiverInfo._id)}
            >
              <Text style={styles.receiverName}>{thread.receiverInfo.fullName}</Text>
              <View style={styles.lastMessageContainer}>
                <Text style={styles.lastMessageContent}>{thread.content}</Text>
                <Text style={styles.timestamp}>{formatTimestamp(thread.timestamp)}</Text>
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
});

export default InboxScreen;
