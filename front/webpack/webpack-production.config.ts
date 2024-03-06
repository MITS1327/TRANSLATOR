import path from 'path';
import webpack, { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExternalTemplateRemotesPlugin from 'external-remotes-plugin';
import { EsbuildPlugin } from 'esbuild-loader';
import CompressionPlugin from 'compression-webpack-plugin';
import { dependencies as deps } from '../package.json';

import { Env } from './types';

const output = path.resolve(__dirname, '../build');

const productionConfig = (env: Env): Configuration => {
  const { ENVNAME, CI_URL } = env;
  delete deps['mcn-ui-components'];

  const topbarHostName = 'topbar@[window.topbarUrl]/remoteEntry.js';

  return {
    mode: 'production',
    watch: false,
    output: {
      path: output,
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].chunk.js',
      publicPath: 'auto',
    },
    devtool: false,
    plugins: [
      new ExternalTemplateRemotesPlugin(),
      new webpack.container.ModuleFederationPlugin({
        name: 'translator',
        filename: 'remoteEntry.js',
        remotes: {
          topbar: topbarHostName,
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public', ENVNAME === 'euprod' ? 'indexEu.html' : 'indexRu.html'),
        title: 'Production',
        filename: 'index.html',
        favicon: path.resolve(__dirname, '../public', ENVNAME === 'euprod' ? 'faviconEu.ico' : 'faviconRu.ico'),
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        Domain: JSON.stringify(CI_URL),
        EnvName: JSON.stringify(ENVNAME),
      }),
      new webpack.container.ModuleFederationPlugin({
        name: "translator",
        filename: "remoteEntry.js",
        remotes: {},
        exposes: {
          './Translator': './src/app'
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps['react'],
          },
          'react-dom': {
            requiredVersion: deps['react-dom'],
            singleton: true,
          },
        },
      }),
      new EsbuildPlugin({
        define: {
          'process.env.NODE_ENV': JSON.stringify('production'),
          Domain: JSON.stringify(CI_URL || 'translator-dev.mcn.loc'),
          EnvName: JSON.stringify(ENVNAME || 'dev'),
        },
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new CompressionPlugin({
        test: /\.(js|css)$/i,
        filename: '[path][name][ext].gz',
        algorithm: 'gzip',
        deleteOriginalAssets: false,
        compressionOptions: { level: 9 },
        minRatio: Number.MAX_SAFE_INTEGER,
      }),
    ],
    optimization: {
      usedExports: false,
      minimize: true,
      runtimeChunk: { name: 'runtime' },
      chunkIds: 'named',
      minimizer: [
        new EsbuildPlugin({
          target: 'es2022',
          css: true,
        }),
      ],
    },
  };
};

export default productionConfig;
