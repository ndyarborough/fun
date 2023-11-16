import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import messageApi from '../api/messageApi';

const MessageScreen = ({ route, senderId }) => {
  const { receiverId } = route.params;
  const [message, setMessage] = useState('');
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(Date.parse(timestamp));
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    const fetchThreadHistory = async () => {
      try {
        console.log(senderId, receiverId)
        const { threadHistory, receiverInfo } = await messageApi.getThreadHistory(senderId, receiverId);
        setChat(threadHistory);
        setReceiverInfo(receiverInfo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching thread history:', error);
        setLoading(false);
      }
    };

    fetchThreadHistory();
  }, [senderId, receiverId]);

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when chat changes
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat]);

  const isSender = (messageUserId) => messageUserId === senderId;

  const sendMessage = async () => {
    if (message.trim() !== '') {
      try {
        const result = await messageApi.sendMessage(senderId, receiverId, message);

        if (result && result.message && result.message.timestamp && result.receiverInfo) {
          setChat([
            ...chat,
            { _id: result.message._id, sender: senderId, content: message, receiverInfo: result.receiverInfo, timestamp: result.message.timestamp },
          ]);
          setMessage('');
        } else {
          console.error('Invalid response format');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Display receiver's name at the top */}
      {receiverInfo && (
        <View style={styles.header}>
          <Text>{receiverInfo.fullName}</Text>
        </View>
      )}

      {loading ? (
        <Text>Loading messages...</Text>
      ) : (
        <ScrollView ref={scrollViewRef} style={styles.chatContainer}>
          {chat.map((item, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                isSender(item.sender) ? styles.senderMessage : styles.receiverMessage,
              ]}
            >
              <View style={styles.messageContent}>
                <Text style={styles.messageText(isSender(item.sender))}>{item.content}</Text>
                {isSender(item.sender) || !item.receiverInfo ? null : (
                  <Text style={styles.fullNameText}>{item.receiverInfo.fullName}</Text>
                )}
              </View>
              <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        borderWidth: 1,
        borderColor: '#ddd', // Add your desired border color
        padding: 10,
    },

    receiverName: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    chatContainer: {
        flex: 1,
        marginBottom: 10,
    },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%', // Adjust the width of the message container
    },
    chatContainer: {
        flex: 1,
        marginBottom: 10,
    },
    messageContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fullNameText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5, // Adjust the margin as needed
    },

    senderText: {
        color: '#fff', // Text color for sender
    },
    senderMessage: {
        backgroundColor: '#007bff', // Blue color for sender
        alignSelf: 'flex-end',
    },
    receiverMessage: {
        backgroundColor: '#e0e0e0', // Default color for receiver
        alignSelf: 'flex-start',
    },
    messageText: (isSender) => ({
        color: isSender ? '#fff' : '#000', // Text color for sender and receiver
        alignSelf: isSender ? 'flex-end' : 'flex-start', // Align text based on sender or receiver
        width: '80%', // Adjust the width of the text
    }),
    timestampText: {
        color: '#333', // Text color for timestamp
        fontSize: 12,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timestampText: {
        color: '#333', // Text color for timestamp
        fontSize: 12,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    sendButtonText: {
        color: '#fff',
    },
});

export default MessageScreen;
