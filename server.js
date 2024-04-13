// server.js
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
const app = express();


app.use(cors());
const mainServer = http.createServer(app);

const io = new Server(mainServer, {  
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT ||3000;

/*
const peerApp = express();
const peerServer = http.createServer(peerApp);
const peerPort = process.env.PORT ||9000;

peerApp.use(cors());


const peerServerOptions = {
  debug: true,
  allow_discovery: true 
};

const peerServerInstance = ExpressPeerServer(peerServer, peerServerOptions);


peerApp.use('/peerjs', peerServerInstance);*/


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

    console.log('connection made to room : ',roomId,userId)
    console.log('connection made to room : ',roomId,userId)
   
    socket.join(roomId);

    //socket.to(roomId).emit('user-connected', userId);

 

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });

  });

  socket.on('ready',(roomId, userId)=>{
    console.log('ready as hell')
    console.log('ready as hell')
    console.log('ready as hell')
    console.log('ready as hell')
    console.log(roomId)
    console.log('ready as hell')

    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {

      console.log('size size ')
      console.log('size size ')
      const numClients = socket.rooms[roomId].size;
      console.log('size 1 ', numClients)
      console.log('size 2 ', room.size)
        console.log('size size ')
        console.log('size size ')


    } else {
        return 0; // Room doesn't exist or no clients in the room
    }

    socket.broadcast.to(roomId).emit('user-connected',userId);
  })

});





mainServer.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})
