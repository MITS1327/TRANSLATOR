import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration } from 'webpack';

const cssLoader = (uiLibraryPath: string, isProd: boolean): Configuration => {
  const loaders = [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { import: true } }];

  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: !isProd ? '[name].css' : '[name].[hash].css',
        chunkFilename: !isProd ? '[id].css' : '[id].[hash].css'
      }),
    ],
    module: {
      rules: [
        {
          test: /(\.css)$/,
          include: /node_modules\/(?!(mcn-ui-components)\/).*/,
          use: loaders,
        },
        {
          test: /\.((sc|sa)ss)$/i,
          exclude: /node_modules/,
          include: path.resolve(__dirname, '../src'),
          use: [...loaders, 'sass-loader'],
        },
        {
          test: /\.((pc|c)ss)$/i,
          exclude: /node_modules\/(?!(mcn-ui-components)\/).*/,
          include: [uiLibraryPath],
          use: [
            ...loaders,
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ['postcss-nested', 'postcss-custom-properties', 'postcss-custom-media', 'postcss-preset-env'],
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  };
};

export default cssLoader;
