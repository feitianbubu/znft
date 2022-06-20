import createTextIcon, {IIconType} from '../create-icon';
import {insertCss} from '../_util';
import {EEnv, Env} from '../env';

const theme:{[key:string]:{[key:string]:string}} ={
  light: {
    background: '#fff',
    color: '#323232',
    boxShadow: '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)',
  },
  dark: {
    background: '#323232',
    color: '#fff',
    boxShadow: 'rgb(0 0 0 / 20%) 0px 3px 5px -1px, rgb(0 0 0 / 14%) 0px 6px 10px 0px, rgb(0 0 0 / 12%) 0px 1px 18px 0px',
  },
};
/**
 *
 */
export class message {
    static map: { [key: string]: HTMLDivElement } = {}
    static loop: HTMLDivElement[] = []
    static body = globalThis?.document?.body||{};
    static modeId = 'colorScheme'
    static modeAttr = 'colorScheme'
    /**
     *
     */
    constructor() {
      //

    }
    static setModeId = (modeId:string)=>{
      this.modeId = modeId;
    }
    static setModeAttr = (modeAttr:string)=>{
      this.modeAttr = modeAttr;
    }

    static success: (content: string, duration?: number, onClose?: () => void) => string|undefined = (content, duration = 3, onClose = () => {
    }) => {
      return message.addMessage(content, 'success', duration, onClose );
    }
    static error: (content: string, duration?: number, onClose?: () => void) => string|undefined = (content, duration = 3, onClose = () => {
    }) => {
      return message.addMessage(content, 'error', duration, onClose );
    }
    static info: (content: string, duration?: number, onClose?: () => void) => string|undefined = (content, duration = 3, onClose = () => {
    }) => {
      return message.addMessage(content, 'info', duration, onClose );
    }
    static warning: (content: string, duration?: number, onClose?: () => void) => string|undefined = (content, duration = 3, onClose = () => {
    }) => {
      return message.addMessage(content, 'warning', duration, onClose );
    }
    static loading: (content: string, duration?: number, onClose?: () => void) => string|undefined = (content, duration = 3, onClose = () => {
    }) => {
      return message.addMessage(content, 'loading', duration, onClose );
    }
    static addMessage: (content: string, type: IIconType, duration: number, onClose: () => void) => string|undefined = (content, type, duration, onClose ) => {
      insertCss();
      const env = Env.getEnv();
      if (env==EEnv.client) {
        const dom = message.createDom(globalThis.document, content, type);
        const tag = message.addDom(dom, duration, onClose);
        return tag;
      } else {
        console.error(content);
      }
    }

    private static createDom: (document:Document, content: string, type: IIconType) => HTMLDivElement = (document, content, type) => {
      const dom = document.createElement('div');
      const tip = document.createElement('div');
      const icon = createTextIcon(type);
      const mode = document.getElementById(message.modeId)?.getAttribute(message.modeAttr)||'dark';
      tip.innerHTML = `${icon}<div style="width: 8px"></div><div style="font-size: 14px">${content}</div>`;
      tip.style.height = '38px';
      tip.style.whiteSpace = 'nowrap';
      tip.style.justifyContent = 'center';
      tip.style.alignItems = 'center';
      tip.style.display = 'flex';
      tip.style.padding = '10px';
      tip.style.color = theme[mode].color;
      tip.style.background = theme[mode].background;
      tip.style.boxShadow = theme[mode].boxShadow;
      tip.style.borderRadius = '4px';

      dom.style.position = 'fixed';
      dom.style.width = '100%';
      dom.style.pointerEvents='none';
      dom.style.display = 'flex';
      dom.style.justifyContent = 'center';
      dom.style.transition = 'all 0.28s';
      dom.appendChild(tip);
      return dom;
    }
    private static addDom: (dom: HTMLDivElement, duration: number, onClose: () => void) => string = (dom, duration = 3, onClose) => {
      const tag = new Date().getTime().toString()+Number.parseInt(`${Math.random()*100}`, 0);
      message.map[tag] = dom;
      const length = message.loop.length;
      let zIndex = '9999999';
      if (length != 0) {
        zIndex = `${parseInt(message.loop[length - 1].style.zIndex) - 1}`;
      }
      dom.style.zIndex = zIndex;
      dom.style.top = `${8 + (8 + 42) * (length - 1)}px`;
      dom.style.opacity = '0';
      if (duration != 0) {
        setTimeout(() => {
          message.removeDom(tag);
          delete message.map[tag];
          onClose();
        }, duration * 1000);
      }
      message.loop.push(dom);
      message.map[tag] = dom;
      message.body.appendChild(dom);
      setTimeout(() => {
        dom.style.top = `${8 + (8 + 42) * (length)}px`;
        dom.style.opacity = `1`;
      }, 50);
      return tag;
    }
    private static removeDom = (domTag: string) => {
      const dom = message.map[domTag];
      const length = message.loop.length;
      for (let i = 0; i < length; i++) {
        if (message.loop[i] == dom) {
          message.loop = [...message.loop.slice(0, i), ...message.loop.slice(i + 1)];
          break;
        }
      }
      delete message.map[domTag];

      dom.style.opacity = '0';
      setTimeout(() => {
        dom.remove();
      }, 280);
    }
    static destroy :(tag?:string)=>void=(tag)=>{
      if (tag) {
        message.removeDom(tag);
      } else {
        for (const tagKey in message.map) {
          if (message.map.hasOwnProperty(tagKey)) {
            message.removeDom(tagKey);
          }
        }
      }
    }
}


export default message;
