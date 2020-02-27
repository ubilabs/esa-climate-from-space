import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';

import Button from '../button/button';
import Overlay from '../overlay/overlay';
import Menu from '../menu/menu';
import {LayersIcon} from '../icons/layers-icon';
import {StoryIcon} from '../icons/story-icon';
import showLayerSelectorAction from '../../actions/show-layer-selector';

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
      <Button
        className={styles.button}
        label="more"
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
