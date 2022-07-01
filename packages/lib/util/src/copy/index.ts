const makeError = ()=> {
  return new DOMException('The request is not allowed', 'NotAllowedError');
};
const copyClipboardApi=(text:string)=> {
  // Use the Async Clipboard API when available. Requires a secure browsing
  // context (i.e. HTTPS)
  if (!globalThis?.navigator?.clipboard) {
    throw makeError();
  }
  return globalThis.navigator.clipboard.writeText(text);
};
const copyExecCommand = async (text:string)=> {
  // Put the text to copy into a <span>
  const document = globalThis.document;
  if (document) {
    const span = document.createElement('span');
    span.textContent = text;

    // Preserve consecutive spaces and newlines
    span.style.whiteSpace = 'pre';
    span.style.userSelect = 'auto';
    span.style.userSelect = 'all';

    // Add the <span> to the page
    globalThis?.document.body.appendChild(span);

    // Make a selection object representing the range of text selected by the user
    const selection = window.getSelection();
    const range = window.document.createRange();
    if (selection) {
      selection.removeAllRanges();
      range.selectNode(span);
      selection.addRange(range);
      // Copy text to the clipboard
      let success = false;
      try {
        success = document.execCommand('copy');
      } finally {
        // Cleanup
        selection.removeAllRanges();
        document.body.removeChild(span);
      }

      if (!success) throw makeError();
    }
  } else {
    makeError();
  }
};
export const copy = async (text:string)=>{
  try {
    await copyClipboardApi(text);
    return true;
  } catch (err) {
    // ...Otherwise, use document.execCommand() fallback
    try {
      await copyExecCommand(text);
      return true;
    } catch (err2) {
      throw (err2 || err || makeError());
      return false;
    }
  }
};
