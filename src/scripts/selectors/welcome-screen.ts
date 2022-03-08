import {State} from '../reducers/index';

export function welcomeScreenSelector(state: State): boolean {
  return state.welcomeScreen;
}
