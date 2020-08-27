import React, {FunctionComponent, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Button from '../button/button';
import Overlay from '../overlay/overlay';
import Menu from '../menu/menu';
import {LayersIcon} from '../icons/layers-icon';
import {StoryIcon} from '../icons/story-icon';
import showLayerSelectorAction from '../../../actions/show-layer-selector';
import Share from '../share/share';
import {MenuIcon} from '../icons/menu-icon';
import setLanguageAction from '../../../actions/set-language';
import {languageSelector} from '../../../selectors/language';
import LanguageBubble from '../language-bubble/language-bubble';
import config from '../../../config/main';

import styles from './navigation.styl';

const Navigation: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const selectedLanguage = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem(config.localStorageLanguageKey);
  const [showLanguageBubble, setShowLanguageBubble] = useState(!savedLanguage);

  return (
    <div className={styles.navigation}>
      <Button
        className={styles.button}
        label="stories"
        link="/stories"
        icon={StoryIcon}
        hideLabelOnMobile
      />
      <Button
        className={styles.button}
        label="layers"
        onClick={() => dispatch(showLayerSelectorAction(true))}
        icon={LayersIcon}
        hideLabelOnMobile
      />
      <Share />
      <Button
        className={styles.button}
        icon={MenuIcon}
        onClick={() => setShowMenu(true)}
        hideLabelOnMobile
      />
      {showLanguageBubble && (
        <LanguageBubble
          onMenuOpen={() => setShowMenu(true)}
          onClose={() => {
            setShowLanguageBubble(false);
            dispatch(setLanguageAction(selectedLanguage));
          }}
        />
      )}
      {showMenu && (
        <Overlay onClose={() => setShowMenu(false)}>
          <Menu />
        </Overlay>
      )}
    </div>
  );
};

export default Navigation;
