const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');


const hasJsxRuntime = (() => {
    if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
        return false;
    }

    try {
        require.resolve('react/jsx-runtime');
        return true;
    } catch (e) {
        return false;
    }
})();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const isEnvDevelopment = true;
const isEnvProduction = !isEnvDevelopment;
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const paths = require('react-scripts/config/paths');
const getClientEnvironment = require('react-scripts/config/env');
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
const shouldUseReactRefresh = env.raw.FAST_REFRESH;

module.exports = {
    devtool: 'inline-source-map',
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [{loader:'style-loader'}, {loader:'css-loader'}]
        }, {
            test: /\.scss$/,
            use: [{loader:'style-loader'}, {loader:'css-loader'}, {loader:'sass-loader'}]
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'img/[name].[hash:7].[ext]'
            }
        },

            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                include: paths.appSrc,
                loader: require.resolve('babel-loader'),
                options: {
                    customize: require.resolve(
                        'babel-preset-react-app/webpack-overrides'
                    ),
                    presets: [
                        [
                            require.resolve('babel-preset-react-app'),
                            {
                                runtime: hasJsxRuntime ? 'automatic' : 'classic',
                            },
                        ],
                    ],
                    // @remove-on-eject-begin
                    babelrc: false,
                    configFile: false,
                    // Make sure we have a unique cache identifier, erring on the
                    // side of caution.
                    // We remove this when the user ejects because the default
                    // is sane and uses Babel options. Instead of options, we use
                    // the react-scripts and babel-preset-react-app versions.
                    cacheIdentifier: getCacheIdentifier(
                        isEnvProduction
                            ? 'production'
                            : isEnvDevelopment && 'development',
                        [
                            'babel-plugin-named-asset-import',
                            'babel-preset-react-app',
                            'react-dev-utils',
                            'react-scripts',
                        ]
                    ),
                    // @remove-on-eject-end
                    plugins: [
                        isEnvDevelopment &&
                        shouldUseReactRefresh &&
                        require.resolve('react-refresh/babel'),
                    ].filter(Boolean),
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                    // See #6846 for context on why cacheCompression is disabled
                    cacheCompression: false,
                    compact: isEnvProduction,
                },
            },


        ]
    },
    devServer: {
        // contentBase: './build',
        port: 8081, // 端口号
        // inline: true,
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlPlugin({
            template: 'public/index.html'
        })
    ]
}