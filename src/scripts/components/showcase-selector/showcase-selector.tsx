import React, {FunctionComponent} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';
import {PlayIcon} from '../icons/play-icon';

import StoryList from '../story-list/story-list';

import {StoryMode} from '../../types/story-mode';

import styles from './showcase-selector.styl';

const ShowcaseSelector: FunctionComponent = () => {
  const params = useParams<{storyIds?: string}>();
  const history = useHistory();
  const storyIds = params.storyIds?.split('&');
  const selectedIds = storyIds || [];

  const onSelectStory = (id: string) => {
    const isInList = selectedIds.includes(id);
    const newIds = isInList
      ? selectedIds.filter(selectedId => selectedId !== id)
      : selectedIds.concat(id);

    const newIdsString = newIds.join('&');

    history.replace(`/showcase/${newIdsString}`);
  };

  return (
    <div className={styles.showcaseSelector}>
      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>
          <FormattedMessage id="goBack" />
        </Link>
        <h1 className={styles.title}>
          <FormattedMessage id="showcaseMode" />
        </h1>
        <div className={styles.play}>
          <span>{selectedIds.length} stories selected</span>
          <Link to={`/showcase/${selectedIds.join('&')}/0/0`}>
            <PlayIcon />
          </Link>
        </div>
      </div>
      <StoryList
        mode={StoryMode.Showcase}
        onSelectStory={id => onSelectStory(id)}
        selectedIds={selectedIds}
      />
    </div>
  );
};

export default ShowcaseSelector;
