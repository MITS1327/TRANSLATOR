import path from 'path';

const resolveModule = (uiLibraryPath: string) => {
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.svg'],
      alias: {
        react: path.resolve(__dirname, '../node_modules/react'),
        'mcn-ui-components': path.resolve(__dirname, uiLibraryPath),
        assets: path.resolve(__dirname, '../assets'),
        static: path.resolve(__dirname, '../static'),
        lang: path.resolve(__dirname, '../../lang'),
        store: path.resolve(__dirname, '../src/store'),
        pages: path.resolve(__dirname, '../src/pages'),
        public: path.resolve(__dirname, '../src/public'),
        app: path.resolve(__dirname, '../src/app'),
        '@mixins': path.resolve(__dirname, '../src/mixins.scss'),
        shared: path.resolve(__dirname, '../src/shared'),
        entities: path.resolve(__dirname, '../src/entities'),
        widgets: path.resolve(__dirname, '../src/widgets'),
        features: path.resolve(__dirname, '../src/features'),
      },
    },
  };
};

export default resolveModule;
