import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';

import {StoryMode} from '../../types/story-mode';

import styles from './story-header.styl';

interface Props {
  mode: StoryMode;
  storyTitle: string;
}

const StoryHeader: FunctionComponent<Props> = ({mode, storyTitle}) => {
  const backLink = `/${mode}`;

  return (
    <div className={styles.storyHeader}>
      <Link to={backLink} className={styles.backButton}>
        <FormattedMessage id="goBack" />
      </Link>
      <h1 className={styles.title}>{storyTitle}</h1>
    </div>
  );
};

export default StoryHeader;
