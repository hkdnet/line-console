(function() {
  var app = new Vue({
    el: '#app',
    data: {
      messages: []
    }
  });
  var socket = io.connect('http://localhost:3000/');

  socket.on('message', function(msg) {
    app.messages.push(msg)
  });

  document
    .getElementById('submit')
    .addEventListener('click', function(e) {
      var data = document.querySelector('form textarea[name=json]');
      console.log(data.textContent);
      var option = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: "hello"})
     };
      fetch('/message', option)
      e.preventDefault();
    });
})();
