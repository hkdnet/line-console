(function () {
  var read = function () {
    var raw = localStorage.getItem('data');
    if (!raw) {
      return;
    }
    var data = JSON.parse(raw);
    return data;
  };
  var write = function (data) {
    localStorage.setItem('data', JSON.stringify(data));
  };

  var data = read() || {
    messages: [],
    url: "/message",
    type: "text",
    text: "hello world",
  };
  var app = new Vue({
    el: '#app',
    data: data,
    computed: {
      body: function () {
        var message = {type: this.type, text: this.text};
        var data = {
          events: [{
            replyToken: "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
            type: "message",
            timestamp: 1462629479859,
            source: {
              type: "user",
              userId: "U206d25c2ea6bd87c17655609a1c37cb8"
            },
            message: message
          }]
        };
        return JSON.stringify(data, null, "  ");
      }
    },
    methods: {
      buttonAction: function (e) {
        var target = e.target;
        if (!target) return false;
        var type = target.getAttribute('data-type');
        switch (type) {
          case "postback":
            var data = {
              events: [{
                "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                "type": "postback",
                "timestamp": 1462629479859,
                "source": {
                  "type": "user",
                  "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
                },
                "postback": {
                  "data": target.getAttribute('data-data')
                }
              }]
            };
            return send(JSON.stringify(data));
          case "message":
            var text = target.getAttribute('data-text');
            var message = {type: "message", text: text};
            var data = {
              events: [{
                replyToken: "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                type: "message",
                timestamp: 1462629479859,
                source: {
                  type: "user",
                  userId: "U206d25c2ea6bd87c17655609a1c37cb8"
                },
                message: message
              }]
            };
            return send(JSON.stringify(data));
          default:
            console.error("No such action: " + type);
        }
      },
      sendMessage: function (e) {
        send(this.body);
        e.preventDefault();
      }
    }
  });
  var send = function (data) {
    var option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cors: true,
      body: data
    };
    fetch(app.url, option);
  };
  window.addEventListener('beforeunload', function () {
    var data = {
      messages: [],
      url: app.url,
      type: app.type,
      text: app.text
    };
    write(data);
  });
  var socket = io.connect();

  socket.on('message', function (reply) {
    if (!reply || !reply.messages) {
      console.error('Format error');
      return;
    }
    reply.messages.forEach(e => app.messages.push(e));
  });
})();
