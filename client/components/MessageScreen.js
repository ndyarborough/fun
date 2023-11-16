import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import messageApi from '../api/messageApi';

const MessageScreen = ({ route, senderId }) => {
    const { userId, username } = route.params;
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        const fetchThreadHistory = async () => {
            try {
                const response = await messageApi.getThreadHistory(senderId, userId);
                setChat(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching thread history:', error);
                setLoading(false);
            }
        };

        fetchThreadHistory();
    }, [userId]);

    const isSender = (messageUserId) => messageUserId === senderId;

    const sendMessage = async () => {
        if (message.trim() !== '') {
            try {
                await messageApi.sendMessage(senderId, userId, message);
                setChat([...chat, { userId, message }]);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading messages...</Text>
            ) : (
                <ScrollView style={styles.chatContainer}>
                    {chat.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                styles.messageContainer,
                                isSender(item.sender) ? styles.senderMessage : styles.receiverMessage,
                            ]}
                        >
                            <Text style={styles.messageText}>{item.content}</Text>
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
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
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
        width: '60%',
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
    messageText: (isSender, senderStyle) => ({
        color: isSender ? '#fff' : '#000', // Text color for sender and receiver
        alignSelf: isSender ? 'flex-end' : 'flex-start', // Align text based on sender or receiver
        ...senderStyle, // Additional style for sender
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
