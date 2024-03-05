import path from 'path';
import { Configuration } from 'webpack';
import 'webpack-dev-server';

const devServer = (isMinikube: boolean): Configuration => {
  return {
    devServer: {
      port: isMinikube ? 80 : 1997,
      host: isMinikube ? '0.0.0.0' : '127.0.0.1',
      static: {
        directory: path.join(__dirname, '/static'),
        publicPath: '/telephony/app/js/',
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
          runtimeErrors: false,
        },
      },
      historyApiFallback: true,
      hot: true,
      proxy: {
        '/api': {
          target: isMinikube ? 'http://vpbx-dev.mcn.loc' : 'https://vpbx-stage.mcnloc.ru',
          changeOrigin: true,
        },
        '/baseapi': {
          target: isMinikube ? 'http://base-dev.mcn.loc' : 'https://base-stage.mcnloc.ru',
          pathRewrite: { '^/baseapi': '/api' },
          changeOrigin: true,
        },
        '/core': {
          target: 'https://lk-stage.mcnloc.ru',
          changeOrigin: true,
        },
        '/lk': {
          target: 'https://lk-stage.mcnloc.ru',
          changeOrigin: true,
        },
        '/vpbx': {
          target: 'https://vpbx-stage.mcnloc.ru',
          changeOrigin: true,
        },
        '/phone': {
          target: 'https://vpbx-stage.mcnloc.ru',
          changeOrigin: true,
        },
        '/equipmentapi': {
          target: 'https://vpbx-stage.mcnloc.ru',
          pathRewrite: { '^/equipmentapi': '/api' },
          changeOrigin: true,
        },
        '/addressbookapi': {
          target: 'https://addressbook-stage.mcnloc.ru',
          pathRewrite: { '^/addressbookapi': '/api' },
          changeOrigin: true,
        },
        '/supersetapi': {
          target: 'https://superset-prod.mcn.ru/',
          pathRewrite: { '^/supersetapi': '/' },
          changeOrigin: true,
        },
        '/translatorapi': {
          target: 'https://translator-stage.mcnloc.ru',
          pathRewrite: { '^/translatorapi': '/api' },
          changeOrigin: true,
        },
        '/referencesapi': {
          target: 'https://references-stage.mcnloc.ru',
          pathRewrite: { '^/referencesapi': '/api' },
          changeOrigin: true,
        },
        '/topbar': {
          target: 'https://topbar-stage.mcnloc.ru',
          pathRewrite: { '^/topbar': '/' },
          changeOrigin: true,
        },
        '/webPhone': {
          target: 'https://webphone-stage.mcnloc.ru',
          pathRewrite: { '^/webPhone': '/' },
          changeOrigin: true,
        },
      },
    },
  };
};

export default devServer;
