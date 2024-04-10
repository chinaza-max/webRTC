// server.js
import express from 'express';
import http from 'http';
const app = express();
import { Server } from "socket.io";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
import { ExpressPeerServer } from 'peer';

/*, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
}*/
const PORT = process.env.PORT || 3000;

const peerServer = ExpressPeerServer(server, {
  debug: true,
  port: PORT,
});


app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.redirect(`/${Math.random().toString(36).substring(2, 15)}`);
});


app.get('/:myroom', (req, res) => {
    res.render('room', {roomId:req.params.myroom});
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {


    socket.join(roomId);

    //socket.to(roomId).emit('user-connected', userId);

    socket.join(roomId);
    socket.on('ready',()=>{
      socket.broadcast.to(roomId).emit('user-connected',userId );
    })

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });

  });
});




server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});