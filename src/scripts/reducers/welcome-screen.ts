import {
  SET_WELCOME_SCREEN,
  SetWelcomeScreenAction
} from '../actions/set-welcome-screen';

const initialState = true;

function welcomeScreenReducer(
  state: boolean = initialState,
  action: SetWelcomeScreenAction
) {
  switch (action.type) {
    case SET_WELCOME_SCREEN:
      return action.welcomeScreen;
    default:
      return state;
  }
}

export default welcomeScreenReducer;
