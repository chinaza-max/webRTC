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

io.of("/letgo").on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {

    console.log('connection made to room : ',roomId,userId)
    console.log('connection made to room : ',roomId,userId)
    socket.join(roomId);
    //socket.to(roomId).emit('user-connected', userId);
    socket.on('ready2',()=>{
      
      console.log('ready as hell')
      console.log('ready as hell')
      console.log('ready as hell')
      console.log('ready as hell')
      console.log('ready as hell')
      console.log('ready as hell')
      console.log('ready as hell')
      console.log('ready as hell')

      //socket.broadcast.to(roomId).emit('user-connected',userId );

      io.of("/letgo").in(roomId).emit('user-connected',userId)


    })

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });

  });

  socket.on('ready',()=>{
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")

  })
});





mainServer.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})
