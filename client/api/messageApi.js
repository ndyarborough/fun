const apiBaseUrl = 'http://localhost:3000';

const messageApi = {
  sendMessage: async (senderId, receiverId, content) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId, receiverId, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  acknowledgeMessage: async (messageId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/acknowledgeMessage/${messageId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to acknowledge message');
      }

      return response.json();
    } catch (error) {
      console.error('Error acknowledging message:', error);
      throw error;
    }
  },

  sendMessageToMany: async (senderId, receiverIds, content) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/sendMessageToMany`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId, receiverIds, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message to multiple users');
      }

      return response.json();
    } catch (error) {
      console.error('Error sending message to multiple users:', error);
      throw error;
    }
  },
  getAllUserMessages: async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}/messages`);

      if (!response.ok) {
        throw new Error('Failed to fetch user messages');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching user messages:', error);
      throw error;
    }
  },
};

export default messageApi;
