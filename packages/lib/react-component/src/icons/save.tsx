import * as React from 'react';
const Save:React.FC<{style?:React.CSSProperties}> = (props)=>{
  const {style} = props;
  return <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="37687"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="14"
    height="14"
    style={style}
  >
    <defs>
      <style type="text/css"></style>
    </defs>
    <path
      d="M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184z m456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840z"
      p-id="37688"></path>
    <path
      d="M512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144z m0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"
      p-id="37689"></path>
  </svg>;
};
export const SaveIcon = React.memo(Save);
