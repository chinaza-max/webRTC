const socket=io("/")
const mypeer=new Peer(undefined,{
    host:'/' ,
    port:'3001'
})

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
        const div = document.createElement('div');
        div.classList.add('grid-item');
        div.append(videoElement);
        $(".grid-container").append(div);
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
        localVideo.muted = true;
        return localVideo
    }
    getMylocalVideo(){
        const localVideo = document.createElement('video');
        localVideo.id = 'myVideo';
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
    addvideoStream(video ,stream){
        video.srcObject=stream
        video.addEventListener('loadedmetadata',()=>{
            video.play()
        })

        this.addnewVideoCard(video)
    }
    continueVideo(video ,stream){
      video.srcObject=stream
      video.addEventListener('loadedmetadata',()=>{
          video.play()
      })
    }

    connectToNewUser(userId,stream){

        const call =mypeer.call(userId,stream)

        let videoElement=this.getNewVideoElement(userId)
        call.on("stream",stream=>{

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
})


function startVideoStream(state1, state2) {

  navigator.mediaDevices.getUserMedia({ video: state1, audio: state2 })
  .then(stream => {
    localStream = stream; 
    const localVideo = myclassInstance.getMylocalVideo();
  
    if(!Ids[userId]){
      myclassInstance.addvideoStream(localVideo ,stream)
    }else{

      myclassInstance.continueVideo(document.getElementById('myVideo'),stream)
    }
    Ids[userId]=true

    mypeer.on('call', call => {
      call.answer(stream);
      
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
  
  
    socket.emit("ready")
  
  
    socket.on('user-connected', (userId) => {
  
        // setTimeout(() => {
          myclassInstance.connectToNewUser(userId,stream)
  
        // }, 100);
         
    });
  
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

startVideoStream(true, true)






$("#endCall i").click(function() {

  $("#text").text('link copied!')
  var fullPath = window.location.href;

console.log(fullPath);

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
