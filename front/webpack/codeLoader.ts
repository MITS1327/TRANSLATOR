import path from 'path';
import { Configuration } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const codeLoader = (isProd: boolean, uiLibraryPath: string): Configuration => {
  const prodOptions = {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    legalComments: 'none',
  };

  return {
    module: {
      rules: [
        {
          test: /\.(j|t)(x?)/,
          include: [path.resolve(__dirname, '../src'), uiLibraryPath],
          exclude: [`${uiLibraryPath}/assets`],
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2022',
            ...(isProd ? prodOptions : null),
          },
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        formatter: 'codeframe',
        async: false,
      }),
    ],
  };
};

export default codeLoader;