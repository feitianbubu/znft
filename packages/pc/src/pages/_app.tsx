import type { AppProps } from 'next/app'
import { CacheProvider } from '@emotion/react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createEmotionCache from "../config/createEmotionCache";
import theme from "../config/theme";
import {EmotionCache} from "@emotion/utils";
import Context from "../context";
import Layout from "../layout";
import React, {PropsWithChildren, useEffect} from "react";
import {Http} from "@lib/service";
import {
  getRestfulRequestFormInit,
  getRestfulRequestInit,
  getStaticRequestInit,
  restfulFetch,
  staticFetch
} from "@/pc/http";
import "nprogress/nprogress.css"
const clientSideEmotionCache = createEmotionCache();
interface  Props  extends AppProps {
  emotionCache:EmotionCache
}
Http.setRestfulFetch(restfulFetch);
Http.setRestfulRequestFormInit(getRestfulRequestFormInit);
Http.setRestfulRequestInit(getRestfulRequestInit);
Http.setStaticFetch(staticFetch);
Http.setStaticRequestInit(getStaticRequestInit);

const MyApp :React.FC<PropsWithChildren<any>> = (props)=>{
  useEffect(()=>{
    console.log('_app','mount')
  },[])
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return  <CacheProvider value={emotionCache}>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Context>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Context>
    </ThemeProvider>
  </CacheProvider>
}

export default React.memo(MyApp)
