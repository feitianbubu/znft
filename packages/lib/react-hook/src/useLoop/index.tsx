import {useRef} from 'react';

/**
 * 队列
 */
class Loop {
    loop:{task:()=>Promise<any>, cb:(params?:any)=>Promise<void>}[]
    immediately:boolean|undefined=undefined
    isRunning:boolean=false;

    /**
     * 构造函数
     * @param immediately push之后是否立即执行
     */
    constructor(immediately?:boolean) {
      this.loop = [];
      this.immediately = immediately;
    }

    /**
     * push函数
     * @param task 任务
     * @param cb 回调
     */
    public push(task:()=>Promise<any>, cb:(params?:any)=>Promise<void>) {
      this.loop.push({
        task, cb,
      });
      if (this.immediately) {
        this.start().then();
      }
    }

    /**
     * 启动函数，如果immediately是false 那就需要手动启动
     */
    public async start() {
      if (this.loop.length!=0&&!this.isRunning) {
        this.isRunning = true;
        const current = this.loop[0];
        const res = await current.task();
        current.cb(res);
        this.loop.shift();
        this.isRunning=false;
        this.start().then();
      }
    }
}

export const useLoop = (immediately?:boolean)=>{
  const loop = useRef(new Loop(immediately));
  return loop.current;
};
