module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@api': './src/api',
          '@component': './src/component',
          '@atom': './src/component/atom',
          '@template': './src/component/template',
          '@module': './src/module',
          '@store': './src/module/store',
          '@image': './public/image',
          '@type': './src/type',
          '@public': './public',
          '@screen': './screen',
          '@hook': './src/hook'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};
