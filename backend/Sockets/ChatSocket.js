const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http').Server(app);
const verifyToken = require('../Firebase/firebaseAdmin');
const axios = require('axios');
const { PORT } = require('../Requests/Server');

const { ObjectId } = require('mongodb');
const { ChatroomModel } = require('../Models');

const CHATPORT = 3002;
app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "*"
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
  const group = await axios.get('http://0.0.0.0:' + PORT + '/getGroupById', { headers: { Authorization: 'Bearer ' + token }, params: {id: groupId}})
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

  const chatroom = await ChatroomModel.findById(group.chatroomId);

  // Join chatroom if user in group
  if (group.members[0].hasOwnProperty('email')) {
    console.log(`⚡: ${socket.id} user just connected to Chatroom ${group.chatroomId}`)
    socket.join(group.chatroomId);

    // Emit history of messages
    const upstreamRoom = await ChatroomModel.findById(group.chatroomId).limit(50);

    socket.emit('s_history', upstreamRoom.messages);
  }

  // Receive message
  // Save message
  // Notify chatroom socket
  socket.on('c_message', async (message) => {
    const out = `${user.name} says ${message}`;
    console.log(out);

    // Save to chatroom logs
    const newMessage = { _id: new ObjectId(), userId: user.uid, message, reactions: [] };
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

http.listen(CHATPORT, () => {
  console.log(`ChatSocket started on ${CHATPORT}.`);
});

module.exports = socketIO;