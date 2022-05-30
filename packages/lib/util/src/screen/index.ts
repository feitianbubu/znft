export const fullscreen = async (dom?:HTMLElement|null)=>{
  const fullscreenEnabled = globalThis?.document?.fullscreenEnabled;
  if (fullscreenEnabled&&dom) {
    return await dom.requestFullscreen();
  }
  return undefined;
};
export const exitFullscreen = ()=>{
  const fullscreenElement = globalThis?.document?.fullscreenElement;
  if (fullscreenElement) {
    return globalThis?.document?.exitFullscreen();
  } else {
    return undefined;
  }
};
export const isFullscreen=()=>{
  return globalThis?.document?.fullscreenElement;
};
