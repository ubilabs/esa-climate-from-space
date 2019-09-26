import {SET_ACTIVE_TAB, tabName} from '../actions/set-active-tab';
import {Action, State} from './index';

export type ActiveTabState = tabName;

function setActiveTabReducer(
  activeTabState: ActiveTabState = 'main',
  action: Action
): ActiveTabState {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      return action.activeTab;
    default:
      return activeTabState;
  }
}

export function setActiveTabSelector(state: State): ActiveTabState {
  return state.activeTab;
}

export default setActiveTabReducer;
