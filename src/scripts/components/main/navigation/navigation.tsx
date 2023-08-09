/* eslint-disable camelcase */
import React, {FunctionComponent, useState} from 'react';
import {useSelector} from 'react-redux';

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
import {useThunkDispatch} from '../../../hooks/use-thunk-dispatch';
import config from '../../../config/main';
import {appElementsSelector} from '../../../selectors/embed/app-elements-embed';

import styles from './navigation.module.styl';

const Navigation: FunctionComponent = () => {
  const dispatch = useThunkDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const selectedLanguage = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem(config.localStorageLanguageKey);
  const selectedTags = useSelector(selectedTagsSelector);
  const {appElements} = useSelector(appElementsSelector);
  const {stories_menu, layers_menu, share_button, app_menu} = appElements;

  return (
    <React.Fragment>
      <div className={styles.navigation}>
        {stories_menu !== false && (
          <Button
            className={styles.button}
            id="ui-stories"
            label="stories"
            link="/stories"
            icon={StoryIcon}
            hideLabelOnMobile
          />
        )}
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
        {layers_menu !== false && (
          <Button
            className={styles.button}
            id="ui-layers"
            label="layers"
            onClick={() => dispatch(showLayerSelectorAction(true))}
            icon={LayersIcon}
            hideLabelOnMobile
          />
        )}
        {share_button !== false && <Share />}

        {app_menu !== false && (
          <Button
            className={styles.button}
            id="ui-menu"
            icon={MenuIcon}
            onClick={() => setShowMenu(true)}
            hideLabelOnMobile
          />
        )}
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
              dispatch(setWelcomeScreenAction(false));
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
