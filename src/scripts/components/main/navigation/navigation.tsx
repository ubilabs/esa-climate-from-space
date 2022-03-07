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
import {FilterIcon} from '../icons/filter-icon';
import setLanguageAction from '../../../actions/set-language';
import {languageSelector} from '../../../selectors/language';
import LanguageTooltip from '../language-tooltip/language-tooltip';
import SelectedTags from '../../stories/selected-tags/selected-tags';
import {selectedTagsSelector} from '../../../selectors/story/selected-tags';
import setWelcomeScreenAction from '../../../actions/set-welcome-screen';
import config from '../../../config/main';

import styles from './navigation.styl';

const Navigation: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const selectedLanguage = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem(config.localStorageLanguageKey);
  const selectedTags = useSelector(selectedTagsSelector);

  return (
    <React.Fragment>
      <div className={styles.navigation}>
        <Button
          className={styles.button}
          id="ui-stories"
          label="stories"
          link="/stories"
          icon={StoryIcon}
          hideLabelOnMobile
        />
        {selectedTags.length > 0 && (
          <React.Fragment>
            <Button
              className={styles.tagsButton}
              icon={FilterIcon}
              onClick={() => setShowTags(!showTags)}
            />
            <div className={styles.badge} />
          </React.Fragment>
        )}
        <Button
          className={styles.button}
          id="ui-layers"
          label="layers"
          onClick={() => dispatch(showLayerSelectorAction(true))}
          icon={LayersIcon}
          hideLabelOnMobile
        />
        <Share />
        <Button
          className={styles.button}
          id="ui-menu"
          icon={MenuIcon}
          onClick={() => setShowMenu(true)}
          hideLabelOnMobile
        />
      </div>

      {!savedLanguage && (
        <LanguageTooltip
          onMenuOpen={() => setShowMenu(true)}
          onClose={() => dispatch(setLanguageAction(selectedLanguage))}
        />
      )}
      {showMenu && (
        <Overlay onClose={() => setShowMenu(false)}>
          <Menu
            onRestartOnboarding={() => {
              setShowMenu(false);
              dispatch(setWelcomeScreenAction(true));
            }}
          />
        </Overlay>
      )}
      {selectedTags.length > 0 && showTags && (
        <SelectedTags selectedTags={selectedTags} />
      )}
    </React.Fragment>
  );
};

export default Navigation;
