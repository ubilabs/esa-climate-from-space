import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import gitState from 'git-state';
import {version} from './package.json';

const gitHash =
  (gitState.isGitSync(__dirname) && gitState.commitSync(__dirname)) || '-';

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  plugins: [react()],
  define: {
    INFO_VERSION: JSON.stringify(version),
    INFO_BUILD_TIME: JSON.stringify(new Date().toISOString()),
    INFO_GIT_HASH: JSON.stringify(gitHash),
    CESIUM_BASE_URL: JSON.stringify('./cesium/')
  },
  publicDir: '../public'
});
