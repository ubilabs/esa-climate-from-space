import {State} from '../reducers/index';

export function welcomeScreenSelector(state: State): string | null {
  return state.welcomeScreen;
}
