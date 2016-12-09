(function() {
  var app = new Vue({
    el: '#app',
    data: {
      messages: []
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

  /*
  document
    .getElementById('submit')
    .addEventListener('click', function(e) {
      var data = document.querySelector('form textarea[name=json]');
      var option = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({messages: [
          { type: "text", text: "hello" },
          { type: "text", text: "world" },
        ]})
     };
      fetch('/message', option)
      e.preventDefault();
    });
  */
})();
