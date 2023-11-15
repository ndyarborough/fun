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
      console.log(result)
      return result;
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
};

export default messageApi;
