const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
});

const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(morgan("dev", {immediate: true}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/message', function (req, res) {
  console.log(req.body);
  res.status(200).end();
  io.emit('message', req.body)
});

server.listen(process.env.PORT || 3000);

io.on('connection', function(socket){
  io.on('message', function(msg){
    socket.emit('message', msg);
  });
  console.log('a user connected');
});

console.log("server starting...");
