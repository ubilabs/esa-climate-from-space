export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';

export type tabName = string;

export interface SetActiveTabAction {
  type: typeof SET_ACTIVE_TAB;
  activeTab: tabName;
}

export const setActiveTabAction = (tabName: tabName): SetActiveTabAction => {
  return {
    type: SET_ACTIVE_TAB,
    activeTab: tabName
  };
};
