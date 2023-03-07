const mongoose = require('mongoose');

const ChatroomSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true
  },
  messages: {
    type: Array,
    required: false,
    default: []
  }
});

const ChatroomModel = mongoose.model('Chatroom', ChatroomSchema);

module.exports = ChatroomModel;