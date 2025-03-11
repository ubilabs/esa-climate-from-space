import { FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";

import config from "../../../config/main";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import { languageSelector } from "../../../selectors/language";
import { selectedTagsSelector } from "../../../selectors/story/selected-tags";
import SelectedTags from "../../stories/selected-tags/selected-tags";
import Button from "../button/button";
import { FilterIcon } from "../icons/filter-icon";
import { MenuIcon } from "../icons/menu-icon";
import LanguageTooltip from "../language-tooltip/language-tooltip";
import Menu from "../menu/menu";
import Overlay from "../overlay/overlay";
import { setWelcomeScreen } from "../../../reducers/welcome-screen";

import styles from "./navigation.module.css";
import { setLanguage } from "../../../reducers/language";
import { useStoryParams } from "../../../hooks/use-story-params";
import useIsStoriesPath from "../../../hooks/use-is-stories-path";
import { useGlobeDimensions } from "../../../hooks/use-navigation-dimensions";
import { EsaLogoShort } from "../icons/esa-logo-short";
import { useScreenSize } from "../../../hooks/use-screen-size";
import { EsaLogo } from "../icons/esa-logo";
import { EsaLogoWithText } from "../icons/esa-logo-with-text";
import { ArrowBackIcon } from "../icons/arrow-back-icon";
import { useHistory } from "react-router-dom";

const Navigation: FunctionComponent = () => {
  const dispatch = useThunkDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const selectedLanguage = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem(config.localStorageLanguageKey);
  const selectedTags = useSelector(selectedTagsSelector);
  const { stories_menu, app_menu } = useSelector(embedElementsSelector);

  const [showTooltip, setShowTooltip] = useState(Boolean(!savedLanguage));

  const {category} = useStoryParams();
  const isStoriesPath = useIsStoriesPath();

  const { isMobile } = useScreenSize();
  return (
    <>
      <nav className={styles.navigation}>
        {
          <EsaLogo
            variant={
              !isStoriesPath
                ? "logoWithText"
                : isMobile
                  ? "shortLogo"
                  : "logoWithText"
            }
          />
        }
        { isStoriesPath && isMobile && (
          <Button
            className={styles.backButton}
            icon={ArrowBackIcon}
            label={""}
            link={`/${category}`}
          />)
        }
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
