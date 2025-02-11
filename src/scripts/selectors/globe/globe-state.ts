import { GlobeState } from "../../reducers/globe/globe-state";
import { State } from "../../reducers/index";

export const globeStateSelector = (state: State): GlobeState => state.globe;
