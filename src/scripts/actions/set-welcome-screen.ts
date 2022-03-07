export const SET_WELCOME_SCREEN = 'SET_WELCOME_SCREEN';

export interface SetWelcomeScreenAction {
  type: typeof SET_WELCOME_SCREEN;
  welcomeScreen: string | null;
}

const setWelcomeScreenAction = (
  welcomeScreen: string | null
): SetWelcomeScreenAction => ({
  type: SET_WELCOME_SCREEN,
  welcomeScreen
});

export default setWelcomeScreenAction;
