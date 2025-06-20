import { State } from "../reducers/index";
import { RouteMatchState } from "../reducers/route-match";


export function routeMatchSelector(state: State): RouteMatchState {
  return state.routeMatch;
}
