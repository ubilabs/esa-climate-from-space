import React from 'react';
import ReactDOM from 'react-dom';

import 'cesium/Source/Widgets/widgets.css';
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl';
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer';

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

BuildModuleUrl.setBaseUrl('./');
const viewer = new Viewer('cesium');
