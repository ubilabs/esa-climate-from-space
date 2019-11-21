import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import cx from 'classnames';

import {StoryListItem} from '../../types/story-list';
import {StoryMode} from '../../types/story-mode';

import styles from './story-header.styl';

interface Props {
  mode: StoryMode;
  story: StoryListItem;
}

const StoryHeader: FunctionComponent<Props> = ({story, mode}) => {
  const Present = mode === StoryMode.Present;
  const Showcase = mode === StoryMode.Showcase;

  const storyClasses = cx(
    styles.storyHeader,
    Present && styles.present,
    Showcase && styles.showcase
  );

  return (
    <div className={storyClasses}>
      <Link to={`/${mode}`} className={styles.backButton}>
        <FormattedMessage id="goBack" />
      </Link>
      <div>
        <h2 className={styles.title}>{story && story.title}</h2>
        {Showcase && (
          <h3 className={styles.subtitle}>{story && story.description}</h3>
        )}
      </div>
    </div>
  );
};

export default StoryHeader;
