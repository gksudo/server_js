const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { sourceMusicFrom } = require('./src_music.js');


if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/music");
    process.exit(-1);
}
 
const path = process.argv[2];


io.on('connection', socket => {
    console.log('connection established!');

    socket.emit('handshake', { message: 'connected!' });

    socket.on('refresh', () => {
        console.log('sending updated library... ');

        sourceMusicFrom(path)
        .then(library => socket.emit('refresh', library))
        .catch(error => socket.emit('error', error));
    });
});

server.listen(8765, () => {
    console.log('listening on *:8765');
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

