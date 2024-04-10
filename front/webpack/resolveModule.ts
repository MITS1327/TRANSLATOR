import path from 'path';

const resolveModule = (uiLibraryPath: string) => {
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.svg'],
      alias: {
        'mcn-ui-components': path.resolve(__dirname, uiLibraryPath),
        '@mixins': path.resolve(__dirname, '../src/mixins.scss'),
        public: path.resolve(__dirname, '../public'),
        app: path.resolve(__dirname, '../src/app'),
        entities: path.resolve(__dirname, '../src/entities'),
        features: path.resolve(__dirname, '../src/features'),
        pages: path.resolve(__dirname, '../src/pages'),
        shared: path.resolve(__dirname, '../src/shared'),
        widgets: path.resolve(__dirname, '../src/widgets'),
      },
    },
  };
};

export default resolveModule;
