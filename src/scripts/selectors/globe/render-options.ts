import { State } from "../../reducers/index";
import { GlobeRenderOptions } from "../../reducers/globe/render-options";

export function globeRenderOptionsSelector(state: State): GlobeRenderOptions {
  return state.globe.renderOptions;
}
