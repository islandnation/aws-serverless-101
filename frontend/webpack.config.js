var path = require('path'),
    webpack = require('webpack');

//Importing plugins
var CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;

module.exports = (isDev) => {
    //Setup plugins
    var plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor", "polyfill"],
            minChunks: Infinity
        }),
        new CheckerPlugin()
    ];

    //Setup outputs
    var outputPath = path.join(__dirname, "dist");

    if (!isDev) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            sourceMap: true,
            output: {
                comments: false
            },
            mangle: {
                screw_ie8: true
            },
            compress: {
                screw_ie8: true,
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
                negate_iife: false // we need this for lazy v8
            }
        }));
    }

    var output = {
        path: outputPath,
        filename: '[name].js'
    }
    if (!isDev) {
        output.filename = '[name].js';
        output.sourceMapFilename = '[name].map';
        output.chunkFilename = '[id].chunk.js';
    }

    return {
        cache: !!isDev,
        watch: !!isDev,
        watchOptions: {
            aggregateTimeout: 100,
            ignored: /node_modules/
        },
        entry: {
            app: './app/main.ts',
            polyfill: './app/polyfill.ts',
            vendor: './app/vendor.ts'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        output: output,
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://localhost:3000/',
                    secure: true,
                    changeOrigin: true
                }
            },
            inline: true,
            hot: !!isDev,
            compress: true,
            contentBase: outputPath,
            historyApiFallback: true,
            stats: {
                colors: true
            },
            watchOptions: {
                poll: true
            }
        },
        plugins: plugins,
        devtool: (isDev) ? 'eval' : 'source-map',
        module: {
            exprContextCritical: false,
            loaders: [
                {
                    test: /\.ts?$/,
                    loaders: ['awesome-typescript-loader', 'angular2-template-loader']
                },
                {
                    test: /\.css?$/,
                    loaders: ['raw-loader']
                },
                {
                    test: /\.json?$/,
                    loaders: ['json-loader']
                },
                {
                    test: /\.(html)$/,
                    loader: 'html-loader'
                }
            ]
        }
    }
};