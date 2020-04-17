import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';

import Button from '../button/button';
import Overlay from '../overlay/overlay';
import Menu from '../menu/menu';
import {LayersIcon} from '../icons/layers-icon';
import {StoryIcon} from '../icons/story-icon';
import showLayerSelectorAction from '../../actions/show-layer-selector';
import Share from '../share/share';
import {MenuIcon} from '../icons/menu-icon';

import styles from './navigation.styl';

const Navigation: FunctionComponent = () => {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className={styles.navigation}>
      <Button
        className={styles.button}
        label="stories"
        link="/stories"
        icon={StoryIcon}
      />
      <Button
        className={styles.button}
        label="layers"
        onClick={() => dispatch(showLayerSelectorAction(true))}
        icon={LayersIcon}
      />
      <Share />
      <Button
        className={styles.button}
        icon={MenuIcon}
        onClick={() => setShowMenu(true)}
      />
      {showMenu && (
        <Overlay onClose={() => setShowMenu(false)}>
          <Menu />
        </Overlay>
      )}
    </div>
  );
};

export default Navigation;
