const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const helmet = require('helmet');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const moment = require('moment');
const db = require('./queries');
const lt = /</g, gt = />/g, ap = /'/g, ic = /"/g;

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});
app.get('/users', (req, res) => {
  res.sendFile(__dirname + '/public/users.html');
});

app.use(helmet());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const bot = 'bot';

//simple xss prevention function
const replace = (message) => {
  return message.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;")
}
let users = [];

function removeItem(arr, item){
  return arr.filter(f => f !== item)
}

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = db.userJoin(socket.id, username, room);
    socket.join(user.room)
    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit('messages', db.formatMessage(bot, `${user.username} has joined the chat`));

    //Get chat messages
    db.getChats(user.room).then(res => res.forEach(data => {
      let message = {
        name: data.user_name,
        date: data.date_time,
        text: data.chat_text
      }
      socket.emit('messages', message);
    }));

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      const user = db.getCurrentUser(socket.id);
      var message = {
        name: user.username,
        room: user.room,
        text: replace(msg),
        date: moment().format('HH:mm - MMMM D')
      }

      db.insertChats(message);
      socket.emit('messages', message);
      socket.broadcast.to(user.room).emit('messages', message);
    });

  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = db.userLeave(socket.id);

    if (user) {
      users = removeItem(users, user.room);
      socket.emit('updateUsers', users);
      //Broadcasts user has left
      socket.broadcast.to(user.room).emit('messages', db.formatMessage(bot, `${user.username} has left the chat`));
      // users.splice(index, 1);
    }
  });
});