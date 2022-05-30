
import createTextIcon from '../create-icon';
import {EEnv, Env} from '../env';
export interface IPanelParams{
    title?:string;
    onOk?:()=>void
    okText?:string;
    onCancel?:()=>void
    cancelText?:string
    afterAnimation?:(tag:string, content:HTMLDivElement)=>(void|Promise<void>)
    // type:Exclude<IIconType, 'loading'>
}
/**
 * 仅为了某些地方和第三方库结偶，不要用到业务里面
 */
export class panel {
    static map: { [key: string]: HTMLDivElement } = {}
    static loop: HTMLDivElement[] = []
    static body =global?.document?.body||{};
    /**
     *
     */
    constructor() {
      //

    }
    static open: (params:IPanelParams) => [string, HTMLDivElement]|undefined = (params) => {
      return panel.addPanel(params);
    }

    static addPanel: (params:IPanelParams) => [string, HTMLDivElement]|undefined = (params) => {
      const env = Env.getEnv();
      if (env==EEnv.client) {
        const [mask, modalContent, tag, content] = panel.createDom(globalThis.document, params);
        panel.addDom(mask, modalContent, tag);
        return [tag, content];
      } else {
        console.error(`${params.title}`);
      }
    }


    static createMask:(document:Document)=>HTMLDivElement = (document)=>{
      const dom = document.createElement('div');
      dom.style.position = 'absolute';
      dom.style.width = '100%';
      dom.style.height = '100%';
      dom.style.top = '0';
      dom.style.left = '0';
      dom.style.display = 'flex';
      dom.style.justifyContent = 'center';
      dom.style.transition = 'all 0.28s';
      dom.style.background='#88888800';
      dom.style.overflow='auto';
      return dom;
    }
    static createModalContent:(document:Document, params: IPanelParams, tag:string)=>[HTMLDivElement, HTMLDivElement] = (document, params, tag)=>{
      const modalContent = document.createElement('div');

      const header = document.createElement('div');
      const content = document.createElement('div');
      const footer = document.createElement('div');

      modalContent.style.minHeight = '600px';
      modalContent.style.width = '800px';
      modalContent.style.display = 'flex';
      modalContent.style.lineHeight = '20px';
      modalContent.style.background = '#fff';
      modalContent.style.boxShadow = '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)';
      modalContent.style.borderRadius = '4px';
      modalContent.style.top='-200px';
      modalContent.style.position='absolute';
      modalContent.style.transition = 'all 0.28s';
      modalContent.style.flexDirection = 'column';
      modalContent.ontransitionend = ()=>{
        params.afterAnimation?.(tag, content);
      };


      header.style.padding='16px 24px';
      header.style.borderBottom = '1px solid rgba(0,0,0,.06)';
      header.innerHTML=`<div style="height: 22px">${params.title||''}</div>`;
      content.style.flex='1';
      content.style.width='100%';
      footer.style.padding='16px 24px';
      footer.style.borderTop = '1px solid rgba(0,0,0,.06)';
      footer.style.display = 'flex';
      footer.style.justifyContent='end';
      const okButton = document.createElement('button');
      okButton.style.color = '#ffffff';
      okButton.style.background = '#1890ff';
      okButton.style.border = 'none';
      okButton.style.padding = '6px';
      okButton.style.outline = 'none';
      okButton.style.borderRadius='4px';
      okButton.onclick = async ()=> {
        const loadingIcon = createTextIcon('loading');
        cancelButton.disabled = true;
        cancelButton.innerHTML=loadingIcon;
        okButton.disabled = true;
        okButton.innerHTML=loadingIcon;
        if (params.onOk) {
          try {
            await params.onOk();
          } catch (e) {
            cancelButton.disabled = false;
            cancelButton.innerText=params.cancelText||'取消';
            okButton.disabled = false;
            okButton.innerText=params.okText||'确定';
            return;
          }
        }
        panel.destroy(tag);
      };
      okButton.onmouseover= ()=>{
        okButton.style.opacity='0.8';
      };
      okButton.onmouseleave=()=>{
        okButton.style.opacity='1';
      };
      okButton.innerText=params.okText||'确定';
      const cancelButton = document.createElement('button');
      cancelButton.style.color = '#1890ff';
      cancelButton.style.background = '#ffffff';
      cancelButton.style.border = 'none';
      cancelButton.style.padding = '6px';
      cancelButton.style.outline = 'none';
      cancelButton.style.borderRadius='4px';
      cancelButton.style.border='1px solid #d9d9d9';
      cancelButton.onclick = async ()=> {
        const loadingIcon = createTextIcon('loading');
        cancelButton.disabled = true;
        cancelButton.innerHTML=loadingIcon;
        okButton.disabled = true;
        okButton.innerHTML=loadingIcon;
        if (params.onCancel) {
          try {
            await params.onCancel();
          } catch (e) {
            cancelButton.disabled = false;
            cancelButton.innerText=params.cancelText||'取消';
            okButton.disabled = false;
            okButton.innerText=params.okText||'确定';
          }
        }
        panel.destroy(tag);
      };
      cancelButton.onmouseover= ()=>{
        cancelButton.style.opacity='0.8';
      };
      cancelButton.onmouseleave=()=>{
        cancelButton.style.opacity='1';
      };
      cancelButton.innerText=params.cancelText||'取消';
      const buttonContainer = document.createElement('div');
      buttonContainer.style.gap='8px';
      buttonContainer.style.display = 'inline-flex';
      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(okButton);
      footer.appendChild(buttonContainer);
      modalContent.appendChild(header);
      modalContent.appendChild(content);
      modalContent.appendChild(footer);
      return [modalContent, content];
    }
    static createDom: (document:Document, params: IPanelParams) => [HTMLDivElement, HTMLDivElement, string, HTMLDivElement] = (document, params) => {
      const tag = new Date().getTime().toString()+Number.parseInt(`${Math.random()*100}`, 0);
      const mask = panel.createMask(document);
      const [modalContent, content] = panel.createModalContent(document, params, tag);
      return [mask, modalContent, tag, content];
    }
    static addDom: (mask:HTMLDivElement, modalContent: HTMLDivElement, tag:string) => string = (mask, modalContent, tag) => {
      mask.appendChild(modalContent);
      const length = panel.loop.length;
      let zIndex = '999999';
      if (length != 0) {
        zIndex = `${parseInt(panel.loop[length - 1].style.zIndex) + 1}`;
      }
      mask.style.zIndex = zIndex;
      setTimeout(() => {
        modalContent.style.top = `100px`;
        mask.style.background = `rgba(0,0,0,0.5)`;
      }, 0);

      panel.loop.push(mask);
      panel.map[tag] = mask;
      panel.body.appendChild(mask);
      return tag;
    }
    static removeDom = (domTag: string) => {
      const dom = panel.map[domTag];
      if (dom) {
        const length = panel.loop.length;
        for (let i = 0; i < length; i++) {
          if (panel.loop[i] == dom) {
            panel.loop = [...panel.loop.slice(0, i), ...panel.loop.slice(i + 1)];
            break;
          }
        }
        delete panel.map[domTag];
        dom.style.opacity = '0';
        setTimeout(() => {
          dom.remove();
        }, 280);
      }
    }
    static destroy :(tag?:string)=>void=(tag)=>{
      if (tag) {
        panel.removeDom(tag);
      } else {
        for (const tagKey in panel.map) {
          if (panel.map.hasOwnProperty(tagKey)) {
            panel.removeDom(tagKey);
          }
        }
      }
    }
}

export default panel;
