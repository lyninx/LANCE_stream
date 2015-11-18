var express  = require('express');
var app      = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var port     = process.env.PORT || 8080;
var basicAuth = require('basic-auth-connect');

var auth = basicAuth(function(user, pass, callback) {
 var result = (user === 'test' && pass === 'test');
 callback(null /* error */, result);
});

/////////////////////////////////////////////////////////////////////////
app.use(express.static(__dirname + '/public'));

app.get('/admin', auth, function(req, res) {
 res.send('Hello World');
});

app.get('/stream', function(req, res) {
 res.sendFile(__dirname + '/public/index.html');
});

/////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket){
	//console.log('user connected'+socket);
	socket.join(rooms[0])
	socket.room = rooms[0];

	socket.on('disconnect', function(){
		//console.log('user disconnected'+socket);
	});

	socket.on('chatmessage', function(msg){
		console.log("|==== ", socket.room)
		console.log("|== user :", msg.user, msg.id);
		console.log("|== msg  :", msg.text);
		//io.emit('chatmessage', msg);
		io.sockets.in(socket.room).emit('chatmessage',msg);
	});

	socket.on('switchRoom', function(newroom){
		// leave the current room (stored in session)
		if(!(socket.room == newroom)){X
			socket.leave(socket.room);
			//console.log("left "+socket.room);
			// join new room, received as function parameter
			socket.join(newroom);
			//console.log("joined "+newroom);
			socket.room = newroom;
		}
		//socket.emit('updaterooms', rooms, newroom);
	});
});

http.listen(port);
console.log('The magic happens on port ' + port);