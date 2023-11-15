const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  timeSent: {
    type: Date,
    default: Date.now,
  },
  acknowledged: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;