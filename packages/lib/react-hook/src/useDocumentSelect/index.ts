/**
 * 是否开启鼠标按住拖动时选中文字的功能 true是开 false是关
 * @param {boolean} defaultCtrl
 * @return {void}
 */
import * as React from 'react';

export const useDocumentSelect: () => [(ctrl: boolean) => void] = () => {
  const ctrl: (ctrl: boolean) => void = React.useCallback((ctrl) => {
    if (ctrl) {
      globalThis?.document?.body.setAttribute('style', '');
    } else {
      globalThis?.document?.body.setAttribute('style', 'user-select:none;');
    }
  }, []);
  return [ctrl];
};

