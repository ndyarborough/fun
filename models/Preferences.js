// preferencesModel.js
const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  receiveNotifications: {
    type: Boolean,
    default: true, // You can set a default value
  },
  rsvpVisibility: {
    type: Boolean,
    default: true, // You can set a default value
  },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }],
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;