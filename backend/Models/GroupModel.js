const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const GroupSchema = new mongoose.Schema({
  courseId: {
    type: ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  maxMembers: {
    type: Number,
    required: false,
    default: 0
  },
  created: {
    type: Number,
    required: false,
    default: Date.now()
  },
  members: {
    type: Array,
    required: false,
    default: []
  },
  chatroomId: {
    type: ObjectId,
    required: false,
    default: new ObjectId()
  }
});

const GroupModel = mongoose.model('Group', GroupSchema);

module.exports = GroupModel;