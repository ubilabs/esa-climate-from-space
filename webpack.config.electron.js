const path = require('path');
const webConfigFn = require('./webpack.config.js');

module.exports = (env, {mode} = {}) => {
  const config = webConfigFn(env, mode);

  config.target = 'electron-renderer';
  config.resolve.alias.electronHelpers = path.resolve(
    __dirname,
    './src/scripts/libs/electron-helpers.ts'
  );

  return config;
};
