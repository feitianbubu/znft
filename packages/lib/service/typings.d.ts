declare module '*.css';
declare module '*.scss';
declare module '*.less';
declare module '*.png';
declare module '*.svg';

/**
 * 第三方库 blueimp-load-image
 */
declare const loadImage :(file:File, callback:(image:HTMLCanvasElement)=>void, options:{[key:string]:string|boolean})=>void;
