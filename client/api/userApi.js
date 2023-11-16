import { apiBaseUrl } from '../utils/apiUtils';

const userApi = {
  getUserInfo: async (userId) => {
    console.log(userId);
    const response = await fetch(`${apiBaseUrl}/user/fetch/${userId}`);
    const userInfo = await response.json();
    return userInfo; // Add this line to return userInfo
  },
  register: async (username, email, password, fullName) => {
    const response = await fetch(`${apiBaseUrl}/user/register/${username}/${email}/${password}/${fullName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const newUser = await response.json();
    return newUser;
  },
  login: async (username, password) => {
    const response = await fetch(`${apiBaseUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const loggedInUser = await response.json();
    return loggedInUser;
  },
  sendMessage: async (senderId, receiverId, content) => {
    const response = await fetch(`${apiBaseUrl}/user/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId,
        receiverId,
        content
      }),
    });
  },
  getMyEvents: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/myEvents/${userId}`);
    const myEvents = await response.json();
    console.log(myEvents)
    return myEvents;
  },
  getMyRsvps: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/myRsvps/${userId}`);
    const myRsvps = await response.json();
    return myRsvps;
  },
  getPreferences: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/preferences/${userId}`);
    const myPreferences = await response.json();
    return myPreferences;
  },
  savePreferences: async (userId, preferences) => {
    const response = await fetch(`${apiBaseUrl}/user/preferences/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  },
  handleBlockConfirmation: async (userId, blockedUserId) => {
    try {
      console.log(`Request received to block user: ${blockedUserId} by user: ${userId}`);

      const response = await fetch(`${apiBaseUrl}/user/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          blockedUserId: blockedUserId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return data; // Return the data if the request was successful
      } else {
        throw new Error(data.error || 'Error blocking user'); // Throw an error if the request was not successful
      }
    } catch (error) {
      console.error('Error in handleBlockConfirmation:', error);
      throw new Error('Error blocking user');
    }
  },
}

export default userApi;