let io = require('socket.io')();

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('test', (msg) => {
        socket.emit('test', 'pong');
    });


    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

});


module.exports = io