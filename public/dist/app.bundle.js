!function(e){var t={};function s(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(i,n,function(t){return e[t]}.bind(null,n));return i},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=1)}([function(e,t){class s extends HTMLElement{static get is(){return"rsd-socket"}constructor(){super(),this._isOpen=!1,this.connectionString=""}get isOpen(){return this._isOpen}connectedCallback(){if(s._instanceCount>0)console.error("There must be one instance");else if(this.connectionString){try{this.webSocket=new WebSocket(this.connectionString)}catch(e){console.log("Error while connecting socket server")}this.webSocket.addEventListener("open",()=>{this._isOpen=!0,this.dispatchEvent(new CustomEvent("open"))}),this.webSocket.addEventListener("close",()=>{this._isOpen=!0,this.dispatchEvent(new CustomEvent("close"))}),this.webSocket.addEventListener("message",this._messageReceived.bind(this)),this.webSocket.addEventListener("error",e=>{this.dispatchEvent(new CustomEvent("error",{detail:e}))}),s._instanceCount++}else console.error("ConnectionString is required, please enter")}_messageReceived(e){try{const t=JSON.parse(e.data);this.dispatchEvent(new CustomEvent("message",{detail:t}))}catch(e){console.error("Invalid JSON received from WebSocket",e)}}send(e){"object"==typeof e&&(e=JSON.stringify(e));try{this.webSocket.send(e)}catch(e){console.error("Error while sending message from rsd-socket",e)}}}s._instanceCount=0,customElements.define(s.is,s)},function(e,t,s){"use strict";s.r(t);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const i=new WeakMap,n=e=>"function"==typeof e&&i.has(e),r=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,o=(e,t,s=null)=>{for(;t!==s;){const s=t.nextSibling;e.removeChild(t),t=s}},a={},c={},l=`{{lit-${String(Math.random()).slice(2)}}}`,h=`\x3c!--${l}--\x3e`,d=new RegExp(`${l}|${h}`);class p{constructor(e,t){this.parts=[],this.element=t;const s=[],i=[],n=document.createTreeWalker(t.content,133,null,!1);let r=0,o=-1,a=0;const{strings:c,values:{length:h}}=e;for(;a<h;){const e=n.nextNode();if(null!==e){if(o++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:s}=t;let i=0;for(let e=0;e<s;e++)u(t[e].name,"$lit$")&&i++;for(;i-- >0;){const t=c[a],s=_.exec(t)[2],i=s.toLowerCase()+"$lit$",n=e.getAttribute(i);e.removeAttribute(i);const r=n.split(d);this.parts.push({type:"attribute",index:o,name:s,strings:r}),a+=r.length-1}}"TEMPLATE"===e.tagName&&(i.push(e),n.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(l)>=0){const i=e.parentNode,n=t.split(d),r=n.length-1;for(let t=0;t<r;t++){let s,r=n[t];if(""===r)s=f();else{const e=_.exec(r);null!==e&&u(e[2],"$lit$")&&(r=r.slice(0,e.index)+e[1]+e[2].slice(0,-"$lit$".length)+e[3]),s=document.createTextNode(r)}i.insertBefore(s,e),this.parts.push({type:"node",index:++o})}""===n[r]?(i.insertBefore(f(),e),s.push(e)):e.data=n[r],a+=r}}else if(8===e.nodeType)if(e.data===l){const t=e.parentNode;null!==e.previousSibling&&o!==r||(o++,t.insertBefore(f(),e)),r=o,this.parts.push({type:"node",index:o}),null===e.nextSibling?e.data="":(s.push(e),o--),a++}else{let t=-1;for(;-1!==(t=e.data.indexOf(l,t+1));)this.parts.push({type:"node",index:-1}),a++}}else n.currentNode=i.pop()}for(const e of s)e.parentNode.removeChild(e)}}const u=(e,t)=>{const s=e.length-t.length;return s>=0&&e.slice(s)===t},m=e=>-1!==e.index,f=()=>document.createComment(""),_=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class g{constructor(e,t,s){this.__parts=[],this.template=e,this.processor=t,this.options=s}update(e){let t=0;for(const s of this.__parts)void 0!==s&&s.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=r?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],s=this.template.parts,i=document.createTreeWalker(e,133,null,!1);let n,o=0,a=0,c=i.nextNode();for(;o<s.length;)if(n=s[o],m(n)){for(;a<n.index;)a++,"TEMPLATE"===c.nodeName&&(t.push(c),i.currentNode=c.content),null===(c=i.nextNode())&&(i.currentNode=t.pop(),c=i.nextNode());if("node"===n.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(c.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,n.name,n.strings,this.options));o++}else this.__parts.push(void 0),o++;return r&&(document.adoptNode(e),customElements.upgrade(e)),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const v=` ${l} `;class y{constructor(e,t,s,i){this.strings=e,this.values=t,this.type=s,this.processor=i}getHTML(){const e=this.strings.length-1;let t="",s=!1;for(let i=0;i<e;i++){const e=this.strings[i],n=e.lastIndexOf("\x3c!--");s=(n>-1||s)&&-1===e.indexOf("--\x3e",n+1);const r=_.exec(e);t+=null===r?e+(s?v:h):e.substr(0,r.index)+r[1]+r[2]+"$lit$"+r[3]+l}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const S=e=>null===e||!("object"==typeof e||"function"==typeof e),w=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class b{constructor(e,t,s){this.dirty=!0,this.element=e,this.name=t,this.strings=s,this.parts=[];for(let e=0;e<s.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new x(this)}_getValue(){const e=this.strings,t=e.length-1;let s="";for(let i=0;i<t;i++){s+=e[i];const t=this.parts[i];if(void 0!==t){const e=t.value;if(S(e)||!w(e))s+="string"==typeof e?e:String(e);else for(const t of e)s+="string"==typeof t?t:String(t)}}return s+=e[t],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class x{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===a||S(e)&&e===this.value||(this.value=e,n(e)||(this.committer.dirty=!0))}commit(){for(;n(this.value);){const e=this.value;this.value=a,e(this)}this.value!==a&&this.committer.commit()}}class C{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(f()),this.endNode=e.appendChild(f())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=f()),e.__insert(this.endNode=f())}insertAfterPart(e){e.__insert(this.startNode=f()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){for(;n(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=a,e(this)}const e=this.__pendingValue;e!==a&&(S(e)?e!==this.value&&this.__commitText(e):e instanceof y?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):w(e)?this.__commitIterable(e):e===c?(this.value=c,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,s="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=s:this.__commitNode(document.createTextNode(s)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof g&&this.value.template===t)this.value.update(e.values);else{const s=new g(t,e.processor,this.options),i=s._clone();s.update(e.values),this.__commitNode(i),this.value=s}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let s,i=0;for(const n of e)s=t[i],void 0===s&&(s=new C(this.options),t.push(s),0===i?s.appendIntoPart(this):s.insertAfterPart(t[i-1])),s.setValue(n),s.commit(),i++;i<t.length&&(t.length=i,this.clear(s&&s.endNode))}clear(e=this.startNode){o(this.startNode.parentNode,e.nextSibling,this.endNode)}}class P{constructor(e,t,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=s}setValue(e){this.__pendingValue=e}commit(){for(;n(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=a,e(this)}if(this.__pendingValue===a)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=a}}class N extends b{constructor(e,t,s){super(e,t,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new E(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class E extends x{}let T=!1;try{const e={get capture(){return T=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}class A{constructor(e,t,s){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=s,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;n(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=a,e(this)}if(this.__pendingValue===a)return;const e=this.__pendingValue,t=this.value,s=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),i=null!=e&&(null==t||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=k(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=a}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const k=e=>e&&(T?{capture:e.capture,passive:e.passive,once:e.once}:e.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;const V=new class{handleAttributeExpressions(e,t,s,i){const n=t[0];if("."===n){return new N(e,t.slice(1),s).parts}return"@"===n?[new A(e,t.slice(1),i.eventContext)]:"?"===n?[new P(e,t.slice(1),s)]:new b(e,t,s).parts}handleTextExpression(e){return new C(e)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */function O(e){let t=M.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},M.set(e.type,t));let s=t.stringsArray.get(e.strings);if(void 0!==s)return s;const i=e.strings.join(l);return s=t.keyString.get(i),void 0===s&&(s=new p(e,e.getTemplateElement()),t.keyString.set(i,s)),t.stringsArray.set(e.strings,s),s}const M=new Map,z=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const R=(e,...t)=>new y(e,t,"html",V);function U(e,t){const{element:{content:s},parts:i}=e,n=document.createTreeWalker(s,133,null,!1);let r=j(i),o=i[r],a=-1,c=0;const l=[];let h=null;for(;n.nextNode();){a++;const e=n.currentNode;for(e.previousSibling===h&&(h=null),t.has(e)&&(l.push(e),null===h&&(h=e)),null!==h&&c++;void 0!==o&&o.index===a;)o.index=null!==h?-1:o.index-c,r=j(i,r),o=i[r]}l.forEach(e=>e.parentNode.removeChild(e))}const $=e=>{let t=11===e.nodeType?0:1;const s=document.createTreeWalker(e,133,null,!1);for(;s.nextNode();)t++;return t},j=(e,t=-1)=>{for(let s=t+1;s<e.length;s++){const t=e[s];if(m(t))return s}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const q=(e,t)=>`${e}--${t}`;let L=!0;void 0===window.ShadyCSS?L=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),L=!1);const H=e=>t=>{const s=q(t.type,e);let i=M.get(s);void 0===i&&(i={stringsArray:new WeakMap,keyString:new Map},M.set(s,i));let n=i.stringsArray.get(t.strings);if(void 0!==n)return n;const r=t.strings.join(l);if(n=i.keyString.get(r),void 0===n){const s=t.getTemplateElement();L&&window.ShadyCSS.prepareTemplateDom(s,e),n=new p(t,s),i.keyString.set(r,n)}return i.stringsArray.set(t.strings,n),n},B=["html","svg"],F=new Set,I=(e,t,s)=>{F.add(e);const i=s?s.element:document.createElement("template"),n=t.querySelectorAll("style"),{length:r}=n;if(0===r)return void window.ShadyCSS.prepareTemplateStyles(i,e);const o=document.createElement("style");for(let e=0;e<r;e++){const t=n[e];t.parentNode.removeChild(t),o.textContent+=t.textContent}(e=>{B.forEach(t=>{const s=M.get(q(t,e));void 0!==s&&s.keyString.forEach(e=>{const{element:{content:t}}=e,s=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{s.add(e)}),U(e,s)})})})(e);const a=i.content;s?function(e,t,s=null){const{element:{content:i},parts:n}=e;if(null==s)return void i.appendChild(t);const r=document.createTreeWalker(i,133,null,!1);let o=j(n),a=0,c=-1;for(;r.nextNode();){for(c++,r.currentNode===s&&(a=$(t),s.parentNode.insertBefore(t,s));-1!==o&&n[o].index===c;){if(a>0){for(;-1!==o;)n[o].index+=a,o=j(n,o);return}o=j(n,o)}}}(s,o,a.firstChild):a.insertBefore(o,a.firstChild),window.ShadyCSS.prepareTemplateStyles(i,e);const c=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==c)t.insertBefore(c.cloneNode(!0),t.firstChild);else if(s){a.insertBefore(o,a.firstChild);const e=new Set;e.add(o),U(s,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const W={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},J=(e,t)=>t!==e&&(t==t||e==e),D={attribute:!0,type:String,converter:W,reflect:!1,hasChanged:J},G=Promise.resolve(!0);class Y extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=G,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,s)=>{const i=this._attributeNameForProperty(s,t);void 0!==i&&(this._attributeToPropertyMap.set(i,s),e.push(i))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=D){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const s="symbol"==typeof e?Symbol():`__${e}`;Object.defineProperty(this.prototype,e,{get(){return this[s]},set(t){const i=this[e];this[s]=t,this._requestUpdate(e,i)},configurable:!0,enumerable:!0})}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty("finalized")||e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const s of t)this.createProperty(s,e[s])}}static _attributeNameForProperty(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,s=J){return s(e,t)}static _propertyValueFromAttribute(e,t){const s=t.type,i=t.converter||W,n="function"==typeof i?i:i.fromAttribute;return n?n(e,s):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const s=t.type,i=t.converter;return(i&&i.toAttribute||W.toAttribute)(e,s)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this._updateState=32|this._updateState,this._hasConnectedResolver&&(this._hasConnectedResolver(),this._hasConnectedResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,s){t!==s&&this._attributeToProperty(e,s)}_propertyToAttribute(e,t,s=D){const i=this.constructor,n=i._attributeNameForProperty(e,s);if(void 0!==n){const e=i._propertyValueToAttribute(t,s);if(void 0===e)return;this._updateState=8|this._updateState,null==e?this.removeAttribute(n):this.setAttribute(n,e),this._updateState=-9&this._updateState}}_attributeToProperty(e,t){if(8&this._updateState)return;const s=this.constructor,i=s._attributeToPropertyMap.get(e);if(void 0!==i){const e=s._classProperties.get(i)||D;this._updateState=16|this._updateState,this[i]=s._propertyValueFromAttribute(t,e),this._updateState=-17&this._updateState}}_requestUpdate(e,t){let s=!0;if(void 0!==e){const i=this.constructor,n=i._classProperties.get(e)||D;i._valueHasChanged(this[e],t,n.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==n.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,n))):s=!1}!this._hasRequestedUpdate&&s&&this._enqueueUpdate()}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){let e,t;this._updateState=4|this._updateState;const s=this._updatePromise;this._updatePromise=new Promise((s,i)=>{e=s,t=i});try{await s}catch(e){}this._hasConnected||await new Promise(e=>this._hasConnectedResolver=e);try{const e=this.performUpdate();null!=e&&await e}catch(e){t(e)}e(!this._hasRequestedUpdate)}get _hasConnected(){return 32&this._updateState}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e&&this.update(t)}catch(t){throw e=!1,t}finally{this._markUpdated()}e&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0)}updated(e){}firstUpdated(e){}}Y.finalized=!0;const K="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol();class X{constructor(e,t){if(t!==Q)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(K?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const Z=(e,...t)=>{const s=t.reduce((t,s,i)=>t+(e=>{if(e instanceof X)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(s)+e[i+1],e[0]);return new X(s,Q)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.2.1");const ee=e=>e.flat?e.flat(1/0):function e(t,s=[]){for(let i=0,n=t.length;i<n;i++){const n=t[i];Array.isArray(n)?e(n,s):s.push(n)}return s}(e);class te extends Y{static finalize(){super.finalize.call(this),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const e=this.styles,t=[];if(Array.isArray(e)){ee(e).reduceRight((e,t)=>(e.add(t),e),new Set).forEach(e=>t.unshift(e))}else e&&t.push(e);return t}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?K?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){super.update(e);const t=this.render();t instanceof y&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){}}te.finalized=!0,te.render=(e,t,s)=>{if(!s||"object"!=typeof s||!s.scopeName)throw new Error("The `scopeName` option is required.");const i=s.scopeName,n=z.has(t),r=L&&11===t.nodeType&&!!t.host,a=r&&!F.has(i),c=a?document.createDocumentFragment():t;if(((e,t,s)=>{let i=z.get(t);void 0===i&&(o(t,t.firstChild),z.set(t,i=new C(Object.assign({templateFactory:O},s))),i.appendInto(t)),i.setValue(e),i.commit()})(e,c,Object.assign({templateFactory:H(i)},s)),a){const e=z.get(c);z.delete(c);const s=e.value instanceof g?e.value.template:void 0;I(i,c,s),o(t,t.firstChild),t.appendChild(c),z.set(t,e)}!n&&r&&window.ShadyCSS.styleElement(t.host)};s(0);class se extends te{static get is(){return"rsd-always-on"}static get properties(){return{active:{type:Boolean,reflect:!0},accessCode:{type:String},userName:{type:String}}}static get styles(){return Z`
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

    `}render(){return R`
      <div class="active-menu" @click="${e=>e.stopPropagation()}">
         <span class="title">RE-SU-DOM</span>
         <span class="user-info">Hello&nbsp;<span class="user-name">${this.userName}!</span></span>              
         ${this.accessCode?R`
            <span class="user-code">
              Your access code is: 
              <span class="access-code">${this.accessCode}</span>
            </span>
         `:R`
            <span class="get-user-code" @click="${this._requestCode}">Get Code</span>
         `}
                       
      
      </div>
      <div class="box">
        <span class="img"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path d="M192 208c0-17.67-14.33-32-32-32h-16c-35.35 0-64 28.65-64 64v48c0 35.35 28.65 64 64 64h16c17.67 0 32-14.33 32-32V208zm176 144c35.35 0 64-28.65 64-64v-48c0-35.35-28.65-64-64-64h-16c-17.67 0-32 14.33-32 32v112c0 17.67 14.33 32 32 32h16zM256 0C113.18 0 4.58 118.83 0 256v16c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16v-16c0-114.69 93.31-208 208-208s208 93.31 208 208h-.12c.08 2.43.12 165.72.12 165.72 0 23.35-18.93 42.28-42.28 42.28H320c0-26.51-21.49-48-48-48h-32c-26.51 0-48 21.49-48 48s21.49 48 48 48h181.72c49.86 0 90.28-40.42 90.28-90.28V256C507.42 118.83 398.82 0 256 0z" class=""></path></svg></span>
      </div>
      
    `}constructor(){super(),this.userName="George"}connectedCallback(){super.connectedCallback(),document.addEventListener("click",()=>{this.active=!1}),this.addEventListener("click",e=>{e.stopPropagation(),this.active=!this.active})}_requestCode(){this.dispatchEvent(new CustomEvent("request-code"))}}customElements.define(se.is,se)}]);