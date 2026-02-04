const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/overlay', (req, res) => res.sendFile(path.join(__dirname, 'overlay.html')));

// THE BLACKLIST
const bannedWords = ["nigger", "faggot"]; 

io.on('connection', (socket) => {
    socket.on('join', (room) => {
        socket.join(room);
    });

    socket.on('tts-msg', (data) => {
        const msgLower = data.message.toLowerCase();
        
        // CHECK IF MESSAGE HAS BANNED WORDS
        const containsBanned = bannedWords.some(word => msgLower.includes(word));
        
        if (containsBanned) {
            console.log(`Blocked a message from ${data.username}: ${data.message}`);
            return; // STOP HERE. Don't send it to the overlay.
        }

        io.to(data.streamer).emit('play-tts', { 
            username: data.username, 
            message: data.message 
        });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));