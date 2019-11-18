import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import cx from 'classnames';

import styles from './story-header.styl';

import {StoryListItem} from '../../types/story-list';

interface Props {
  mode: string;
  story: StoryListItem;
}

const StoryHeader: FunctionComponent<Props> = ({story, mode}) => {
  const Present = mode === 'present';
  const Showcase = mode === 'showcase';

  const storyClasses = cx(
    styles.header,
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
        {Present && <h3 className={styles.subtitle}>Pagination?</h3>}
      </div>
    </div>
  );
};

export default StoryHeader;
