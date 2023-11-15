// messageRoutes.js

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
router.post('/sendMessage', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Check if sender and receiver exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found.' });
    }

    // Create a new message
    const message = new Message({
      content,
      sender: senderId,
      receiver: receiverId,
    });

    // Save the message to the database
    await message.save();

    // Update the users' message arrays
    sender.messages.push(message._id);
    receiver.messages.push(message._id);

    await Promise.all([sender.save(), receiver.save()]);

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Acknowledge a message
router.patch('/acknowledgeMessage/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;

    // Find the message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    // Acknowledge the message
    message.acknowledged = true;

    // Save the updated message
    await message.save();

    res.json({ message: 'Message acknowledged successfully.' });
  } catch (error) {
    console.error('Error acknowledging message:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Send a message to an array of users
router.post('/sendMessageToMany', async (req, res) => {
  try {
    const { senderId, receiverIds, content } = req.body;

    // Check if sender exists
    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({ error: 'Sender not found.' });
    }

    // Create a new message
    const message = new Message({
      content,
      sender: senderId,
      receiver: receiverIds,
    });

    // Save the message to the database
    await message.save();

    // Update the users' message arrays
    sender.messages.push(message._id);

    // Update each receiver's message array
    await Promise.all(receiverIds.map(async (receiverId) => {
      const receiver = await User.findById(receiverId);
      if (receiver) {
        receiver.messages.push(message._id);
        await receiver.save();
      }
    }));

    await sender.save();

    res.status(201).json({ message: 'Message sent to multiple users successfully.' });
  } catch (error) {
    console.error('Error sending message to multiple users:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get all messages for a specific user
router.get('/:userId/messages', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find the user
      const user = await User.findById(userId).populate('messages');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.json(user.messages);
    } catch (error) {
      console.error('Error fetching user messages:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

module.exports = router;
