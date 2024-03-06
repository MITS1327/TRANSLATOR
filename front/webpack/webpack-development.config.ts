import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExternalTemplateRemotesPlugin from 'external-remotes-plugin';

import webpack, { Configuration } from 'webpack';
import { dependencies as deps } from '../package.json';

import { Env } from './types';

const output = path.resolve(__dirname, '../build');

const developmentConfig = (env: Env): Configuration => {
  const { ENVNAME, CI_URL } = env;
  delete deps['mcn-ui-components'];

  return {
    mode: 'development',
    output: {
      path: output,
      filename: '[name].js',
      publicPath: '/',
      clean: true,
    },
    devtool: 'eval-cheap-module-source-map',
    plugins: [
      new ExternalTemplateRemotesPlugin(),
      new webpack.container.ModuleFederationPlugin({
        name: 'translator',
        filename: 'remoteEntry.js',
        remotes: {
          topbar: 'topbar@[window.topbarUrl]/remoteEntry.js',
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
        title: 'Development',
        filename: 'index.html',
        favicon: path.resolve(__dirname, '../public', ENVNAME === 'euprod' ? 'faviconEu.ico' : 'faviconRu.ico'),
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"',
        Domain: JSON.stringify(CI_URL),
        EnvName: JSON.stringify(ENVNAME),
      }),
    ],
    optimization: {
      runtimeChunk: true,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },
  };
};

export default developmentConfig;
