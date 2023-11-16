// preferencesModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferencesSchema = new mongoose.Schema({
  receiveNotifications: {
    type: Boolean,
    default: true, // You can set a default value
  },
  rsvpVisibility: {
    type: Boolean,
    default: true, // You can set a default value
  },
<<<<<<< HEAD
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }],
=======
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
>>>>>>> 18b69c2d8de97b6b9199e06399381b0aad43ba78
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;