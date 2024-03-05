import path from 'path';
import { Configuration } from 'webpack';

const assetLoader = (uiLibraryPath: string): Configuration => {
  return {
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash].[ext]',
          },
        },
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          include: [`${uiLibraryPath}/components/Icon`, path.resolve(__dirname, '../static')],
          use: [
            {
              loader: 'esbuild-loader',
              options: {
                loader: 'jsx',
                target: 'es2022',
              },
            },
            {
              loader: '@svgr/webpack',
              options: { babel: false },
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: [`${uiLibraryPath}/components/Icon`, path.resolve(__dirname, '../static')],
          type: 'asset/inline',
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
  };
};

export default assetLoader;