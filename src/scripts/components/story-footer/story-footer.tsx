import React, {FunctionComponent} from 'react';

import StoryPagination from '../story-pagination/story-pagination';

import {StoryMode} from '../../types/story-mode';

import styles from './story-footer.styl';

interface Props {
  mode: StoryMode;
}

const StoryFooter: FunctionComponent<Props> = ({mode}) => (
  <div className={styles.storyFooter}>
    <StoryPagination mode={mode} />
  </div>
);

export default StoryFooter;
