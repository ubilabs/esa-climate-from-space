import {State} from '../../reducers/index';

import {CameraView} from '@ubilabs/esa-webgl-globe';

export function globeViewSelector(state: State): CameraView {
  return state.globe.view;
}
