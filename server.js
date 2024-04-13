// server.js
import express from 'express';
import http from 'http';
const app = express();
import { Server } from "socket.io";
//import { ExpressPeerServer } from 'peer';
import cors from 'cors';


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

    console.log('connection made to room : ',roomId)
    console.log('connection made to room : ',roomId)
    console.log('connection made to room : ',roomId)
    console.log('connection made to room : ',roomId)
    console.log('connection made to room : ',roomId)
    console.log('connection made to room : ',roomId)
    console.log('connection made to room : ',roomId)

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





mainServer.listen(PORT, () => {
  console.log(`Peer server is running on port ${PORT}`);
})
