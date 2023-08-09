import {State} from '../../reducers';
import {EmbedState} from '../../reducers/embed';

export function appElementsSelector(state: State): EmbedState {
  return state.embed;
}
