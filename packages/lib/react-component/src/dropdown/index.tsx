import * as React from 'react';
import {useCallback, useMemo, useRef, useState} from 'react';
import {DropdownProps} from './interface';

export const Dropdown:React.FC<DropdownProps> = (props)=>{
  const {children, overlay, preShow, onClick} = props;
  const memoPreShow = useMemo(()=>preShow?preShow:undefined, [preShow]);
  const [visible, setVisible] = useState(false);
  const childrenRef = useRef<HTMLElement|null>(null);
  const handleOpen = useCallback(async ()=>{
    if (memoPreShow) {
      const bool = await memoPreShow();
      if (bool) {
        setVisible(true);
      }
    } else {
      setVisible(true);
    }
  }, [memoPreShow]);
  const handleClose = useCallback(()=>{
    setVisible(false);
  }, []);
  const cloneChildren = useMemo(()=>{
    const props:React.HTMLProps<HTMLElement> = {
      ref: (ref:HTMLElement)=>childrenRef.current = ref,
      onClick: handleOpen,
    };
    return React.cloneElement(children, props);
  }, [children, handleOpen]);
  const cloneOverlayChildren = useMemo(()=>{
    const children:React.ReactElement|React.ReactElement[] = overlay.props.children;
    if ( Array.isArray(children)) {
      return overlay.props.children.map((item:React.ReactElement)=>{
        const click = async (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
          const res = await item.props.onClick?.(e);
          onClick?.(e, item.key);
          if (res!=false) {
            handleClose();
          }
        };
        return React.cloneElement(item, {onClick: click});
      });
    } else {
      const click = async (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        const res = await children.props.onClick?.(e);
        onClick?.(e, children.key);
        if (res!=false) {
          handleClose();
        }
      };

      return React.cloneElement(children, {onClick: click});
    }
  }, [handleClose, onClick, overlay.props.children]);
  const cloneOverlay = useMemo(()=>{
    return React.cloneElement(overlay, {
      ...overlay.props,
      anchorEl: childrenRef.current,
      open: visible,
      onClose: handleClose,
      children: cloneOverlayChildren,
    });
  }, [cloneOverlayChildren, handleClose, overlay, visible]);

  return <>
    {cloneOverlay}
    {cloneChildren}
  </>;
};
export default Dropdown;
