(function() {
  var read = function() {
    var raw = localStorage.getItem('data');
    if (!raw) {
      return;
    }
    var data = JSON.parse(raw);
    return data;
  };
  var write = function(data) {
    localStorage.setItem('data', JSON.stringify(data));
  };
  var data = read() ||{
    messages: [],
    url: "/message",
    type: "text",
    text: "hello world",
  };
  var app = new Vue({
    el: '#app',
    data: data,
    computed: {
      body: function() {
        var message = { type: this.type, text: this.text};
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
    }
  });
  window.addEventListener('beforeunload', function() {
    var data = {
      messages: [],
      url: app.url,
      type: app.type,
      text: app.text
    };
    write(data);
  });
  var socket = io.connect();

  socket.on('message', function(reply) {
    console.log(reply)
    if(!reply || !reply.messages) {
      console.error('Format error');
    }
    reply.messages.forEach(e => app.messages.push(e));
  });

  document
    .getElementById('submit')
    .addEventListener('click', function(e) {
      var data = document.querySelector('#result');
      var option = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cors: true,
        body: data.textContent
     };
     fetch(app.url, option)
     e.preventDefault();
    });
})();
