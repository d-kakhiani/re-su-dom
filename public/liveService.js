class liveService {
  static turnOnVideo() {
    console.log('Requesting local stream');
    liveService.localStream = null;
    liveService.remoteStream = null;
    const streamPromise = navigator.mediaDevices.getDisplayMedia({ video: true});
    // const streamPromise = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    streamPromise.then((stream) => {
      console.log('Received local stream');
      liveService.localStream = stream;
      localVideo.srcObject = stream;
      ws.webSocket.send(JSON.stringify({type: 'media'}));
      if (window.isSender) {
        liveService.setupPeerConnection();
      }
    }).catch((e) => {
      alert(`getUserMedia() error: ${e.name}`);
    });

  }

  static setupPeerConnection() {
    if (!liveService.isStarted && typeof liveService.localStream !== 'undefined' && window.isChannelReady) {
      liveService.peerConnection = new RTCPeerConnection(configuration);
      liveService.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const sendObject = {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          };
          ws.webSocket.send(JSON.stringify(sendObject));
        }
      };
      liveService.peerConnection.onaddstream = (event) => {
        liveService.remoteStream = event.stream;
        remoteVideo.srcObject = liveService.remoteStream;
      };
      liveService.peerConnection.onremovestream = (event) => {
      };
      liveService.peerConnection.addStream(liveService.localStream);
      liveService.isStarted = true;
      if (window.isSender) {
        liveService.call();
      }
    }
  }

  static call() {
    liveService.peerConnection.createOffer().then((offerDescription) => {
      liveService.peerConnection.setLocalDescription(offerDescription).then(() => {
        ws.webSocket.send(JSON.stringify(offerDescription));

      });
    });
  }

  static answer() {
    liveService.peerConnection.createAnswer().then((answerDescription) => {

      liveService.peerConnection.setLocalDescription(answerDescription).then(() => {

      }).catch((error) => {
        console.log('Error while setLocalDescription', error);
      });
      ws.webSocket.send(JSON.stringify(answerDescription));
    });
  }

  static stop() {
    liveService.isStarted = false;
    liveService.peerConnection.close();
    liveService.peerConnection = null;
  }
}





let ws = document.querySelector('#WebSocket');
if (!ws) {
  ws = new CibWebsocket;
  ws.setAttribute('id', 'WebSocket');
  document.body.appendChild(ws);
}
ws.addEventListener('open', (event) => console.log('open', event));
ws.addEventListener('message', (event) => {
  if (event.detail && event.detail.type === 'READY') return;
  console.log('Message from Socket', event.detail);

  const message = event.detail;
  // console.log(message);
  if (message.type === 'created') {
    window.isSender = true;
  } else if (message.type === 'joined') {
    window.isChannelReady = true;
  } else if (message.type === 'media') {
    liveService.setupPeerConnection();
  } else if (message.type === 'offer') {
    console.log('Receive Offer');
    if (!window.isSender && !liveService.isStarted) {
      liveService.setupPeerConnection();
    }
    liveService.peerConnection.setRemoteDescription(new RTCSessionDescription(message)).then(() => {
      liveService.answer();
    }).catch((error) => {
      console.error('Error while setting setRemoteDescription Offer', error);
    });
  } else if (message.type === 'answer' && liveService.isStarted) {
    console.log('Receive Answer');
    liveService.peerConnection.setRemoteDescription(new RTCSessionDescription(message)).then(() => {
      console.log('Sender successfully set answer');
    }).catch((error) => {
      console.log('error while setting answer', error);
    });
  } else if (message.type === 'candidate' && liveService.isStarted) {
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate,
    });
    liveService.peerConnection.addIceCandidate(candidate);

  } else if (message === 'bye' && liveService.isStarted) {
    liveService.stop();
  }
});