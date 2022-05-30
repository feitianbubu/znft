export const html2Text = (html?:string|null)=>{
  if (!html) {
    return '';
  }
  return html.replace(/<[^>]*>|/g, '');
};
