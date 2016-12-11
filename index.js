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
  res.status(200).end();
  io.emit('message', req.body)
});

app.get('/debug/buttons', function(req, res) {
  res.status(200).end();
  var buttonTemplate = {
    "type": "template",
    "altText": "this is a buttons template",
    "template": {
      "type": "buttons",
      "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
      "title": "Menu",
      "text": "Please select",
      "actions": [
        {
          "type": "postback",
          "label": "Buy",
          "data": "action=buy&itemid=123"
        },
        {
          "type": "postback",
          "label": "Add to cart",
          "data": "action=add&itemid=123"
        },
        {
          "type": "message",
          "label": "Message",
          "text": "hello"
        },
        {
          "type": "uri",
          "label": "View detail",
          "uri": "http://example.com/page/123"
        }
      ]
    }
  };
  io.emit('message', { messages: [ buttonTemplate] });
});

server.listen(process.env.PORT || 3000);

io.on('connection', function(socket){
  io.on('message', function(msg){
    socket.emit('message', msg);
  });
  console.log('a user connected');
});

console.log("server starting...");
