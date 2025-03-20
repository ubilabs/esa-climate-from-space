import { FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";

import config from "../../../config/main";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import { languageSelector } from "../../../selectors/language";
import Button from "../button/button";
import { MenuIcon } from "../icons/menu-icon";
import LanguageTooltip from "../language-tooltip/language-tooltip";
import Menu from "../menu/menu";
import Overlay from "../overlay/overlay";
import { setWelcomeScreen } from "../../../reducers/welcome-screen";

import styles from "./navigation.module.css";
import { setLanguage } from "../../../reducers/language";
import { useContentParams } from "../../../hooks/use-content-params";
import useIsStoriesPath from "../../../hooks/use-is-stories-path";
import { useScreenSize } from "../../../hooks/use-screen-size";
import { EsaLogo } from "../icons/esa-logo";
import { ArrowBackIcon } from "../icons/arrow-back-icon";
import { setShowLayer } from "../../../reducers/show-layer-selector";
import { StoryMode } from "../../../types/story-mode";
import { LayerSelectorIcon } from "../icons/layer-selector-icon";

const Navigation: FunctionComponent = () => {
  const dispatch = useThunkDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const selectedLanguage = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem(config.localStorageLanguageKey);
  const { app_menu } = useSelector(embedElementsSelector);

  const [showTooltip, setShowTooltip] = useState(Boolean(!savedLanguage));

  const { category } = useContentParams();
  const isStoriesPath = useIsStoriesPath();

  const { isNavigation } = useContentParams();
  const { isMobile } = useScreenSize();

  const { mode } = useContentParams();

  return (
    <>
      <nav className={styles.navigation}>
        {
          <EsaLogo
            variant={
              (!isMobile && "logoWithText") ||
              (isStoriesPath || mode === StoryMode.Content
                ? "shortLogo"
                : "logoWithText")
            }
          />
        }
        {!isNavigation && (
          <Button
            className={styles.backButton}
            icon={ArrowBackIcon}
            label={isMobile ? "" : "backToStories"}
            link={category ? `/${category}` : "/"}
          />
        )}
        {mode === StoryMode.Content && (
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
