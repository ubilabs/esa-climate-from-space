import { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import config from "../../../config/main";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { languageSelector } from "../../../selectors/language";
import Button from "../button/button";
import { MenuIcon } from "../icons/menu-icon";
import LanguageTooltip from "../language-tooltip/language-tooltip";
import Menu from "../menu/menu";
import Overlay from "../overlay/overlay";
import { setWelcomeScreen } from "../../../reducers/welcome-screen";

import styles from "./navigation.module.css";
import { setLanguage } from "../../../reducers/language";
import useIsStoriesPath from "../../../hooks/use-is-stories-path";
import { useScreenSize } from "../../../hooks/use-screen-size";
import { EsaLogo } from "../icons/esa-logo";
import { ArrowBackIcon } from "../icons/arrow-back-icon";
import { setShowLayer } from "../../../reducers/show-layer-selector";
import { RouteMatch } from "../../../types/story-mode";
import { LayerSelectorIcon } from "../icons/layer-selector-icon";
import { contentSelector } from "../../../selectors/content";
import { routeMatchSelector } from "../../../selectors/route-match";
import { setRouteMatch } from "../../../reducers/route-match";
import { useLocation } from "react-router-dom";

const Navigation: FunctionComponent = () => {
  const dispatch = useThunkDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const selectedLanguage = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem(config.localStorageLanguageKey);

  const [showTooltip, setShowTooltip] = useState(Boolean(!savedLanguage));

  const { category } = useSelector(contentSelector);
  const isStoriesPath = useIsStoriesPath();

  const { isMobile } = useScreenSize();
  const { routeMatch } = useSelector(routeMatchSelector);

  const location = useLocation();

  useEffect(() => {
    dispatch(setRouteMatch(location.pathname));
  }, [location.pathname, dispatch]);

  return (
    <>
      <nav className={styles.navigation}>
        {
          <EsaLogo
            variant={
              (!isMobile && "logoWithText") ||
              (isStoriesPath || routeMatch === RouteMatch.Stories
                ? "shortLogo"
                : "logoWithText")
            }
          />
        }
        {(routeMatch === RouteMatch.Data ||
          routeMatch === RouteMatch.Stories) && (
          <Button
            className={styles.backButton}
            icon={ArrowBackIcon}
            label={isMobile ? "" : "backToStories"}
            link={category ? `/${category}` : "/"}
          />
        )}
        {routeMatch === RouteMatch.Data && (
          <Button
            className={styles.button}
            id="ui-menu"
            icon={LayerSelectorIcon}
            onClick={() => dispatch(setShowLayer(true))}
            hideLabelOnMobile
          />
        )}
        <Button
          className={styles.button}
          id="ui-menu"
          icon={MenuIcon}
          onClick={() => setShowMenu(true)}
          hideLabelOnMobile
        />
      </nav>

      {showTooltip && (
        <LanguageTooltip
          onMenuOpen={() => setShowMenu(true)}
          onClose={() => {
            setShowTooltip(false);
            dispatch(setLanguage(selectedLanguage));
            // setShowTooltip(false);
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
