import path from 'path';
import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';
import dev from './webpack-development.config';
import prod from './webpack-production.config';

import codeLoader from './codeLoader';
import cssLoader from './cssLoader';
import assetLoader from './assetLoader';
import devServer from './devServer';
import resolveModule from './resolveModule';
import { Env } from './types';

const common = (isProd: boolean) => {
  const uiLibraryPath = path.resolve(__dirname, isProd ? '../node_modules/mcn-ui-components' : '../mcn-ui-components');

  return merge([
    {
      entry: {
        index: path.resolve(__dirname, '../src/index.tsx'),
      },
    },
    resolveModule(uiLibraryPath),
    codeLoader(isProd, uiLibraryPath),
    cssLoader(uiLibraryPath, isProd),
    assetLoader(uiLibraryPath),
  ]);
};

const config = (env: Env): Configuration => {
  if (env.production) {
    return merge([common(env.production), prod(env)]);
  }
  if (env.development) {
    return merge([common(!env.development), devServer(env.isMinikube), dev(env)]);
  }
  return null;
};

export default config;
