import React from 'react';
import {createRoot} from 'react-dom/client';

import App from './components/main/app/app';

const root = createRoot(document.getElementById('app')!);
root.render(<App />);

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
