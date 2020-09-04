import {Dispatch} from 'redux';

import {State} from '../reducers';
import {layerDetailsSelector} from '../selectors/layers/layer-details';
import {getTimeRanges} from '../libs/get-time-ranges';
import clampToRange from '../libs/clamp-to-range';

export const SET_GLOBE_TIME = 'SET_GLOBE_TIME';

export interface SetGlobeTimeAction {
  type: typeof SET_GLOBE_TIME;
  time: number;
}

const setGlobeTimeAction = (time: number): SetGlobeTimeAction => ({
  type: SET_GLOBE_TIME,
  time
});

export default setGlobeTimeAction;
