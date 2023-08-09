import {AppElementsState} from '../types/embed-elements';

export const TOGGLE_APP_ELEMENTS = 'TOGGLE_APP_ELEMENTS';

export interface SetAppElementsAction {
  type: typeof TOGGLE_APP_ELEMENTS;
  appElements: AppElementsState;
}

export function setAppElementsAction(
  appElements: AppElementsState
): SetAppElementsAction {
  return {
    type: TOGGLE_APP_ELEMENTS,
    appElements
  };
}

export default setAppElementsAction;
