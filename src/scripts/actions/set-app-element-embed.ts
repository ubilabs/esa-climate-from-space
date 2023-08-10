import {EmbedElementsState} from '../types/embed-elements';

export const TOGGLE_EMBED_ELEMENTS = 'TOGGLE_EMBED_ELEMENTS';

export interface SetAppElementsAction {
  type: typeof TOGGLE_EMBED_ELEMENTS;
  embedElements: EmbedElementsState;
}

export function setAppElementsAction(
  embedElements: EmbedElementsState
): SetAppElementsAction {
  return {
    type: TOGGLE_EMBED_ELEMENTS,
    embedElements
  };
}

export default setAppElementsAction;
