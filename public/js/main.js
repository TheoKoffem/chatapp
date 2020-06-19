const chatForm = $('#chat-form');
const chatMessages = $('.chat-container');
const roomName = $('.rooms');
const userList = $('.users');
const rooms = ['Chillout Place', 'Nightlife', 'Series & Movies', 'Sports']

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();
if (username == undefined || username == '') {
  window.location.replace("/");
} else {
  $('#username').val(username);
  $('#nickname-header').html('#' + username);
}
if (room == undefined || room == '') {
  window.location.replace("/chat?room=chillout&username=" + username);
} else {
  $('#' + room).addClass("active");
}
// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users, rooms }) => {
  // outputRoomName(room);
  outputUsers(users);
});

// Sent Message output
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  ScrollDown();
});
// Received Message Output
socket.on('sentMessage', message => {
  console.log(message);
  ReceivedMessage(message);
  ScrollDown();
});
// Scroll down
function ScrollDown() {
  chatMessages.scrollTop(chatMessages[0].scrollHeight - chatMessages[0].clientHeight);
}
// Message submit
chatForm.on('submit', e => {
  e.preventDefault();
  // Get message text
  const msg = $('#message-input').val();
  // Emit message to server
  if (msg == '') {
    console.log('Empty');
  } else {
    socket.emit('chatMessage', msg);

    $('#message-input').val('');
    $('#message-input').focus();
  }
});

// Output message to DOM
function outputMessage(message) {
  chatMessages.append(`
  <div class="message sent">
    <div class="row flex">
      <div class="username"><b>${message.username}</b></div>
      <div class="time">&nbsp; @ ${message.time}</div>
    </div>
    <div class="row">
      <div class="text">
          <p>${message.text}</p>
      </div>
    </div>
  </div>`);
}
function ReceivedMessage(message) {
  chatMessages.append(`
  <div class="message received">
    <div class="row flex">
      <div class="username"><b>${message.username}</b></div>
      <div class="time">&nbsp; @ ${message.time}</div>
    </div>
    <div class="row">
      <div class="text">
          <p>${message.text}</p>
      </div>
    </div>
  </div>`);
}


// Add users to DOM
function outputUsers(users) {
  // userList.html("");
  // userList.append(`
  //   ${users.map(user => `<li>${user.username}</li>`).join('')}
  // `);
}
