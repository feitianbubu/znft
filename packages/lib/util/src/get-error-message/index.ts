export const getErrorMessage: (statusCode: number) => string | undefined = (statusCode) => {
  const statusMsgMap: { [propsName: string]: string } = {
    400: '请求的参数错误，请稍后重试（400 Bad Request）',
    401: '用户未登陆或登陆已失效（401 Unauthorized）',
    403: '用户无权限（403 Forbidden）',
    404: '服务器发生了一个错误，请稍后重试（404 Not Found）',
    405: '请求的方法不允许（405 Method Not Allowed）',
    406: '无法访问（406 Not Acceptable）',
    407: '代理服务器未认证（407 Proxy Authentication Required）',
    408: '请求超时，请稍后重试（408 Request Timeout）',
    409: '请求冲突，请稍后重试（409 Conflict）',
    410: '请求的资源已经不存在（410 Gone）',
    417: '请求的参数错误，请稍后重试（417 Expectation Failed）',
    500: '服务器发生了一个错误，请稍后重试（500 Internal Server Error）',
    501: '服务未实现（501 Not Implemented）',
    502: '网关错误（502 Bad Gateway）',
    503: '服务器发生了一个错误，请稍后重试（503 Service Unavailable）',
    504: '请求超时，请稍后重试（504 Gateway Timeout）',
    505: '请求的参数错误，请稍后重试（505 HTTP Version Not Supported）',
  };
  return statusMsgMap[statusCode];
};
