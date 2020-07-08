const chatForm = $('#chat-form');
const chatMessages = $('.chat-container');
const roomName = $('.rooms');
const userList = $('.users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();
//Checks if theres a username
if (username == undefined || username == '' || username == "undefined") {
  window.location.replace("/");
} else {
  //Sets header username
  $('.username-room').val(room);
  $('.username').val(username);
  $('.nickname-header').html('#' + username);
}
//redirects to default room is theres not room set
if (room == undefined || room == '') {
  window.location.replace("/chat?room=chillout&username=" + username);
} else {
  $('#' + room).addClass("active");
}
//Set page title
$('title').html(room + " - GLU Chat")

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//   // outputRoomName(room);
//   outputUsers(room, users);
// });
socket.on('getAllRooms', (usersByRoom) => {
  Object.keys(usersByRoom).forEach(roomName =>
    console.log(roomName, usersByRoom[roomName]))
})

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

// Output user loaded messages to DOM
socket.on('messages', message => {
  if (message.name == username) {
    chatMessages.append(`
    <div class="message sent rounded-t-bl-25 w-2/3 p-5 my-3">
    <div class="row flex pb-2">
        <div class="username"><b>You</b></div>
        <div class="time">&nbsp; @ ${message.date}</div>
      </div>
      <div class="row">
        <div class="text">
            <p>${decodeURI(message.text)}</p>
        </div>
      </div>
    </div>`
    );
  } else {
    chatMessages.append(`
    <div class="message received rounded-t-br-25 w-2/3 p-5 my-3">
      <div class="row flex pb-2">
          <div class="username"><b>${message.name}</b></div>
          <div class="time">&nbsp; @ ${message.date}</div>
      </div>
      <div class="row">
        <div class="text">
            <p>${message.text}</p>
        </div>
      </div>
    </div>`
    );
  }
  ScrollDown();
});


// Add users to DOM
function outputUsers(room, users) {
  $('#users-'+ room).html(users);
}
