// 🧠 Agent Dr Girlfriend - Pure Open Source Build Configuration
// Replacing Vite with Webpack 5 for maximum transparency and control

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import webpack from 'webpack';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const shouldAnalyze = process.env.ANALYZE === 'true';

export default {
    mode: isProduction ? 'production' : 'development',

    entry: './src/app.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? '[name].[contenthash].js' : '[name].js',
        clean: true,
        publicPath: '/',
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    module: {
        rules: [
            // JavaScript/JSX Processing
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                useBuiltIns: 'usage',
                                corejs: 3,
                                targets: { browsers: ['>0.25%', 'not dead', 'not ie 11'] },
                                modules: false // Keep ES modules for webpack to handle
                            }],
                            ['@babel/preset-react', { runtime: 'automatic' }]
                        ],
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-transform-class-properties'
                        ]
                    }
                }
            },

            // CSS Processing
            {
                test: /\.css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },

            // Asset Processing
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name].[hash][ext]'
                }
            },

            // Font Processing
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash][ext]'
                }
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                NODE_ENV: process.env.NODE_ENV || 'development',
                AI_PROVIDER: process.env.AI_PROVIDER,
                OPENAI_API_KEY: process.env.OPENAI_API_KEY,
                ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
                LOCAL_AI_URL: process.env.LOCAL_AI_URL,
                OLLAMA_URL: process.env.OLLAMA_URL,
                OLLAMA_MODEL: process.env.OLLAMA_MODEL
            })
        }),

        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body',
            minify: isProduction ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            } : false
        }),

        ...(isProduction ? [
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css',
                chunkFilename: 'css/[id].[contenthash].css'
            }),
            new CompressionPlugin({
                algorithm: 'gzip',
                test: /\.(js|css|html|svg)$/,
                threshold: 8192,
                minRatio: 0.8
            })
        ] : []),

        ...(shouldAnalyze ? [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
                reportFilename: 'bundle-report.html'
            })
        ] : [])
    ],

    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: isProduction,
                        drop_debugger: isProduction,
                        pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : [],
                        passes: 2
                    },
                    mangle: {
                        safari10: true
                    },
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            }),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                            normalizeWhitespace: true
                        }
                    ]
                }
            })
        ],

        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 200000,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: -10,
                    chunks: 'all',
                    maxSize: 200000
                },
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'react',
                    priority: 20,
                    chunks: 'all'
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 30
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    priority: 5,
                    chunks: 'all',
                    reuseExistingChunk: true
                }
            }
        },

        usedExports: true,
        sideEffects: false
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3004,
        open: true,
        hot: true,
        historyApiFallback: true,
        compress: true,
        client: {
            overlay: {
                errors: true,
                warnings: false
            }
        }
    },

    devtool: isProduction ? 'source-map' : 'eval-source-map',

    performance: {
        hints: isProduction ? 'warning' : false,
        maxEntrypointSize: 300000, // 300KB
        maxAssetSize: 300000, // 300KB
        assetFilter: (assetFilename) => {
            return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
        }
    },

    stats: {
        errorDetails: true,
        children: true
    }
};
