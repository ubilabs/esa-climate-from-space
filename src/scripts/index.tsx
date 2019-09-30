import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app/app';

ReactDOM.render(<App />, document.getElementById('app'));

// Build information
// @ts-ignore
window.__buildInfo = {
  // @ts-ignore
  time: INFO_BUILD_TIME,
  // @ts-ignore
  git: INFO_GIT_HASH,
  // @ts-ignore
  version: INFO_VERSION
};
