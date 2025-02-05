import {createRoot} from 'react-dom/client';

import App from './components/main/app/app';

createRoot(document.getElementById('app') as HTMLElement).render(<App />);

// Build information
// @ts-expect-error - Property '__buildInfo' does not exist on type 'Window & typeof globalThis'.ts(2339)
window.__buildInfo = {
  // @ts-expect-error - Cannot find name 'INFO_BUILD_TIME'
  time: INFO_BUILD_TIME,
  // @ts-expect-error - Cannot find name 'INFO_GIT_HASH'
  git: INFO_GIT_HASH,
  // @ts-expect-error - Cannot find name 'INFO_VERSION'
  version: INFO_VERSION
};
