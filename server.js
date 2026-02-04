const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/overlay', (req, res) => res.sendFile(path.join(__dirname, 'overlay.html')));

const banned = ["nigger", "faggot"];

io.on('connection', (socket) => {
    socket.on('join', (room) => {
        socket.join(room);
        console.log(`Streamer joined: ${room}`);
    });

    socket.on('tts-msg', (data) => {
        const cleanMsg = data.message.toLowerCase();
        if (banned.some(word => cleanMsg.includes(word))) return;

        console.log(`Message received for ${data.streamer}: [${data.username}] ${data.message}`);
        io.to(data.streamer).emit('play-tts', data);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Server is running!'));