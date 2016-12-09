(function() {
  var app = new Vue({
    el: '#app',
    data: {
      messages: [],
      type: "text",
      text: "hello world",
    },
    computed: {
      body: function() {
        var message = { type: this.type, text: this.text};
        var data = {
          messages: [message]
        };
        return JSON.stringify(data, null, "  ");
      }
    }
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
        body: data.textContent
     };
     fetch('/message', option)
     e.preventDefault();
    });
})();
