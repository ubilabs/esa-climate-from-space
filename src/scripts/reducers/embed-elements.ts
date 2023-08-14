/* eslint-disable camelcase */
import {
  SetEmbedElementsAction as SetEmbedElementsAction,
  TOGGLE_EMBED_ELEMENTS
} from '../actions/set-app-element-embed';
import {parseUrl} from '../libs/app-elements-url-parameter';
import {EmbedElementsState} from '../types/embed-elements';

const initialState: EmbedElementsState = {
  logo: parseUrl('logo') ?? true,
  stories_menu: parseUrl('stories_menu') ?? true,
  layers_menu: parseUrl('layers_menu') ?? true,
  share_button: parseUrl('share_button') ?? true,
  app_menu: parseUrl('app_menu') ?? true,
  globe_navigation: parseUrl('globe_navigation') ?? true
};

function embedElementsReducer(
  state: EmbedElementsState = initialState,
  action: SetEmbedElementsAction
): EmbedElementsState {
  switch (action.type) {
    case TOGGLE_EMBED_ELEMENTS:
      return action.embedElements;
    default:
      return state;
  }
}

export default embedElementsReducer;
