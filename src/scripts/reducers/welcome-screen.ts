import {
  SET_WELCOME_SCREEN,
  SetWelcomeScreenAction,
} from "../actions/set-welcome-screen";
import getLocalStorageWelcomePage from "../libs/get-local-storage-welcome";

const initialState = getLocalStorageWelcomePage() || false;

function welcomeScreenReducer(
  state: boolean = initialState,
  action: SetWelcomeScreenAction,
) {
  switch (action.type) {
    case SET_WELCOME_SCREEN:
      return action.welcomeScreen;
    default:
      return state;
  }
}

export default welcomeScreenReducer;
