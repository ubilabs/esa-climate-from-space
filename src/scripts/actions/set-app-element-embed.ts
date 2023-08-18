import {EmbedElementsState} from '../types/embed-elements';

export const TOGGLE_EMBED_ELEMENTS = 'TOGGLE_EMBED_ELEMENTS';

export interface SetEmbedElementsAction {
  type: typeof TOGGLE_EMBED_ELEMENTS;
  embedElements: EmbedElementsState;
}

export function setAppElementsAction(
  embedElements: EmbedElementsState
): SetEmbedElementsAction {
  return {
    type: TOGGLE_EMBED_ELEMENTS,
    embedElements
  };
}

export default setAppElementsAction;
