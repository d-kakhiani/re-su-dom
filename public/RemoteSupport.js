class RemoteSupport {
  constructor(socket, userId) {
    this.ws = socket;
    this.userId = userId || sessionStorage.getItem('access-code');
    this.setupSocketListeners();
  }

  createConnection(receiverUser = null) {
    if (!this._connection) {
      this._connection = new RTCConnectionClass(this.userId, receiverUser,
          this.ws);
    }
  }

  setupSocketListeners() {
    if (!this.ws) {
      console.warn('Please setup websocket');
      return;
    }
    this.ws.addEventListener('open', this.socketOpenHandler.bind(this));
    this.ws.addEventListener('close', this.socketCloseHandler.bind(this));
    this.ws.addEventListener('message', this.socketMessageHandler.bind(this));
  }

  socketOpenHandler(event) {
    // save some socket private info
  }

  socketCloseHandler() {
    // handler socket state change
  }

  socketMessageHandler(event) {
    if (!event || !event.detail || !event.detail.type) {
      console.warn(
          'Invalid socket message structure, please check message format');
      return;
    }
    const type = event.detail.type;
    switch (type) {
        // sent by client
      case 'offer':
        this.receiveConnectionOffer(event.detail);
        break;
        //  sent by support
      case 'answer':
        this.receiveConnectionAnswer(event.detail);
        break;
        //  can be sent by both part
      case 'candidate':
        this.addCandidateIntoConnection(event.detail);
        break;
        //  sent by support
      case 'register-offer':
        this.createAndSendOfferDescription(event.detail);
        break;
    }
  }

  get getMediaStream() {
    // if (isMobile()) {
    //   return navigator.mediaDevices.getUserMedia({audio: true, video: true});
    // }
    if (navigator.getDisplayMedia) {
      return navigator.getDisplayMedia({video: true});
    } else if (navigator.mediaDevices.getDisplayMedia) {
      return navigator.mediaDevices.getDisplayMedia({video: true});
    } else {
      return navigator.mediaDevices.getUserMedia(
          {video: {mediaSource: 'screen'}});
    }
  }

  get createMediaStream() {
    const mediaStream = this.getMediaStream;
    if (!this._connection) {
      console.error('Please setup RTCPeerConnection at first');
      return;
    }
    return mediaStream.then((stream) => {
      for (const track of stream.getTracks()) {
        track.addEventListener('ended', this._streamTrackEndHandler.bind(this));
      }
      return stream.getTracks();
    }).catch(() => {

    });
  }

  _streamTrackEndHandler(event) {

  }

  // this fires when support initiate call
  // @client FIRST CALL
  createAndSendOfferDescription(message) {
    if (!message || !message.toUser) {
      console.error('Invalid offer message format');
      return;
    }
    if (!this._connection) {
      // it means its must be initiated from someone
      this.createConnection(message.toUser);
    }
    this.createMediaStream.then((tracks) => {
      this._connection.addTrack(tracks);
      this._connection.createOffer();

    }).catch(() => {

    });
  }

  // this always fires when client accept support request and send offer
  // @support FIRST CALL
  receiveConnectionOffer(message) {
    const OfferSessionDescription = new RTCSessionDescription(message.offer);
    if (!message.fromUser) {
      console.error('Its requred to create receiver user credentials');
    }
    if (!this._connection) {
      this.createConnection(message.fromUser);
    }
    this._connection.setRemoteDescription(OfferSessionDescription).then(() => {
      this._connection.createAnswer();
    });
  }

  // this always fires when support get offer and send answer back to client
  // @client
  receiveConnectionAnswer(message) {
    const answerSessionDescription = new RTCSessionDescription(message);
    this._connection.setRemoteDescription(answerSessionDescription).then(() => {

    });
  }

  // exchange candidate info both side
  addCandidateIntoConnection(message) {
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate,
    });
    if (!this._connection) {
      this.createConnection(message.fromUser);
    }
    this._connection.addIceCandidate(candidate);
  }

  // ONLY SUPPORT CAN REQUEST ACCESS DATA
  // @support
  requestAccessUserData(user) {
    this.ws.send({type: 'access', clientId: user});
  }

  // @client
  registerIntoWaitingList() {
    this.ws.send({type: 'waiting'});
  }
}

