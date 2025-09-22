import { State } from "../reducers/index";
import { AppRouteState } from "../reducers/app-route";

export function appRouteSelector(state: State): AppRouteState {
  return state.appRoute;
}
