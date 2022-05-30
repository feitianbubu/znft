// const router = useRouter()
// router.asPath
export const asPath2Search = (asPath:string)=>{
  const index = asPath.indexOf('?');
  return asPath.slice(index);
};
export const getParamsFormRouterSearch: <T extends { [key: string]: string }>(urlSearch: string) => T = (urlSearch) => {
  const urlSearchParams = new URLSearchParams(urlSearch);
  return Object.fromEntries(urlSearchParams.entries()) as any;
};
