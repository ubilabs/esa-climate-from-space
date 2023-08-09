/* eslint-disable camelcase */
import {
  SetAppElementsAction,
  TOGGLE_APP_ELEMENTS
} from '../../actions/set-app-element-embed';
import {parseUrl} from '../../libs/app-elements-url-parameter';
import {AppElementsState} from '../../types/embed-elements';

const initialState: AppElementsState = {
  logo: parseUrl('logo') ?? true,
  stories_menu: parseUrl('stories_menu') ?? true,
  layers_menu: parseUrl('layers_menu') ?? true,
  share_button: parseUrl('share_button') ?? true,
  app_menu: parseUrl('app_menu') ?? true,
  globe_navigation: parseUrl('globe_navigation') ?? true
};

function appElementsReducer(
  state: AppElementsState = initialState,
  action: SetAppElementsAction
): AppElementsState {
  switch (action.type) {
    case TOGGLE_APP_ELEMENTS:
      return action.appElements;
    default:
      return state;
  }
}

export default appElementsReducer;
