import * as React from 'react';

export const useOthers:<T>(object:T)=>T = (object) => {
  // todo 每次都会执行两次 这也是个问题
  const [_object, set_object] = React.useState<typeof object>(object);
  React.useEffect(()=>{
    for (const objectKey in object) {
      if (Object.prototype.hasOwnProperty.call(object, objectKey)) {
        if (object[objectKey]!=_object[objectKey]) {
          set_object(object);
          return;
        }
      }
    }
  }, [_object, object]);
  return _object;
};


