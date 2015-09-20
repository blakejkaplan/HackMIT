var myDataRef;
var lat = 0;
var lon = 0;
var myName;

$('#messageInput').keypress(function(e) {
    if (e.keyCode == 13) {
        var text = $('#messageInput').val();
		var time = Firebase.ServerValue.TIMESTAMP;
        myDataRef.push({
            name: myName,
            text: text,
			lat: lat,
			lon: lon,
			time: time
        });
        $('#messageInput').val('');
    }
});

function displayChatMessage(name, text) {
    if (myName === name) {
        $('<div id=' + name + ' class=selfMessage/>').text(text).prepend($('<b/>').text(name + ': ')).appendTo($('#messagesDiv'));
    } else {
        $('<div id=' + name + ' class=message/>').text(text).prepend($('<b/>').text(name + ': ')).appendTo($('#messagesDiv'));
    }

    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;

};

$(function() {
    $('#messageInput, footer').hide();
	
	var rand = Math.random() * names.length;
	
	var oldName = Cookies.get('name');
	
	if(typeof oldName === 'undefined'){
		myName = names[Math.floor(rand)];
		console.log("NOOOO NO COOKIEZ!!");
	}
	else
	{
		console.log("got a cookie :)");
		myName = oldName;
	}
	
	Cookies.set('name', myName);
	
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
});

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

function showPosition(position) {
    $('#loadingMessage').hide();
    $('#messageInput, footer').show();
    myDataRef = new Firebase('https://shining-inferno-1955.firebaseio.com/');
    lat = position.coords.latitude;
    lon = position.coords.longitude;
	//console.log("latitude", lat);
	//console.log("longitude", lon);

    myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();

    //console.log("-----NEW MESSAGE-----");
    //console.log("MESSAGE: " + message.text);
    //console.log("NAME: " + message.name);
    
    var dT = ($.now() - message.time) / 1000;
    //console.log("TIME: " + dT);
    
    if(dT > 12 * 60 * 60)//12 hrs
        return;

    //Calculating the distance from the incoming message
    var otherLat = message.lat;
    //console.log("OTHERLAT: " + otherLat);
    var otherLon = message.lon;
    //console.log("OTHERLON: " + otherLon);
    var myLat = lat;
    //console.log("MYLAT: " + myLat);
    var myLon = lon;
    //console.log("MYLON: " + myLon);

    var myDistance = distance(myLat,myLon,otherLat,otherLon,'M');

    //console.log("DISTANCE: " + myDistance);

    if(isNaN(myDistance)){
        myDistance = 0;
    }

    if(myDistance>.25){
        return;
    }

    

    displayChatMessage(message.name, message.text);

    cleanup(myDataRef);
});
};

