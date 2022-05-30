const cacheTime = 1000*60*20;

export type IList<T> = T[]
export interface IListResponse<T> {
  total:number, // 总条数
  size:number, // 单页条数
  current:number, // 当前页码，从1开始
  pages:number, // 总页
  records:T[]
}
export const emptyListResponse = {
  total: 0, // 总条数
  size: 20, // 单页条数
  current: 1, // 当前页码，从1开始
  pages: 1, // 总页
  records: [],
};
export interface IResponse<T> {
  code:number,
  msg:string,
  data:T
}

/**
 * 请求队列，同一请求只请求一次，相当于拦截器
 * 这个是底层拦截器 只是拦截同时间同一种请求，不回对业务请求拦截（例如 不会拦截 20分钟内重复请求同一个字典）
 */
class fetchLoop {
  private static loop:{[key:string]:{isFetching:boolean, cb:Function[]}}={};
  /**
   *
   * @param key 请求的唯一key 一般用method+url+params组成
   * @param fetch 请求 通过key来决定要不要请求，所以即使两个请求不同 但是同一个key 还是会中断
   * @param cb 数据回调 取消的请求也需要有数据
   */
  public static push(key:string, fetch:()=>Promise<any>, cb:(res:any)=>void) {
    // init
    this.loop[key]||(this.loop[key]={isFetching: false, cb: []});
    // 添加回调用
    this.loop[key]?.cb.push(cb);
    // 如果一个接口在fetch中就取消
    if (this.loop[key].isFetching) {
      return;
    } else {
      // 开始请求
      this.loop[key].isFetching=true;
      fetch().then((res:any)=>{
        this.loop[key].isFetching=false;
        for (const item of this.loop[key].cb) {
          item(res);
        }
      });
    }
  }
}

/**
 * push的async包装
 * @param cacheKey
 * @param fetch
 */
const loopFetch:(cacheKey:string, fetch:()=>Promise<any>)=>any = (cacheKey, fetch)=>{
  return new Promise(function(resolve) {
    fetchLoop.push(cacheKey, fetch, (res)=>{
      resolve(res);
    });
  });
};
/**
 * static Http
 */
