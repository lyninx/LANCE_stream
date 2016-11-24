var express  = require('express');
var bodyParser = require('body-parser');
var app      = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var port     = 3002;

var latest = {};

/////////////////////////////////////////////////////////////////////////
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.get('/stream', function(req, res) {
 res.sendFile(__dirname + '/public/stream.html');
});

app.post('/notification', function(req, res) {
	console.log(req.body)
	io.emit('chatmessage',req.body);
	latest = req.body
  res.json({ "success": true, "notification": latest })
})

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