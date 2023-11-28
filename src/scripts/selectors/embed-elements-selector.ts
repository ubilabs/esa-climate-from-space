import {State} from '../reducers';
import {EmbedElementsState} from '../types/embed-elements';

export function embedElementsSelector(state: State): EmbedElementsState {
  return state.embedElements;
}
