import { FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";

import config from "../../../config/main";

import { useScreenSize } from "../../../hooks/use-screen-size";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { useAppPath } from "../../../hooks/use-app-path";

import { contentSelector } from "../../../selectors/content";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import { appRouteSelector } from "../../../selectors/route-match";
import { languageSelector } from "../../../selectors/language";

import { setLanguage } from "../../../reducers/language";
import { setShowLayer } from "../../../reducers/show-layer-selector";
import { setWelcomeScreen } from "../../../reducers/welcome-screen";

import { AppRoute } from "../../../types/app-routes";

import Button from "../button/button";
import { EsaLogo } from "../icons/esa-logo";
import { ArrowBackIcon } from "../icons/arrow-back-icon";
import { LayerSelectorIcon } from "../icons/layer-selector-icon";
import { MenuIcon } from "../icons/menu-icon";
import LanguageTooltip from "../language-tooltip/language-tooltip";
import Menu from "../menu/menu";
import Overlay from "../overlay/overlay";

import styles from "./navigation.module.css";

const Navigation: FunctionComponent = () => {
  const dispatch = useThunkDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const selectedLanguage = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem(config.localStorageLanguageKey);

  const [showTooltip, setShowTooltip] = useState(Boolean(!savedLanguage));

  const { category } = useSelector(contentSelector);
  const { isStoriesPath, isDataPath } = useAppPath();

  const { isMobile, isDesktop } = useScreenSize();
  const { appRoute } = useSelector(appRouteSelector);

  const { header, logo, back_link, app_menu, layers_menu } = useSelector(
    embedElementsSelector,
  );

  if (!header) {
    // The app element determines the layout via grid which is why we should return a DOM element here
    // set css custom property --header-height to 0
    document.documentElement.style.setProperty("--header-height", "0px");
    return <nav aria-disabled="true"></nav>;
  }

  return (
    <>
      <nav className={styles.navigation}>
        {logo && (
          <EsaLogo
            variant={
              (isDesktop && "logoWithText") ||
              (isDataPath || isStoriesPath ? "shortLogo" : "logoWithText")
            }
          />
        )}
        {(isStoriesPath || isDataPath) && back_link && (
          <Button
            className={styles.backButton}
            icon={ArrowBackIcon}
            label={isMobile ? "" : "backToStories"}
            link={category ? `/${category}` : "/"}
          />
        )}
        {appRoute === AppRoute.Data && layers_menu && (
          <Button
            className={styles.button}
            id="ui-menu"
            icon={LayerSelectorIcon}
            onClick={() => dispatch(setShowLayer(true))}
            hideLabelOnMobile
          />
        )}
        {app_menu && (
          <Button
            className={styles.button}
            id="ui-menu"
            icon={MenuIcon}
            onClick={() => setShowMenu(true)}
            hideLabelOnMobile
          />
        )}
      </nav>

      {showTooltip && (
        <LanguageTooltip
          onMenuOpen={() => setShowMenu(true)}
          onClose={() => {
            setShowTooltip(false);
            dispatch(setLanguage(selectedLanguage));
          }}
        />
      )}
      {showMenu && (
        <Overlay onClose={() => setShowMenu(false)}>
          <Menu
            onRestartOnboarding={() => {
              setShowMenu(false);
              dispatch(setWelcomeScreen(false));
            }}
          />
        </Overlay>
      )}
    </>
  );
};

export default Navigation;
