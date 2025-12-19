import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import gitState from 'git-state';
import {version} from './package.json';

const gitHash =
  (gitState.isGitSync(__dirname) && gitState.commitSync(__dirname)) || '-';

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
  const DEFINES = {
    INFO_VERSION: JSON.stringify(version),
    INFO_BUILD_TIME: JSON.stringify(new Date().toISOString()),
    INFO_GIT_HASH: JSON.stringify(gitHash)
  };

  if (command === 'serve') {
    DEFINES['CESIUM_BASE_URL'] = JSON.stringify('./cesium/');
  }

  return {
    root: './src',
    base: './',
    resolve: {
      alias: {
        '~': __dirname
      }
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      copyPublicDir: command === 'serve',
      assetsDir: ''
    },
    plugins: [
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
    ],
    define: DEFINES,
    publicDir: '../storage'
  };
});
