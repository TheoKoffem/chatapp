const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const {
    getChats,
    insertChats,
    formatMessage,
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./queries');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
});
app.get('/chat.js', (req, res) => {
    res.sendFile(__dirname + '/public/js/chat.js');
});
app.get('/home.js', (req, res) => {
    res.sendFile(__dirname + '/public/js/home.js');
});

http.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});

const client = io.of('/client');

client.on('connection', socket => {
    socket.on('join', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage('botName', 'Welcome to ChatCord!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage('botName', `${user.username} has joined the chat`)
            );

        // Send users and room info
        client.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        client.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            client.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            client.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});