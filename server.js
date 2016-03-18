var express  = require('express');
var app      = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var port     = process.env.PORT || 3000;
var basicAuth = require('basic-auth-connect');

var auth = basicAuth(function(user, pass, callback) {
 var result = (user === 'test' && pass === 'test');
 callback(null /* error */, result);
});

/////////////////////////////////////////////////////////////////////////
app.use(express.static(__dirname + '/public'));

app.get('/admin', auth, function(req, res) {
 res.sendFile(__dirname + '/public/admin.html');
});

app.get('/stream', function(req, res) {
 res.sendFile(__dirname + '/public/stream.html');
});


/////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket){
	//console.log('user connected'+socket);
	socket.join();

	socket.on('disconnect', function(){
		console.log('disconnected '+socket);
	});

	socket.on('chatmessage', function(msg){
		console.log(">", msg.time+' '+msg.text);
		//io.emit('chatmessage', msg);
		io.sockets.emit('chatmessage',msg);
	});
});

http.listen(port);
console.log('The magic happens on port ' + port);