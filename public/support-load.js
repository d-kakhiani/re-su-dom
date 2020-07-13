window.addEventListener('load', () => {
//  Create always-on-button
//  Load Additional scripts

  window.randomAccessCode = `${getRandomNumber(100, 999)}-${getRandomNumber(
      1000,
      9999)}-${getRandomNumber(1000, 9999)}`;
  document.querySelector('#user-id').innerText = window.randomAccessCode;
  console.log(randomAccessCode);
  setupSocketConnection();
});
const getRandomNumber = (from, to) => {
  return Math.floor(Math.random() * (to - from + 1) + from);
};
const setupSocketConnection = () => {
  const socket = document.createElement('rsd-socket');
  socket.connectionString =
      `ws${window.location.protocol.replace('http',
          '')}//${window.location.host}/`;
  const encodedAccessCode = randomAccessCode.split('-').
      map(number => parseInt(number).toString(16)).join('-');
  socket.connectionString += encodedAccessCode;
  document.body.append(socket);
  window._RSD_ = new RSD(socket, randomAccessCode);
  window._RSD_.init();
};
const _connectToClientHandler = () => {
  const input = document.querySelector('input');
  const clientUserId = input.value;
  window.clientUserId = clientUserId;
  if (window._RSD_) {
    window._RSD_.requestAccessUserData(clientUserId);
    window._RSD_.createLocalRTCConnection();
  }
};

class RSD {
  constructor(socket, userId) {
    this.ws = socket;
    this.userId = userId || sessionStorage.getItem('access-code');
  }

  init() {
    this.setupListeners();
  }

  setupListeners() {
    if (!this.ws) {
      console.warn('Please setup websocket');
      return;
    }
    this.ws.addEventListener('open', this.socketOpenHandler.bind(this));
    this.ws.addEventListener('close', this.socketCloseHandler.bind(this));
    this.ws.addEventListener('message', this.socketMessageHandler.bind(this));
    console.debug('All socket listeners successfully added');
  }

  socketMessageHandler(event) {
    if (!event || !event.detail || !event.detail.type) {
      console.warn(
          'Invalid socket message structure, please check message format');
      return;
    }
    const type = event.detail.type;
    switch (type) {
      case 'close':
        this.closeConnection(event.detail);
        break;
      case 'create':
        this.createConnection(event.detail);
        break;
      case 'joined':
        this.joinConnection(event.detail);
        break;
      case 'offer':
        this.receiveConnectionOffer(event.detail);
        break;
      case 'answer':
        this.receiveConnectionAnswer(event.detail);
        break;
      case 'candidate':
        this.addCandidateIntoConnection(event.detail);
        break;
      case 'register-offer':
        this.sendOffer(event.detail);
        break;
    }
  }

  addCandidateIntoConnection(message) {
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate,
    });
    this._connection.addIceCandidate(candidate);
  }

  receiveConnectionAnswer(message) {
    //   set remote user params for connection initiator
    // TODO ask for permissions
    const answerSessionDescription = new RTCSessionDescription(message);
    this._connection.setRemoteDescription(answerSessionDescription).
        then(() => {
          console.debug('Everything is ok on client side');
          // this._connection.

        });
  }

  receiveConnectionOffer(message) {
    //   set remote user params for connection Receiver
    console.debug('User has active offer, set offer', message.offer);
    const OfferSessionDescription = new RTCSessionDescription(message.offer);
    this._connection.setRemoteDescription(OfferSessionDescription).then(() => {
      this.sendAnswer();
    });
  }

  prepareStream(message) {
    //   Prepare stream setup
  }

  joinConnection(message) {
    // join already created connection
  }

  createConnection(message) {
    // initiator of connection
  }

  closeConnection(message) {
  }

  socketOpenHandler(event) {
    // save some socket private info
    console.debug('Socket successfully opened with', this.userId);
  }

  socketCloseHandler() {
    // handler socket state change
  }

  async createLocalRTCConnection() {
    // const activeConnection = RTCConnections.find((item)=>item.)
    const newRTCPeerConnection = new RTCPeerConnection(RTCConfiguration);
    newRTCPeerConnection.addEventListener('icecandidate', (event) => {
      console.debug('Support connected to candidate', event.candidate);
      if (event.candidate) {
        const sendObject = {
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
          toUser: clientUserId,
        };
        this.ws.send(sendObject);
      }
    });
    let inboundStream = null;

    newRTCPeerConnection.addEventListener('track', (event) => {
      console.debug('Stream added successfully', event.streams);
      const video = document.createElement('video');
      document.body.append(video);
      video.setAttribute('playsinline', '');
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.style.width = '240px';
      if (event.streams && event.streams[0]) {
        video.srcObject = event.streams[0];
      } else {
        if (!inboundStream) {
          inboundStream = new MediaStream();
          video.srcObject = inboundStream;
        }
        inboundStream.addTrack(event.track);
      }
    });

    this._connection = newRTCPeerConnection;
    //this.registerIntoWaitingList();
    //this.sendOffer();
  }

  registerIntoWaitingList() {
    this.ws.send({type: 'waiting'});
  }

  async sendOffer(message) {
    const gumStream = await navigator.mediaDevices.getDisplayMedia(
        {video: true}).then((stream) => {
      console.log('GET STEAM');
      return stream;
    }).catch((err) => {
      console.log(err);
    });
    for (const track of gumStream.getTracks()) {
      track.addEventListener('ended', () => {

      });
      this._connection.addTrack(track);
    }

    this._connection.addEventListener('icecandidate', (event) => {
      console.debug('Client connected to candidate', event.candidate);
      if (event.candidate) {
        const sendObject = {
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
          toUser: message.toUser,
        };
        this.ws.send(sendObject);
      }
    });

    this._connection.createOffer().then((offerDescription) => {
      this._connection.setLocalDescription(offerDescription).then(() => {
        this.ws.send(
            {type: 'offer', toUser: message.toUser, offer: offerDescription});
      });
    });
  }

  async sendAnswer() {

    this._connection.createAnswer().then((answerDescription) => {
      this._connection.setLocalDescription(answerDescription).then(() => {
        this.ws.send(
            {
              type: 'send-answer',
              toUser: window.clientUserId,
              answer: answerDescription,
            });
      });
    });
  }

  requestAccessUserData(user) {
    this.ws.send({type: 'access', clientId: user});
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
const RTCConnections = [];