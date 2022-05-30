import {getErrorMessage} from '@lib/util';
import {message} from '@lib/util';

export const getStaticRequestInit: (headers?: { [key: string]: string | number }, body?: any) => RequestInit = ( headers, body) => {
  const allHeaders: HeadersInit = {
    'Content-Type': 'application/json; charset=UTF-8',
    ...headers,
  };
  return {
    method: 'GET',
    headers: allHeaders,
  };
};
export const getRestfulRequestInit: (method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', headers?: { [key: string]: string | number }, body?: any) => RequestInit = (method, headers, body) => {
  const allHeaders: HeadersInit = {
    'Content-Type': 'application/json; charset=UTF-8',
    ...headers,
  };
  if (method == 'GET') {
    return {
      method: method,
      headers: allHeaders,
    };
  }
  return {
    method: method,
    headers: allHeaders,
    body: JSON.stringify(body),
  };
};
export const getRestfulRequestFormInit: (method: 'POST' | 'PUT' | 'DELETE' | 'PATCH', body: FormData | string, headers?: { [key: string]: string  }) => RequestInit = (method, body, headers) => {
  const allHeaders: HeadersInit = {

    ...headers,
  };
    // const token = getToken();
    // if (token) {
    //   allHeaders['Egu-Auth'] = token;
    // }
  return {
    method: method,
    headers: allHeaders,
    body: body,
  };
};
let logoutWarn: undefined | string = undefined;

export const restfulFetch = async <R>(requestUrl: string, requestInit: RequestInit, conversionFunc?: (params: any) => R) => {
  let url = requestUrl;
  if (!requestUrl.startsWith('http')) {
    url = process.env.NEXT_PUBLIC_API_URL + requestUrl;
  }
  let response: Response;
  try {
    response = await fetch(url, requestInit);
  } catch (e: any) {
    // console.log(e)
    console.log(e.message)
    message.error(e.message);
    return;
  }
  const status = response.status;
  const res =   await response.json();
  if (status == 401) {
    return;
  }
  if (status >= 400) {
    if(res.message){
      message.error(res.message as string);
    }else{
      message.error(getErrorMessage(response.status) as string);
    }

    return;
  }

  return conversionFunc ? conversionFunc(res) : res as R;


};
export const staticFetch = async <R>(requestUrl: string, requestInit: RequestInit) => {
  let url = requestUrl;
  if (!requestUrl.startsWith('http')) {
    url = process.env.NEXT_PUBLIC_API_URL + requestUrl;
  }
  let response: Response;
  try {
    response = await fetch(url, requestInit);
  } catch (e: any) {
    // console.log(e)
    // console.log(e.message)
    message.error(e.message);
    return;
  }
  const status = response.status;
  const responseStr = await response.text();
  if (status >= 400) {
    let text: any;
    try {
      text = eval(`(${responseStr})`) as R;
    } catch (error) {
      text = responseStr as any;
    }
    if (text.msg) {
      message.error(text.msg as string);
    } else {
      message.error(getErrorMessage(response.status) as string);
      console.error(url);
    }
    return;
  }
  let body: unknown = '';
  try {
    body = eval(`(${responseStr})`);
  } catch (e) {
  }
  return body as R;
};
