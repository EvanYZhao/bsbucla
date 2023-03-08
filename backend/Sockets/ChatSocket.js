var express = require('express');
var app = express();
var server = require('http').Server(app);
const verifyToken = require('../Firebase/firebaseAdmin');
const axios = require('axios');
const { ObjectId } = require('mongodb'); 
require('../MongoDB');

const { ChatroomModel, GroupModel } = require('../Models');

const socketIO = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const CHATPORT = process.env.PORT || 3001;
server.listen(CHATPORT, () => {
  console.log(`ChatSocket started on ${CHATPORT}.`);
});

// If new member joins, update chatroom if active
app.post('/updateChatroomMembers', async (req, res) => {
  const groupId = req.query.groupId;
  if (socketIO.sockets.adapter.rooms().get(groupId).size > 0) {
    const group = await axios.get('https://bsbucla-requests.up.railway.app/getGroupById', { headers: { Authorization: 'Bearer ' + token }, params: {id: groupId}})
    .then(group => {
      return group.data;
    })
    .catch(() => {
      return null;
    });

    if (!group) {
      return;
    }

    socketIO.to(groupId).emit('s_group_members', group.members);
  }
});

socketIO.on('connection', async (socket) => {
  const token = socket.handshake.query.token;
  const user = await verifyToken(token);

  if (!user) {
    socket.emit('s_failed');
    return;
  }

  // Check if user in group
  const groupId = socket.handshake.query.groupId;
  const group = await axios.get('https://bsbucla-requests.up.railway.app/getGroupById', { headers: { Authorization: 'Bearer ' + token }, params: {id: groupId}})
    .then(group => {
      return group.data;
    })
    .catch(() => {
      return null;
    });

  if (!group) {
    socket.emit('s_failed_connect');
    return;
  }

  console.log(group);

  const chatroom = await ChatroomModel.findById(group.chatroomId);

  // Join chatroom if user in group
  if (group.members[0].hasOwnProperty('email')) {
    console.log(`⚡: ${socket.id} user just connected to Chatroom ${group.chatroomId}`)
    socket.join(group.chatroomId);

    // Emit history of messages
    const upstreamRoom = await ChatroomModel.findById(group.chatroomId).limit(50);

    socket.emit('s_history', upstreamRoom.messages);

    // Return all members' information
    socket.emit('s_group_members', group.members);
  }

  // Receive message
  // Save message
  // Notify chatroom socket
  socket.on('c_message', async (message) => {
    const out = `${user.name} says ${message}`;
    console.log(out);

    // Save to chatroom logs
    const newId = new ObjectId();
    const newMessage = { _id: newId, userId: user.uid, message, reactions: [] };
    chatroom.messages.push(newMessage);
    await chatroom.save();
    
    socketIO.to(group.chatroomId).emit('s_message', newMessage);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    socket.disconnect();
  });
});

module.exports = socketIO;