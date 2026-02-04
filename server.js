const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/overlay', (req, res) => res.sendFile(path.join(__dirname, 'overlay.html')));

// BLOCK LIST - Messages with these will be deleted instantly
const banned = ["nigger", "faggot"];

io.on('connection', (socket) => {
    socket.on('join', (room) => socket.join(room));

    socket.on('tts-msg', (data) => {
        const cleanMsg = data.message.toLowerCase();
        // If it has a banned word, ignore it entirely
        if (banned.some(word => cleanMsg.includes(word))) return;

        io.to(data.streamer).emit('play-tts', { 
            username: data.username, 
            message: data.message 
        });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Server Live'));