class RTCConnectionClass {
  constructor(senderUser, receiverUser, ws) {
    this.peerConnection = new RTCPeerConnection(RTCConfiguration);
    this.senderUser = senderUser;
    this.receiverUser = receiverUser;
    this.ws = ws;
    this._inboundStream = null;
    this.peerConnection.addEventListener('icecandidate',
        this.iceCandidatesHandler.bind(this));
    this.peerConnection.addEventListener('track',
        this.trackHandler.bind(this));
  }

  iceCandidatesHandler(event) {
    if (event.candidate) {
      this.ws.send({
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        toUser: this.receiverUser,
        fromUser: this.senderUser,
      });
    }
  }

  trackHandler(event) {
    console.debug('Remote stream successfully added', event.streams);
    if (event.streams && event.streams[0]) {
      this.streamIntoElement.srcObject = event.streams[0];
    } else {
      if (!this._inboundStream) {
        this._inboundStream = new MediaStream();
        this.streamIntoElement.srcObject = this._inboundStream;
      }
      this._inboundStream.addTrack(event.track);
    }
  }

  get streamIntoElement() {
    if (document.querySelector('video')) {
      return document.querySelector('video');
    }
    const video = document.createElement('video');
    document.body.append(video);
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.style.width = '240px';
    return video;
  }

  createOffer() {
    return this.peerConnection.createOffer().then((offerDescription) => {
      this.setLocalDescription(offerDescription).then(() => {
        this.ws.send(
            {
              type: 'offer',
              toUser: this.receiverUser,
              offer: offerDescription,
            });
      });

    });
  }

  createAnswer() {
    return this.peerConnection.createAnswer().then((answerDescription) => {
      this.setLocalDescription(answerDescription).then(() => {
        this.ws.send(
            {
              type: 'send-answer',
              toUser: this.receiverUser,
              answer: answerDescription,
            });
      });
    });
  }

  addTrack(tracks) {
    for (const track of tracks) {
      this.peerConnection.addTrack(track);
    }
  }

  setLocalDescription(localDescription) {
    return this.peerConnection.setLocalDescription(localDescription);
  }

  setRemoteDescription(remoteDescription) {
    return this.peerConnection.setRemoteDescription(remoteDescription);
  }

  addIceCandidate(candidate) {
    return this.peerConnection.addIceCandidate(candidate);
  }
}

const RTCConfiguration = {
  iceServers: [
    {urls: 'stun:re-su-dom.ga:5349'},
    {
      urls: 'turn:re-su-dom.ga:5349',
      username: 'turnAdmin',
      credential: '3u5p6omh5d8rr2c27mua6ojfqepdbnniotj2e2kv9ri',
    },
  ],
};

class RSD {
  init() {
    this.setUserAccessCode();
    this.addSocketConnection();
  }

  setUserAccessCode() {
    let randomAccessCode = null;
    if (sessionStorage.getItem('access-code') === null) {
      randomAccessCode = `${getRandomNumber(100, 999)}-${getRandomNumber(1000,
          9999)}-${getRandomNumber(1000, 9999)}`;
      sessionStorage.setItem('access-code', randomAccessCode);
    } else {
      randomAccessCode = sessionStorage.getItem('access-code');
    }
    this.userId = randomAccessCode;
  }

  addSocketConnection() {
    const socket = document.createElement('rsd-socket');
    socket.connectionString =
        `ws${window.location.protocol.replace('http',
            '')}//${window.location.host}/`;
    const encodedAccessCode = this.userId.split('-').
        map(number => parseInt(number).toString(16)).
        join('-');
    socket.connectionString += encodedAccessCode;
    document.body.append(socket);
    this.socket = socket;
  }

  setupClient() {
    const alwaysOn = document.createElement('rsd-always-on');
    document.body.append(alwaysOn);
    alwaysOn.addEventListener('request-code', () => {
      alwaysOn.accessCode = this.userId;
      this._remote_support_.registerIntoWaitingList();
    });
    this.init();
    this._remote_support_ = new RemoteSupport(this.socket, this.userId);
  }

  requestAccess(clientCode) {
    if (!this._remote_support_) {
      // this.init();
      this._remote_support_ = new RemoteSupport(this.socket, this.userId);
    }
    this._remote_support_.requestAccessUserData(clientCode);
  }
}

const getRandomNumber = (from, to) => {
  return Math.floor(Math.random() * (to - from + 1) + from);
};