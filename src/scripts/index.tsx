import React from 'react';
import {createRoot} from 'react-dom/client';

import App from './components/main/app/app';

createRoot(document.getElementById('app') as HTMLElement).render(<App />);

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
