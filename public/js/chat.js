$(function () {
    const { username, room } = Qs.parse(location.search, {
        ignoreQueryPrefix: true
    });

    const socket = io('/client');

    socket.emit('join', { username, room });

    socket.on('message', message => {
        console.log(message);
        OutputMessage(message);
    })
    $('form').on('submit', e => {
        e.preventDefault();

        //Catch form value
        let msg = $('#m').val();

        //emit text
        if (msg == '') {
            console.log('Empty');
        } else {
            socket.emit('chatMessage', msg);

            $('#m').val('');
            $('#m').focus();
        }
    })

    OutputMessage = (message) => {
        $('#messages').append(`
        <div class="msg-container">
        <p class="name"><b>${message.username}</b></p>
            <p class="msg">${message.text}</p>
        </div>
        `);
    }
});