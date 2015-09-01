var ipc = require('ipc');




$(function(){
    $('.hello').on("click",function(){
        ipc.send('asynchronous-message', 'ping');
        console.log("hello!!!!!!");

    });
    ipc.on('asynchronous-reply', function(arg) {
      console.log(arg); // prints "pong"
    });
    ipc.on('ping', function(message) {
      console.log(message);  // Prints "whoooooooh!"
    });
});
