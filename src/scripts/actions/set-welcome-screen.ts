export const SET_WELCOME_SCREEN = "SET_WELCOME_SCREEN";

export interface SetWelcomeScreenAction {
  type: typeof SET_WELCOME_SCREEN;
  welcomeScreen: boolean;
}

const setWelcomeScreenAction = (
  welcomeScreen: boolean,
): SetWelcomeScreenAction => ({
  type: SET_WELCOME_SCREEN,
  welcomeScreen,
});

export default setWelcomeScreenAction;
