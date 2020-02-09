import {LitElement, css, html} from 'lit-element';
import './rsd-socket';

class RsdAlwaysOn extends LitElement {
  static get is() {
    return 'rsd-always-on';
  }

  static get properties() {
    return {
      active: {
        type: Boolean,
        reflect: true,
      },
      accessCode: {
        type: String,
      },
      userName: {
        type: String,
      },
    };
  }

  static get styles() {
    //language=CSS
    return css`
        :host {
            display: inline-flex;
            position: fixed;
            right: 16px;
            bottom: 32px;
            align-items: flex-end;
            --background-color: #3d96ff;
            --icon-color: white;
            --box-padding: 16px;
            --icon-size: 32px;
            cursor: pointer;
        }

        :host([disabled]) {
            pointer-events: none;
        }

        .img {
            width: var(--icon-size);
            height: var(--icon-size);
            display: inline-flex;
            fill: var(--icon-color);
        }

        .box {
            display: inline-flex;
            padding: var(--box-padding);
            background: var(--background-color);
            border-radius: 50%;
            will-change: opacity;
            transition: opacity 0.2s ease-in-out;
        }

        .box:hover {
            box-shadow: var(--shadow-raised);
        }

        svg {
            pointer-events: none;
            display: block;
            width: 100%;
            height: 100%;
        }

        .active-menu {
            display: inline-flex;
            height: 0;
            width: 0;
            opacity: 0;
            overflow: hidden;
            transition: opacity 200ms linear;
            background: white;
            cursor: default;
            z-index: 1;
        }

        :host([active]) .active-menu {
            width: 240px;
            height: 100%;
            opacity: 1;
            box-sizing: border-box;
            padding: var(--space-24) var(--space-24);
            box-shadow: var(--shadow-popup);
            flex-direction: column;
            margin-right: calc(0px - 2 * var(--box-padding) - var(--icon-size));
            align-items: flex-start;
        }

        :host([active]) .box {
            opacity: 0;

        }

        :host([active]) .active-menu .user-info {
            display: inline-flex;
            font-size: 16px;
            font-family: Monospaced;
        }

        :host([active]) .active-menu .title {
            font-size: 18px;
            font-family: cursive;
            color: #69bfff;;
            margin-bottom: var(--space-8);
        }

        :host([active]) .active-menu .user-info {
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            margin-bottom: var(--space-8);
            font-family: monospace;
        }

        :host([active]) .active-menu .user-code {
            font-size: 14px;
            display: inline-flex;
            flex-direction: column;
            font-family: monospace;
            font-weight: bold;
        }

        :host([active]) .access-code {
            font-size: 16px;
            font-family: cursive;
            color: #69bfff;
            margin-top: var(--space-8);
            font-weight: normal;
        }

        :host([active]) .get-user-code {
            background-color: #69bfff;
            color: var(--color-white);
            text-transform: uppercase;
            display: inline-flex;
            flex-grow: 0;
            font-size: 14px;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
        }

        :host([active]) .get-user-code:hover {
            box-shadow: var(--shadow-raised);
        }

    `;
  }

  render() {
    return html`
      <div class="active-menu" @click="${(event) => event.stopPropagation()}">
         <span class="title">RE-SU-DOM</span>
         <span class="user-info">Hello&nbsp;<span class="user-name">${this.userName}!</span></span>              
         ${this.accessCode ? html`
            <span class="user-code">
              Your access code is: 
              <span class="access-code">${this.accessCode}</span>
            </span>
         ` : html`
            <span class="get-user-code" @click="${this._requestCode}">Get Code</span>
         `}
                       
      
      </div>
      <div class="box">
        <span class="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path d="M192 208c0-17.67-14.33-32-32-32h-16c-35.35 0-64 28.65-64 64v48c0 35.35 28.65 64 64 64h16c17.67 0 32-14.33 32-32V208zm176 144c35.35 0 64-28.65 64-64v-48c0-35.35-28.65-64-64-64h-16c-17.67 0-32 14.33-32 32v112c0 17.67 14.33 32 32 32h16zM256 0C113.18 0 4.58 118.83 0 256v16c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16v-16c0-114.69 93.31-208 208-208s208 93.31 208 208h-.12c.08 2.43.12 165.72.12 165.72 0 23.35-18.93 42.28-42.28 42.28H320c0-26.51-21.49-48-48-48h-32c-26.51 0-48 21.49-48 48s21.49 48 48 48h181.72c49.86 0 90.28-40.42 90.28-90.28V256C507.42 118.83 398.82 0 256 0z" class=""></path></svg></span>
      </div>
      
    `;
  }

  constructor() {
    super();
    this.userName = 'George';
    // this.accessCode = '321-5464-5642';
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', () => {
      this.active = false;
    });
    this.addEventListener('click', (event) => {
      event.stopPropagation();
      this.active = !this.active;
    });
  }

  _requestCode() {
    this.dispatchEvent(new CustomEvent('request-code'));
  }
}

customElements.define(RsdAlwaysOn.is, RsdAlwaysOn);
