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

import styles from './navigation.styl';
import InfoBubble from '../info-bubble/info-bubble';
import {languageSelector} from '../../../selectors/language';

const Navigation: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showInfoBubble, setshowInfoBubble] = useState(true);
  const language = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem('language');

  const onSaveLanguage = () => {
    localStorage.setItem('language', language);
    setshowInfoBubble(false);
  };

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
      {showInfoBubble && !savedLanguage && (
        <InfoBubble
          onMenuOpen={() => setShowMenu(true)}
          onClose={() => onSaveLanguage()}
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
