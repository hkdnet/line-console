(function (deps) {
  var localStorage = deps.localStorage;
  var fetch = deps.fetch;
  var Vue = deps.Vue;
  var io = deps.io;
  var read = function () {
    var raw = localStorage.getItem('data');
    if (!raw) {
      return {};
    }
    var data = JSON.parse(raw);
    return data;
  };
  var write = function (data) {
    localStorage.setItem('data', JSON.stringify(data));
  };
  var defaultValues = {
    messages: [],
    url: "/message",
    type: "text",
    text: "hello world",
    userId: "U206d25c2ea6bd87c17655609a1c37cb8",
    groupId: "cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    roomId: "rxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    source: {
      type: "user"
    }
  };
  var data = Object.assign({}, defaultValues, read());
  var app = new Vue({
    el: '#app',
    data: data,
    computed: {
      body: function () {
        var ev = this.baseEvent();
        ev.type = "message";
        ev.message = {type: this.type, text: this.text};
        var data = { events: [ ev ] };
        return JSON.stringify(data, null, "  ");
      }
    },
    methods: {
      baseEvent: function () {
        var source = {
          type: this.source.type
        };
        source[source.type + 'Id'] = this[source.type + 'Id'];
        return {
          replyToken: "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
          timestamp: (new Date() - 0),
          source: source
        };
      },
      buttonAction: function (e) {
        var target = e.target;
        if (!target) return false;
        var ev = this.baseEvent();
        ev.type = target.getAttribute('data-type');
        switch (ev.type) {
          case "postback":
            ev['postback'] = {
              "data": target.getAttribute('data-data')
            };
            return send(JSON.stringify({ events: [ev] }));
          case "message":
            var text = target.getAttribute('data-text');
            var message = {type: "message", text: text};
            ev.message = message;
            return send(JSON.stringify({ events: [ev] }));
          case "uri":
            var uri = target.getAttribute('data-uri');
            window.open(uri);
            return;
          default:
            console.error("No such action: " + ev.type);
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
      headers: { 'Content-Type': 'application/json' },
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
      text: app.text,
      userId: app.userId,
      groupId: app.groupId,
      roomId: app.roomId,
      source: {
        type: app.source.type
      }
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
})({Vue: Vue, localStorage: localStorage, io: io, fetch: fetch});