export class Http {
  private static cache:{
    [key:string]:{ time:number,
      data:any}
  }={};
  private static staticRequestInit : (headers?: { [key: string]: string }) => RequestInit;
  private static restfulRequestInit : (method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', headers?: { [key: string]: string }, body?: any) => RequestInit;
  private static restfulRequestFormInit:(method: 'POST' | 'PUT' | 'DELETE' | 'PATCH', body: FormData|string, headers?: { [key: string]: string }) => RequestInit;
  private static restfulFetch:<R>(requestUrl: string, requestInit: RequestInit, conversionFunc?:(params:any)=>R)=>Promise<any>;
  private static staticFetch:(requestUrl: string, requestInit: RequestInit)=>Promise<any>;
  public static setStaticFetch =(staticFetch:(requestUrl: string, requestInit: RequestInit)=>Promise<any>)=>{
    Http.staticFetch = staticFetch;
  }
  public static setStaticRequestInit =(staticRequestInit:( headers?: { [key: string]: string }) => RequestInit)=>{
    Http.staticRequestInit = staticRequestInit;
  }
  public static setRestfulFetch =(restfulFetch:<R>(requestUrl: string, requestInit: RequestInit, conversionFunc?:(params:any)=>R)=>Promise<any>)=>{
    Http.restfulFetch = restfulFetch;
  }
  public static setRestfulRequestFormInit =(restfulRequestFormInit:(method: 'POST' | 'PUT' | 'DELETE' | 'PATCH', body: FormData|string, headers?: { [key: string]: string }) => RequestInit)=>{
    Http.restfulRequestFormInit = restfulRequestFormInit;
  }
  public static setRestfulRequestInit =(restfulRequestInit:(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', headers?: { [key: string]: string }, body?: any) => RequestInit)=>{
    Http.restfulRequestInit = restfulRequestInit;
  }
  /**
   * http static请求
   * @param url {string}
   * @param parameter {any}
   * @param headers {Headers}
   */
  public static async static <R>(url: string, parameter?: { [key: string]: any }, headers?: { [key: string]:string }):Promise<R|undefined> {
    let parameterStr = '?';
    if (parameter) {
      for (const key in parameter) {
        if (Object.prototype.hasOwnProperty.call(parameter, key)&&parameter[key]!=undefined) {
          parameterStr += (key + '=' + encodeURIComponent(parameter[key]) + '&');
        }
      }
    }
    parameterStr = parameterStr.substring(0, parameterStr.length - 1);
    const requestUrl = url + parameterStr;
    const requestInit: RequestInit = Http.staticRequestInit(headers);
    const result: R|undefined = await Http.staticFetch(requestUrl, requestInit);

    return result;
  }
  /**
   * http get请求
   * @param url {string}
   * @param parameter {any}
   * @param headers {Headers}
   * @param isCache 是否长时间缓存
   * @param force 长时间缓存的情况下 本次是否强制请求并更新缓存
   * @param conversionFunc 转换res到指定类型的转换函数，缓存的数据也是转换后的结果
   */
  public static async get <R>(url: string, parameter?: { [key: string]: any }, headers?: { [key: string]:string }, isCache?:boolean, force?:boolean, conversionFunc?:(params:any)=>R):Promise<R|undefined> {
    const cacheKey = parameter?`get${url}${JSON.stringify(parameter)}`:`get${url}`;
    const currentTime = new Date().getTime();
    // init
    if (isCache) {
      this.cache[cacheKey]||(this.cache[cacheKey]={data: undefined, time: 0});
    }
    if (isCache && currentTime-Http.cache[cacheKey].time<cacheTime&&!force ) {
      return Http.cache[cacheKey].data;
    } else {
      let parameterStr = '?';
      if (parameter) {
        for (const key in parameter) {
          if (Object.prototype.hasOwnProperty.call(parameter, key)&&parameter[key]!=undefined) {
            parameterStr += (key + '=' + encodeURIComponent(parameter[key]) + '&');
          }
        }
      }
      parameterStr = parameterStr.substring(0, parameterStr.length - 1);
      const requestUrl = url + parameterStr;
      const requestInit: RequestInit = Http.restfulRequestInit('GET', headers);
      const result: R|undefined = await loopFetch(cacheKey, ()=>Http.restfulFetch<R>(requestUrl, requestInit, conversionFunc));
      // const _result = this.conversion<R>(result, conversionFunc);
      if (isCache) {
        this.cache[cacheKey].time=currentTime;
        this.cache[cacheKey].data = result;
      }
      return result;
    }
  }

  /**
   * http post 请求
   * @param url {string}
   * @param parameter {any}
   * @param headers {Headers}
   */
  public static async post <R>(url: string, parameter?: { [key: string]: any }, headers?: { [key: string]:string }, isCache?:boolean, force?:boolean, conversionFunc?:(params:any)=>R) :Promise<R|undefined> {
    const cacheKey = parameter?`post${url}${JSON.stringify(parameter)}`:`post${url}`;
    const currentTime = new Date().getTime();
    // init
    if (isCache) {
      this.cache[cacheKey]||(this.cache[cacheKey]={data: undefined, time: 0});
    }
    if (isCache && currentTime-Http.cache[cacheKey].time<cacheTime&&!force ) {
      return Http.cache[cacheKey].data;
    } else {
      const requestInit: RequestInit = Http.restfulRequestInit('POST', headers, parameter);
      const result: R|undefined = await Http.restfulFetch<R>(url, requestInit, conversionFunc);
      if (isCache) {
        this.cache[cacheKey].time=currentTime;
        this.cache[cacheKey].data = result;
      }
      return result;
    }
  }
  /**
   * http post 请求 对于body是dataForm
   * @param url {string}
   * @param parameter {any}
   * @param headers {Headers}
   */
  public static async postForm<R>(url: string, parameter: FormData|string, headers?: { [key: string]:string }, isCache?:boolean, force?:boolean, conversionFunc?:(params:any)=>R):Promise<R|undefined> {
    const cacheKey = parameter?`${url}${JSON.stringify(parameter)}`:url;
    const currentTime = new Date().getTime();
    // init
    if (isCache) {
      this.cache[cacheKey]||(this.cache[cacheKey]={data: undefined, time: 0});
    }
    if (isCache && currentTime-Http.cache[cacheKey].time<cacheTime&&!force ) {
      return Http.cache[cacheKey].data;
    } else {
      const requestInit: RequestInit = Http.restfulRequestFormInit('POST', parameter, headers);
      const result: R|undefined = await Http.restfulFetch<R>(url, requestInit, conversionFunc);
      if (isCache) {
        this.cache[cacheKey].time=currentTime;
        this.cache[cacheKey].data = result;
      }
      return result;
    }
  }
  /**
   * http put 请求
   * @param url {string}
   * @param parameter {any}
   * @param headers {Headers}
   */
  public static async put <R>(url: string, parameter?: { [key: string]:any }, headers?: { [key: string]:string }, isCache?:boolean, force?:boolean, conversionFunc?:(params:any)=>R):Promise<R|undefined> {
    const cacheKey = parameter?`${url}${JSON.stringify(parameter)}`:url;
    const currentTime = new Date().getTime();
    // init
    if (isCache) {
      this.cache[cacheKey]||(this.cache[cacheKey]={data: undefined, time: 0});
    }
    if (isCache && currentTime-Http.cache[cacheKey].time<cacheTime&&!force ) {
      return Http.cache[cacheKey].data;
    } else {
      const requestInit: RequestInit = Http.restfulRequestInit('PUT', headers, parameter);
      const result: R|undefined = await Http.restfulFetch<R>(url, requestInit, conversionFunc);
      if (isCache) {
        this.cache[cacheKey].time=currentTime;
        this.cache[cacheKey].data = result;
      }
      return result;
    }
  }
  /**
   * http patch 请求
   * @param url {string}
   * @param parameter {any}
   * @param headers {Headers}
   */
  public static async patch <R>(url: string, parameter?: { [key: string]: number | string }, headers?: { [key: string]:string }, isCache?:boolean, force?:boolean, conversionFunc?:(params:any)=>R):Promise<R|undefined> {
    const cacheKey = parameter?`${url}${JSON.stringify(parameter)}`:url;
    const currentTime = new Date().getTime();
    // init
    if (isCache) {
      this.cache[cacheKey]||(this.cache[cacheKey]={data: undefined, time: 0});
    }
    if (isCache && currentTime-Http.cache[cacheKey].time<cacheTime&&!force ) {
      return Http.cache[cacheKey].data;
    } else {
      const requestInit: RequestInit = Http.restfulRequestInit('PATCH', headers, parameter);
      const result: R|undefined = await Http.restfulFetch<R>(url, requestInit, conversionFunc);
      if (isCache) {
        this.cache[cacheKey].time=currentTime;
        this.cache[cacheKey].data = result;
      }
      return result;
    }
  }
  /**
   * http delete 请求
   * @param url {string}
   * @param parameter {any}
   * @param headers {Headers}
   */
  public static async delete <R>(url: string, parameter?: { [key: string]: any}, headers?: { [key: string]:string }, isCache?:boolean, force?:boolean, conversionFunc?:(params:any)=>R):Promise<R|undefined> {
    const cacheKey = parameter?`${url}${JSON.stringify(parameter)}`:url;
    const currentTime = new Date().getTime();
    // init
    if (isCache) {
      this.cache[cacheKey]||(this.cache[cacheKey]={data: undefined, time: 0});
    }
    if (isCache && currentTime-Http.cache[cacheKey].time<cacheTime&&!force ) {
      return Http.cache[cacheKey].data;
    } else {
      const requestInit: RequestInit = Http.restfulRequestInit('DELETE', headers, parameter);
      const result: R|undefined = await Http.restfulFetch<R>(url, requestInit, conversionFunc);
      if (isCache) {
        this.cache[cacheKey].time=currentTime;
        this.cache[cacheKey].data = result;
      }
      return result;
    }
  }
}
export default Http;
