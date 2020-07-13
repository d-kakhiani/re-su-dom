let streamSender, streamReceiver;
const configuration = {
  // iceServers: [
  //   {urls: 'stun:re-su-dom.ga:5349'},
  //   {
  //     urls: 'turn:re-su-dom.ga:5349',
  //     username: 'turnAdmin',
  //     credential: '3u5p6omh5d8rr2c27mua6ojfqepdbnniotj2e2kv9ri',
  //   },
  // ],
};

class CallService {
  static turnOnVideo() {
    console.log('Requesting local stream');
    // const stream = await navigator.mediaDevices.getDisplayMedia({ video: true});
    navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
      console.log('Received local stream');
      localVideo.srcObject = stream;
      console.log('Starting call');
      CallService.prepareSender();
      console.log('streamSender preparation done successfully');
      CallService.prepareReceiver();
      console.log('streamReceiver preparation done successfully');
      CallService.streamData(stream);
      CallService.createOffer();
    }).catch((e) => {
      alert(`getUserMedia() error: ${e.name}`);
    });
  }

  static prepareSender() {

    streamSender = new RTCPeerConnection(configuration);
    streamSender.onicecandidate = (event) => {
      if (event.candidate) {
        streamReceiver.addIceCandidate(event.candidate);
      }
    };
    streamSender.addEventListener('iceconnectionstatechange', e => {
      console.log(`streamSender ICE state: ${streamSender.iceConnectionState}`);
    });
  }

  static prepareReceiver() {
    streamReceiver = new RTCPeerConnection(configuration);
    streamReceiver.onicecandidate = (event) => {
      if (event.candidate)
        streamSender.addIceCandidate(event.candidate);
    };
    streamReceiver.addEventListener('iceconnectionstatechange', e => {
      console.log(`streamReceiver ICE state: ${streamReceiver.iceConnectionState}`);
    });

    streamReceiver.addEventListener('track', (event) => {
      if (remoteVideo.srcObject !== event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
        console.log('streamReceiver received remote stream');
      }
    });
  }

  static streamData(data) {
    data.getTracks().forEach(track => streamSender.addTrack(track, data));
  }

  static createOffer() {
    streamSender.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    }).then((offerSessionDescription) => {
      //  send offer to streamReceiver
      streamSender.setLocalDescription(offerSessionDescription).then(() => {
        streamReceiver.setRemoteDescription(offerSessionDescription).then(() => {
          // it should be initiated form socket
          CallService.createAnswer();
        }).catch((error) => {
          console.error('Error while setting remote description for streamReceiver', error);
        });
      }).catch((error) => {
        console.error('Error while setting local description for streamSender', error);
      });
    }).catch((error) => {
      console.error('Error while creating offer for streamSender', error);
    });
  }

  static createAnswer() {
    streamReceiver.createAnswer().then((answerSessionDescription) => {
      //  send answer to streamSender
      streamReceiver.setLocalDescription(answerSessionDescription).then(() => {
        streamSender.setRemoteDescription(answerSessionDescription).then(() => {

        }).catch((error) => {
          console.error('Error while setting remote description for streamSender', error);
        });
      }).catch((error) => {
        console.error('Error while setting local description for streamReceiver', error);
      });
    }).catch((error) => {
      console.error('Error while creating Answer for streamReceiver', error);
    });
  }
}