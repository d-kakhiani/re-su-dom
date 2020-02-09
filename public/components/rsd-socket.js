class RSDSocket extends HTMLElement {
  static get is() {
    return 'rsd-socket';
  }

  constructor() {
    super();
    this._isOpen = false;
    this.connectionString = '';

  }

  get isOpen() {
    return this._isOpen;
  }

  connectedCallback() {
    if (RSDSocket._instanceCount > 0) {
      console.error('There must be one instance');
      return;
    }
    if (!this.connectionString) {
      console.error('ConnectionString is required, please enter');
      return;
    }
    try {
      this.webSocket = new WebSocket(this.connectionString);
    } catch (e) {
      console.log('Error while connecting socket server');
    }

    this.webSocket.addEventListener('open', () => {
      this._isOpen = true;
      this.dispatchEvent(new CustomEvent('open'));
    });
    this.webSocket.addEventListener('close', () => {
      this._isOpen = true;
      this.dispatchEvent(new CustomEvent('close'));
    });
    this.webSocket.addEventListener('message',
        this._messageReceived.bind(this));
    this.webSocket.addEventListener('error', (error) => {
      this.dispatchEvent(new CustomEvent('error', {detail: error}));
    });
    RSDSocket._instanceCount++;
  }

  _messageReceived(event) {
    try {
      const object = JSON.parse(event.data);
      this.dispatchEvent(new CustomEvent('message', {detail: object}));
    } catch (e) {
      console.error('Invalid JSON received from WebSocket', e);
    }
  }

  send(message) {
    if (typeof message === 'object') {
      message = JSON.stringify(message);
    }
    try {
      this.webSocket.send(message);
    } catch (e) {
      console.error('Error while sending message from rsd-socket', e);
    }
  }
}

RSDSocket._instanceCount = 0;
customElements.define(RSDSocket.is, RSDSocket);
