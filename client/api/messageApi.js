const apiBaseUrl = 'http://localhost:3000';

const messageApi = {
  sendMessage: async (senderId, receiverId, content) => {
    console.log('Sender ID:', senderId);
    console.log('Receiver ID:', receiverId);

    try {
      const response = await fetch(`${apiBaseUrl}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId, receiverId, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      console.log(result);

      // Check if the response includes both message and receiverInfo
      if (result && result.message && result.receiverInfo) {
        return { message: result.message, receiverInfo: result.receiverInfo };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },


  getThreadHistory: async (senderId, receiverId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/thread-history/${senderId}/${receiverId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch thread history');
      }
      const threadHistory = await response.json();
      console.log(threadHistory); // Log the thread history to check its structure
      return threadHistory;
    } catch (error) {
      console.error('Error fetching thread history:', error);
      throw error;
    }
  },
  getThreads: async (userId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/threads/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      const threads = await response.json();
  
      // Log the threads to check their structure
      console.log(threads);
  
      // Adapt the structure of the threads as needed in your front-end code
      const adaptedThreads = threads.map((thread) => ({
        ...thread,
        receiverInfo: thread.receiverInfo, // Keep receiverInfo as is
        senderInfo: thread.senderInfo, // Add senderInfo to each thread
      }));
  
      return adaptedThreads;
    } catch (error) {
      console.error('Error fetching threads:', error);
      throw error;
    }
  },
  
  markMessageAsRead: async (messageId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/mark-as-read/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Include any additional headers if needed
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },
};

export default messageApi;
