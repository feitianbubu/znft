export const blob2File: (blob: Blob, suffix: string, fileType: string | undefined, fileName?: string) => File = (blob, suffix, fileType, fileName) => {
  // const date = new Date();
  return new File([blob], `${fileName || new Date().getTime()}.${suffix}`, {type: fileType});
};
export const asyncFile2Blob: (file: File) => Promise<Blob> = (file) => {
  return new Promise((resolve, reject) => {
    // ... some code
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      // target.result 该属性表示目标对象的DataURL
      const result = e.target?.result;
      if (result == null || result == undefined) {
        reject(new Error('error'));
      } else if (typeof result == 'object') {
        resolve(new Blob([result]));
      } else {
        const arr = result.split(',');
        const arr2 = arr[0].match(/:(.*?);/);
        if (!arr2) {
          reject(new Error('error'));
        } else {
          const mime = arr2[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          resolve(new Blob([u8arr], {type: mime}));
        }
      }
    };
    reader.onerror = (e) => {
      reject(e.target?.result);
    };
  });
};
export const base642File:(dataUrl: string, fileName?: string)=>File|undefined = (dataUrl, fileName)=> {
  const [type, data] = dataUrl.split(',');
  const mimeList = type?.match(/:(.*?);/);
  if (!mimeList) {
    return undefined;
  }
  const mime =mimeList[1];
  const bstr = atob(data);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const [, suffix] = mime.split('/');
  const _fileName = fileName||`${new Date().getTime().toString()}.${suffix}`;
  return new File([u8arr], _fileName, {type: mime});
};
export const string2ArrayBuffer:(str:string)=>ArrayBuffer = (str)=> {
  const buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
  const bufView = new Uint16Array(buf);
  for (let i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
export const asyncFile2ArrayBuffer: (file: File) => Promise<ArrayBuffer> = (file) => {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.readAsArrayBuffer(file);
    r.onloadend = () => {
      const result = r.result;
      if (result == null || result == undefined) {
        reject(new Error('error'));
      } else if (typeof result == 'string') {
        resolve(string2ArrayBuffer(result));
      } else {
        resolve(result);
      }
    };
  });
};
export const asyncArrayBuffer2String: (u: BlobPart) => Promise<string> = (u) => {
  return new Promise((resolve, reject) => {
    const b = new Blob([u]);
    const r = new FileReader();
    r.readAsText(b, 'utf-8');
    r.onload = () => {
      const result = r.result;
      if (result == null || result == undefined) {
        reject(new Error('error'));
      } else if (typeof result == 'string') {
        resolve(result);
      } else {
        reject(new Error('error'));
      }
    };
  });
};
export const asyncCanvas2Blob: (canvas: HTMLCanvasElement) => Promise<Blob> = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error(''));
      }
    }, 'image/png', 1);
  });
};
export const asyncFile2Base64: (file: File) => Promise<string> = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      const result = e.target?.result;
      if (result == null || result == undefined) {
        reject(new Error('error'));
      } else if (typeof result == 'string') {
        resolve(result);
      } else {
        reject(new Error('error'));
      }
    };
  });
};
export const asyncBlob2Base64: (blob: Blob) => Promise<string> = (blob) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onload = (e) => {
      const result = e.target?.result;
      if (result == null || result == undefined) {
        reject(new Error('error'));
      } else if (typeof result == 'string') {
        resolve(result);
      } else {
        reject(new Error('error'));
      }
    };
  });
};
export const asyncCanvas2Base64: (canvas: HTMLCanvasElement) => Promise<string> = async (canvas) => {
  const blob = await asyncCanvas2Blob(canvas);
  return await asyncBlob2Base64(blob);
};
/**
 * 修正exif 大概意思就是图片的转向有时候是错的
 * @param file
 */
export const asyncFile2EXIFCanvas: (file: File) => Promise<HTMLCanvasElement> = (file) => {
  return new Promise((resolve, reject) => {
    loadImage(file, (img) => {
      if (img) {
        resolve(img);
      } else {
        reject(new Error(''));
      }
    }, {orientation: true, canvas: true});
  });
};
export const canvas2Base64: (canvas: HTMLCanvasElement) => string = (canvas: HTMLCanvasElement) => {
  return canvas.toDataURL(`image/jpeg`);
};

export const asyncFile2Canvas:(file:File)=>Promise<HTMLCanvasElement> = (file)=>{
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);// 读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src
    reader.onload = function(event) {
      const image = new Image();
      const result = event?.target?.result;
      if (typeof result =='string') {
        image.src = result;
      } else if (Array.isArray(result)) {
        image.src = result.toString()||'';
      } else {
        reject(new Error(''));
      }
      image.onload = function() {
        const canvas = document.createElement('canvas');
        const imageCanvas = canvas.getContext('2d');
        if (imageCanvas) {
          imageCanvas.drawImage(image, 0, 0, 300, 300);
        } else {
          reject(new Error(''));
        }

        resolve(canvas);
      };
    };
  });
};
export const image2Canvas:(image:HTMLImageElement)=>HTMLCanvasElement = (image)=>{
  const canvas = document.createElement('canvas');
  const imageCanvas = canvas.getContext('2d');
  if (imageCanvas) {
    imageCanvas.drawImage(image, 0, 0, 300, 300);
  } else {
    throw new Error('');
  }

  return canvas;
};
/**
 * 这个是获取image 但是没有判断onload 生命周期是读取file生成image 获取image，业务中适合放到某处不再进行操作、不关注后续
 * @param file
 */
export const asyncFile2Image: (file: File) => Promise<HTMLImageElement> = (file) => {
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);// 读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src
    reader.onload = function(event) {
      const img = document.createElement('img');
      if (typeof event?.target?.result == 'string') {
        img.src = event.target.result;
        resolve(img);
      } else if (Array.isArray(event?.target?.result)) {
        img.src = event?.target?.result.toString()||'';
        resolve(img);
      } else {
        reject(new Error(''));
      }
    };
  });
};
/**
 * 区别于asyncFile2Image 这个是在image onload以后再返回，主要是关注image本身的参数，例如获取宽高等
 * @param file
 */
export const asyncFile2ImageAfterLoad:(file:File)=>Promise<HTMLImageElement> = (file)=>{
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e)=>{
      const image = new Image();
      const result = e.target?.result;
      if (typeof result =='string') {
        image.src = result;
      } else if (Array.isArray(result)) {
        image.src = result.toString()||'';
      } else {
        reject(new Error(''));
      }
      image.onload = ()=> {
        resolve(image); // 这里就是上传图片的宽和高了
      };
    };
  });
};
export const getFilePrefix = ( fileName:string)=> {
  if (fileName == null ) {
    return null;
  }
  if (!fileName.includes('.')) {
    return fileName;
  }
  return fileName.substring(0, fileName.lastIndexOf('.'));
};

export const getFileSuffix = ( fileName:string)=> {
  if (fileName == null ) {
    return null;
  }
  if (!fileName.includes('.')) {
    return fileName;
  }
  return fileName.substring(fileName.lastIndexOf('.')+1);// 从最后一个点之后截取字符串
};
