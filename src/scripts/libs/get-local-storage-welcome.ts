import config from '../config/main';

export default function getLocalStorageWelcomePage(): string | null {
  return localStorage.getItem(config.localStorageWelcomePageKey);
}
