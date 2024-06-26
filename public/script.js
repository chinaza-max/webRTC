
const domain= ''//'https://webrtc-ymot.onrender.com'




//console.log(location.hostname)
const socket=io('https://webrtc-ymot.onrender.com/')
const mypeer=new Peer(undefined,
                {
                  host:'peer-server-45y9.onrender.com', 
                  path:'/peerjs',
                  config: {
                    iceServers: [
                      // Example STUN servers (free to use)
                      { urls: 'stun:stun1.l.google.com:19302' },
                      { urls: 'stun:stun2.l.google.com:19302' },
                      { urls: 'stun:stun.relay.metered.ca:80' },
                      {
                        urls: 'turn:global.relay.metered.ca:80',
                        username: 'a7dae179b9af65d689f311e0',
                        credential: 'fsNVWECfbXUb4oqI'
                      },
                      {
                        urls: 'turn:global.relay.metered.ca:80?transport=tcp',
                        username: 'a7dae179b9af65d689f311e0',
                        credential: 'fsNVWECfbXUb4oqI'
                      },
                      {
                        urls: 'turn:global.relay.metered.ca:443',
                        username: 'a7dae179b9af65d689f311e0',
                        credential: 'fsNVWECfbXUb4oqI'
                      },
                      {
                        urls: 'turns:global.relay.metered.ca:443?transport=tcp',
                        username: 'a7dae179b9af65d689f311e0',
                        credential: 'fsNVWECfbXUb4oqI'
                      }
                    ]
                  }
              })


/*
const socket=io('http://localhost:3000/')
const mypeer=new Peer(undefined,
                {
                  host:'/', 
                  path:'/peerjs',
                  port:9000
              })

*/
//console.log(location.hostname)
//port: location.port || (location.protocol === 'https:' ? 443 : 80
//host:location.hostname
const Ids={}
const peers={}
let localStream;
let userId=''

class myclass{

    constructor() {
        this.addnewVideoCard=this.addnewVideoCard.bind(this)
        this.addvideoStream=this.addvideoStream.bind(this)
        this.getNewVideoElement=this.getNewVideoElement.bind(this)
    }
    addnewVideoCard(videoElement){
        //const videoDiv = document.createElement('video');
        videoElement.classList.add("mb-2");
       // div.append(videoElement);
        $("#remoteVideo").append(videoElement);
    }
    getAnElement(id){
        return document.getElementById(id)
    }
    stopVideoStream() {
      if (localStream) {
          localStream.getTracks().forEach(track => {
              track.stop();
          });
      }
      
  }
    getNewVideoElement(userId){


        const localVideo = document.createElement('video');
        localVideo.id=userId
        return localVideo
    }
    getMylocalVideo(){
        const localVideo =document.getElementById('myVideo') //document.createElement('video');
        //localVideo.id = 'myVideo';
        localVideo.muted = true;
        return localVideo
    }
    removeGridItemsWithoutVideo(id) {

      console.log
      $('.grid-item').each(function() {
        // Check if the current grid item does not contain a video tag
        if ($(this).find('video').length === 0) {
          // If it doesn't contain a video tag, remove the grid item
          $(this).remove();
        }
      });
    }
    addvideoStream(video ,stream,createStatus){
        video.srcObject=stream
        video.addEventListener('loadedmetadata',()=>{
            video.play()
        })

        if(createStatus){

        }else
        {
          this.addnewVideoCard(video)

        }
    }
    continueVideo(video ,stream){
      video.srcObject=stream
      video.addEventListener('loadedmetadata',()=>{
          video.play()
      })
    }

    connectToNewUser(userId,stream){

        const call =mypeer.call(userId,stream)
      console.log("call has been placed")
      console.log(userId)

        let videoElement=this.getNewVideoElement(userId)
        call.on("stream",stream=>{

          if (stream) {
            const tracks = stream.getTracks();
            if (tracks.length > 0) {
              console.log("Stream contains tracks:", tracks);
            } else {
              console.log("Stream does not contain any tracks");
            }
          } else {
            console.log("Stream object is null or undefined");
          }


            if(!Ids[userId]){
                this.addvideoStream(videoElement,stream)
            }
            Ids[userId]=true
        })


        console.log('close listner ')

        call.on('close',()=>{
          videoElement=myclassInstance.getAnElement(call.peer)
          videoElement.remove()
          myclassInstance.removeGridItemsWithoutVideo()
        })
        
        peers[userId]=call
    }
} 




const myclassInstance=new myclass()


mypeer.on('open',id =>{

    userId=id
    socket.emit('join-room', roomID,id)
   // $('#myid').text(userId)
   startVideoStream()

})


function startVideoStream() {

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream; 
    const localVideo = myclassInstance.getMylocalVideo();
  
    if(!Ids[userId]){
      myclassInstance.addvideoStream(localVideo ,stream,'dontCreateNewElement')
    }else{
      myclassInstance.continueVideo(document.getElementById('myVideo'),stream)
    }
    Ids[userId]=true

    $("#loaderContainer").hide()

    mypeer.on('call', call => {
      call.answer(stream);

      console.log("call has been answer")
      console.log(userId)
      
      call.on('stream', Stream => {


        if(!Ids[call.peer]){
  
          myclassInstance.addvideoStream(myclassInstance.getNewVideoElement(call.peer) ,Stream)
  
        }
  
  
        Ids[call.peer]=true
  
  
  
      });




      console.log('close listner ')
      call.on('close',()=>{
        videoElement=myclassInstance.getAnElement(call.peer)
        videoElement.remove()
        myclassInstance.removeGridItemsWithoutVideo()
      })
    });

   

    $("#videoContainer").click(function(){
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    });

    $("#micContainer").click(function(){
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    });
    
  
    socket.on('user-connected', (userId) => {
      console.log(" user connected ")

        // setTimeout(() => {
          myclassInstance.connectToNewUser(userId,stream)
  
        // }, 100);
         
    });

    socket.emit("ready", roomID,userId)

  })
  .catch(error => {
    console.error('Error accessing media devices:', error);
  });

}


socket.on('user-disconnected', (userId) => {

  if(peers[userId]){
    peers[userId].close()   
  }

});





$("#endCall i").click(function() {

  $("#text").text('link copied!')
  var fullPath = window.location.href;

  navigator.clipboard.writeText(fullPath).then(function() {
    showCopyMessage();
    setTimeout(hideCopyMessage, 2000);
  }, function(err) {
    console.error('Failed to copy text to clipboard:', err);
  });
});

function showCopyMessage() {
  $("#text").fadeIn(); 
}

function hideCopyMessage() {
  $("#text").fadeOut(); 
  setTimeout(() => {
    $("#text").text('')
  }, 4000);
}


