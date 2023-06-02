import {State} from '../reducers/index';

import {CameraView} from '@ubilabs/esa-webgl-globe';

export function flyToSelector(state: State): CameraView | null {
  return state.flyTo;
}
