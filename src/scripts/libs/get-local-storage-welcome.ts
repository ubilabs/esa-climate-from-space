import config from "../config/main";

export default function getLocalStorageWelcomePage(): boolean {
  const welcomeScreenChecked = localStorage.getItem(
    config.localStorageWelcomeScreenKey,
  );

  const welcomeScreenBoolean = welcomeScreenChecked === "true";

  return welcomeScreenBoolean;
}
