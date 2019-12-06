import {State} from '../../reducers/index';

import {GlobeState} from '../../reducers/globe/index';

export const globeStateSelector = (state: State): GlobeState => state.globe;
