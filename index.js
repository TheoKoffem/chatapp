const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {
  getChats,
  insertChats,
  formatMessage,
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./queries');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
var _ = require('underscore');

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const bot = 'bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    // console.log(user);
    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(bot, `Welcome to ${user.room}`));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'sentMessage',
        formatMessage(bot, `${user.username} has joined the chat`)
      );
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
      rooms: Object.keys(io.sockets.adapter.rooms)
    });
  });
  getChats('chillout');
  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    var message = {
      user: user.username,
      room: user.room,
      text: msg
    }

    insertChats(message);
    socket.emit('message', formatMessage('You', msg));
    socket.broadcast
      .to(user.room)
      .emit(
        'sentMessage',
        formatMessage(user.username, msg)
      );
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(bot, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
