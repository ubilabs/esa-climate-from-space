import React, {FunctionComponent} from 'react';

import Button from '../button/button';
import {StoryIcon} from '../icons/story-icon';
import {LayersIcon} from '../icons/layers-icon';

import styles from './navigation.styl';

const Navigation: FunctionComponent = () => {
  return (
    <div className={styles.navigation}>
      <Button label="stories" link="/stories" icon={StoryIcon} />
      <Button
        label="layers"
        onClick={() => console.log('placeholder')}
        icon={LayersIcon}
      />
      <Button label="more" onClick={() => console.log('placeholder')} />
    </div>
  );
};

export default Navigation;
