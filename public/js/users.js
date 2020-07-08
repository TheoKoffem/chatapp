const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
$(document).ready(function () {
    $('.username-room').val(room);
    $('.username').val(username);
    $('.nickname-header').html('#' + username);
})