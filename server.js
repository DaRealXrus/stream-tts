const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Serve the HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/overlay', (req, res) => res.sendFile(path.join(__dirname, 'overlay.html')));

io.on('connection', (socket) => {
    // When someone joins, put them in a "room" based on the streamer's name
    socket.on('join', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    // When a viewer sends a message
    socket.on('tts-msg', (data) => {
        // Send it ONLY to the streamer's room
        io.to(data.streamer).emit('play-tts', data.message);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));