const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const UserSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true
  },
  created: {
    type: Number,
    required: false,
    default: Date.now()
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: false,
    default: ""
  },
  groups: {
    type: Array,
    required: false,
    default: []
  }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;