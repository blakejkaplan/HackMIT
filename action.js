var myDataRef = new Firebase('https://shining-inferno-1955.firebaseio.com/');
var lat = 0;
var lon = 0;

$('#messageInput').keypress(function(e) {
    if (e.keyCode == 13) {
        var name = $('#nameInput').val();
        var text = $('#messageInput').val();
        myDataRef.push({
            name: name,
            text: text,
			lat: lat,
			lon: lon
        });
        $('#messageInput').val('');
    }
});
myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
});

function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name + ': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};

$(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
});

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
	console.log(lat);
	console.log(lon);
};