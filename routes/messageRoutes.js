const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST route to send a message
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Validate and create a new message
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content,
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    res.json(savedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.get('/thread-history/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  console.log('Received request with senderId:', senderId);
console.log('Received request with receiverId:', receiverId);

  try {
    // Fetch thread history based on senderId and receiverId
    const threadHistory = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ timestamp: 'asc' }) // Use 'timestamp' instead of 'createdAt'
      .exec();

    // Send the thread history as a JSON response
    res.json(threadHistory);
  } catch (error) {
    console.error('Error fetching thread history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
