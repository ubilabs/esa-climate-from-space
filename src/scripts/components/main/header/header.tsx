import { FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";

import config from "../../../config/main";

import { useScreenSize } from "../../../hooks/use-screen-size";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import { contentSelector } from "../../../selectors/content";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import { appRouteSelector } from "../../../selectors/route-match";
import { languageSelector } from "../../../selectors/language";
import { showLayerSelector } from "../../../selectors/show-layer-selector";

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
import ContentSearch from "../search/content-search";

import styles from "./header.module.css";

const Header: FunctionComponent = () => {
  const dispatch = useThunkDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const selectedLanguage = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem(config.localStorageLanguageKey);

  const [showTooltip, setShowTooltip] = useState(Boolean(!savedLanguage));

  const { category } = useSelector(contentSelector);
  const {
    isShowCaseStoryRoute,
    isPresentStoryRoute,
    isStoriesRoute,
    isDataRoute,
    isPresentView,
    isNavigationView,
    isBaseRoute,
  } = useAppRouteFlags();

  const { isMobile, isDesktop } = useScreenSize();
  const appRoute = useSelector(appRouteSelector);

  const { header, logo, back_link, app_menu, layers_menu } = useSelector(
    embedElementsSelector,
  );

  const isLayerSelectorVisible = useSelector(showLayerSelector);

  if (!header) {
    // The app element determines the layout via grid which is why we should return a DOM element here
    // set css custom property --header-height to 0
    document.documentElement.style.setProperty("--header-height", "0px");
    return <nav></nav>;
  }

  const logoVariant = (() => {
    if (isPresentView) {
      return "logo";
    }
    if (isDesktop) {
      return "logoWithText";
    }
    if (isDataRoute || isStoriesRoute) {
      return "shortLogo";
    }
    return "logoWithText";
  })();

  const linkPath = (() => {
    if (isShowCaseStoryRoute) {
      return "/showcase/";
    }
    if (isPresentStoryRoute) {
      return "/present";
    }
    if (category) {
      return `/${category}`;
    }
    return "/";
  })();

  return (
    <>
      <nav className={styles.header}>
        {logo && (
          <Button link="/" ariaLabel="homepage">
            <EsaLogo variant={logoVariant} />
          </Button>
        )}
        {!isBaseRoute && !isNavigationView && back_link && (
          <Button
            className={styles.backButton}
            icon={ArrowBackIcon}
            label={isMobile ? "" : "backToStories"}
            ariaLabel={"backToStories"}
            link={linkPath}
          />
        )}
        {appRoute === AppRoute.Data && layers_menu && (
          <Button
            className={styles.button}
            id="ui-menu"
            icon={LayerSelectorIcon}
            onClick={() => dispatch(setShowLayer(!isLayerSelectorVisible))}
            hideLabelOnMobile
          />
        )}
        {app_menu && (
          <Button
            className={styles.button}
            id="ui-menu"
            icon={MenuIcon}
            ariaLabel={"app_menu"}
            onClick={() => setShowMenu(true)}
            hideLabelOnMobile
          />
        )}
        <ContentSearch />
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

export default Header;
