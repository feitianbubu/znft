import type {AppProps} from 'next/app'
import {CacheProvider} from '@emotion/react';
import Head from 'next/head';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createEmotionCache from "../config/createEmotionCache";
import {EmotionCache} from "@emotion/utils";
import Context from "../context";
import Layout from "../layout";
import React, {PropsWithChildren, useMemo} from "react";
import {Http} from "@lib/service";
import {
  getRestfulRequestFormInit,
  getRestfulRequestInit,
  getStaticRequestInit,
  restfulFetch,
  staticFetch
} from "@/pc/http";
import "nprogress/nprogress.css"
import "swagger-ui-react/swagger-ui.css"
import "../styles/swagger-dark.css"

const clientSideEmotionCache = createEmotionCache();
interface  Props  extends AppProps {
  emotionCache:EmotionCache
}
Http.setRestfulFetch(restfulFetch);
Http.setRestfulRequestFormInit(getRestfulRequestFormInit);
Http.setRestfulRequestInit(getRestfulRequestInit);
Http.setStaticFetch(staticFetch);
Http.setStaticRequestInit(getStaticRequestInit);

// 持久化空变量
const empty = {}
const MyApp :React.FC<PropsWithChildren<Props>> = (props)=>{
  /**
   * 这个next 的pageProps 每次下发都是匿名变量 永远都是浅对比 永远是false 造成重复diff,这个是无法避免的，pageProps是做ssr的核心数据，所以尽量减少路由的使用
   * 第二个就是无外部数据的组建一定要用memo包裹
   */
  const { Component, emotionCache , pageProps } = props;
  const memoEmotionCache = useMemo(()=>emotionCache?emotionCache:clientSideEmotionCache,[emotionCache])
  const memoPageProps = useMemo(()=>pageProps?pageProps:empty,[pageProps])
  return  <CacheProvider value={memoEmotionCache}>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />

      {/*https://docs.metamask.io/guide/defining-your-icon.html*/}
      {/*<link rel={'shortcut icon'} href={'https://bkimg.cdn.bcebos.com/pic/5366d0160924ab188166165032fae6cd7b890b60'}/>*/}
    </Head>

      <CssBaseline />
      <Context>
        <Layout>
          <Component {...memoPageProps} />
        </Layout>
      </Context>
  </CacheProvider>
}

export default MyApp
