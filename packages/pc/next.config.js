// const { withSentryConfig } = require('@sentry/nextjs')
const lib = [
    '@lib/constant',
    '@lib/react-component',
  '@lib/react-context',
  '@lib/react-hook',
  '@lib/service',
  '@lib/util'
]
const withTM = require('next-transpile-modules')(lib);
/** @type {import('next').NextConfig} */
 const moduleExports = withTM({
  // webpack5:false,
  reactStrictMode: true,
  swcMinify: true,
  typescript:{
    tsconfigPath:'./tsconfig.json',
      // 因为node_modules/@ethersproject/contracts/src.ts/index.ts:143:5 中有类型错误，所以打包的时候跳过类型检查
      ignoreBuildErrors: true,
  },
  // compiler: {
  //   removeConsole: {
  //     exclude: ['error'],
  //   },
  // },
  compress:true,
    async rewrites() {
        return [
            {
                source: '/static/abi/:path*',
                destination: 'http://localhost:3080/static/abi/:path*'
            },
            {
                source: '/cos/lobbyplatform/:path*',
                destination: 'http://localhost:3080/cos/lobbyplatform/:path*'
            }
        ]
    }
})
module.exports = moduleExports;
// module.exports = withSentryConfig(moduleExports, {
//   // Additional config options for the Sentry Webpack plugin. Keep in mind that
//   // the following options are set automatically, and overriding them is not
//   // recommended:
//   //   release, url, org, project, authToken, configFile, stripPrefix,
//   //   urlPrefix, include, ignore
//   silent: true, // Suppresses all logs
//   // For all available options, see:
//   // https://github.com/getsentry/sentry-webpack-plugin#options.

// })
