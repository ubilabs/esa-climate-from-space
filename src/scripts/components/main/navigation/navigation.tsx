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
import {embedElementsSelector} from '../../../selectors/embed-elements-selector';

import styles from './navigation.module.styl';
import {EsaLogo} from '../icons/esa-logo';

const Navigation: FunctionComponent = () => {
  const dispatch = useThunkDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const selectedLanguage = useSelector(languageSelector);
  const savedLanguage = localStorage.getItem(config.localStorageLanguageKey);
  const selectedTags = useSelector(selectedTagsSelector);
  const {stories_menu, layers_menu, share_button, app_menu} = useSelector(
    embedElementsSelector
  );

  const NewLogo: FunctionComponent = () => (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://climate.esa.int"
      className={styles.logoLink}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="67"
        height="24"
        viewBox="0 0 67 24"
        fill="none">
        <g clipPath="url(#clip0_460_1270)">
          <path
            d="M47.3605 10.8806C46.3205 10.7206 45.1205 10.6406 44.4805 9.92059C44.2405 9.60059 44.2405 9.12059 44.4005 8.80059C44.8005 7.92059 45.8405 7.76059 46.8805 7.76059C47.7605 7.76059 48.4805 8.24059 48.8805 8.96059C49.0405 9.28059 49.0405 9.60059 49.1205 10.0006H52.0005C52.0005 8.88059 51.6005 7.84059 50.9605 6.96059C49.4405 5.68059 47.4405 5.12059 45.5205 5.52059C43.8405 5.68059 42.3205 6.72059 41.6805 8.32059C41.1205 9.76059 41.5205 11.3606 42.7205 12.3206C44.0005 13.3606 46.4805 13.5206 47.5205 13.7606C48.6405 14.0006 49.2006 14.1606 49.4406 14.8006C49.5206 15.2006 49.5205 15.6806 49.2805 16.0006C48.5605 16.9606 47.0405 17.0406 45.9205 16.7206C44.8805 16.4006 44.5605 15.6806 44.3205 14.5606H41.2805C41.2805 15.4406 41.5205 16.3206 42.0805 17.0406C42.8805 18.2406 44.1605 19.0406 45.5205 19.2006C47.1205 19.5206 48.8805 19.3606 50.4005 18.6406C50.9605 18.3206 51.5205 17.8406 51.9206 17.2806C52.8006 16.0006 52.8805 14.2406 52.0805 12.8806C51.0405 11.4406 49.1205 11.1206 47.3605 10.8806ZM37.5205 7.28059C36.0805 5.76059 34.0805 5.12059 32.0805 5.44059C30.3205 5.68059 28.7206 6.80059 27.8406 8.40059C27.3606 9.28059 27.0405 10.2406 26.8005 11.2806C26.4805 13.6006 27.1205 17.5206 31.2805 19.0406C33.3605 19.7606 35.6806 19.4406 37.4406 18.1606C38.5606 17.2806 39.2805 16.0006 39.6005 14.6406H36.2406C36.0806 15.2806 35.7605 15.8406 35.2005 16.1606C34.0805 16.8806 32.6405 16.8006 31.6005 16.0006C30.5605 15.2006 30.2406 14.0006 30.2406 12.1606C30.2406 11.2006 30.4805 9.68059 31.2805 8.96059C32.0805 8.24059 33.2805 8.00059 34.3205 8.32059C35.4405 8.72059 36.2405 9.84059 36.1605 11.0406H31.3605V13.4406H39.6805C39.6805 12.5606 39.6806 11.7606 39.4406 10.8806C38.9606 9.60059 38.3205 8.40059 37.5205 7.28059ZM65.6805 15.6806V11.5206C65.7605 10.4806 65.6806 9.44059 65.4406 8.40059C65.2006 7.36059 64.4006 5.76059 61.5205 5.36059H59.8406C58.8806 5.36059 57.9206 5.52059 57.0406 5.84059C55.4406 6.56059 54.4005 8.16059 54.4805 9.92059H57.6005C57.5205 9.12059 58.0006 8.32059 58.7206 8.00059C59.0406 7.92059 59.3605 7.84059 59.7605 7.84059C60.4805 7.76059 61.2806 8.00059 61.8406 8.48059C62.1606 8.80059 62.3205 9.36059 62.1605 9.76059C62.0005 10.5606 61.1205 10.8006 59.7605 10.9606C59.2805 11.0406 58.7206 11.0406 58.2406 11.1206C56.6406 11.2806 54.3205 12.1606 53.7605 14.4006C53.5205 15.7606 54.0806 17.2006 55.1206 18.0806C56.0806 18.8006 57.2805 19.1206 58.4005 19.1206C58.8005 19.1206 59.2805 19.1206 59.6805 19.0406C60.7205 18.8006 61.6005 18.3206 62.4005 17.6806C62.4805 18.0806 62.5605 18.4006 62.8005 18.7206H66.0005C65.7605 17.7606 65.6005 16.7206 65.6805 15.6806ZM62.3206 15.2006C61.9206 16.1606 60.8806 16.8006 59.8406 16.7206C59.6006 16.7206 59.3606 16.7206 59.0406 16.7206C58.3206 16.7206 57.6805 16.4006 57.3605 15.7606C57.1205 15.2806 57.2006 14.7206 57.4406 14.3206C57.9206 13.5206 58.6406 13.3606 59.8406 13.2006C60.2406 13.2006 60.6405 13.1206 60.9605 12.9606C61.5205 12.8806 62.0005 12.7206 62.4005 12.3206C62.4805 13.3606 62.4006 14.3206 62.3206 15.2006ZM14.9605 0.40059C8.56049 -1.19941 2.00053 2.72059 0.400528 9.12059C-1.19947 15.5206 2.72055 22.0806 9.12055 23.6806C13.5205 24.8006 18.1605 23.2806 21.1205 19.8406C19.6805 20.1606 18.1605 20.0806 16.8005 19.6006C11.4405 17.7606 10.4005 12.7206 11.7605 9.28059C13.1205 6.08059 16.8005 4.56059 20.0005 5.92059C20.4005 6.08059 20.7206 6.24059 21.0406 6.48059C24.2406 8.80059 24.0005 13.2006 24.0005 13.2806C24.5605 7.28059 20.7205 1.84059 14.9605 0.40059ZM5.44057 13.6806C4.56057 13.6806 3.92055 12.9606 3.92055 12.1606C3.92055 11.3606 4.64057 10.6406 5.44057 10.6406C6.24057 10.6406 6.96049 11.3606 6.96049 12.1606C6.96049 13.0406 6.32057 13.6806 5.44057 13.6806ZM15.5205 10.9606H20.4005C20.4005 10.2406 20.1605 9.60059 19.6805 9.12059C18.8005 8.08059 17.2805 7.84059 16.0805 8.48059C15.1205 8.96059 13.9206 11.0406 14.6406 14.0006C15.5206 17.0406 18.8806 17.5206 21.0406 16.9606C22.1606 16.5606 23.0405 15.8406 23.6805 14.8806C23.8405 14.4006 23.9205 13.8406 23.9205 13.3606H15.6005L15.5205 10.9606Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_460_1270">
            <rect width="66.08" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </a>
  );

  return (
    <>
      <nav className={styles.navigation}>
        <NewLogo />

        {stories_menu && (
          <div className={styles.storiesContainer}>
            {/* <Button
              className={styles.button}
              id="ui-stories"
              label="stories"
              link="/stories"
              icon={StoryIcon}
              hideLabelOnMobile
            /> */}

            {selectedTags.length > 0 && (
              <div className={styles.tagsContainer}>
                <Button
                  className={styles.tagsButton}
                  icon={FilterIcon}
                  onClick={() => setShowTags(!showTags)}
                />
                <div className={styles.badge} />
                {selectedTags.length > 0 && showTags && (
                  <SelectedTags selectedTags={selectedTags} />
                )}
              </div>
            )}
          </div>
        )}

        {/* {layers_menu && (
          <Button
            className={styles.button}
            id="ui-layers"
            label="layers"
            onClick={() => dispatch(showLayerSelectorAction(true))}
            icon={LayersIcon}
            hideLabelOnMobile
          />
        )} */}
        {/* {share_button && <Share />} */}

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
    </>
  );
};

export default Navigation;
