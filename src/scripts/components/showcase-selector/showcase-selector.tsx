import React, {FunctionComponent, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import StoryList from '../story-list/story-list';

import {StoryMode} from '../../types/story-mode';

import styles from './showcase-selector.styl';

const ShowcaseSelector: FunctionComponent = () => {
  const history = useHistory();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const setUrl = (newIds: string[]) => {
    const urlIds = newIds.join('&');
    const newPath = `/showcase/${urlIds}`;
    history.push(newPath);
  };

  const onSelectStory = (id: string) => {
    const isInList = selectedIds.includes(id);
    const newIds = isInList
      ? selectedIds.filter(selectedId => selectedId !== id)
      : selectedIds.concat(id);
    setSelectedIds(newIds);
    setUrl(newIds);
  };

  return (
    <div className={styles.showcaseSelector}>
      <Link to="/" className={styles.backButton}>
        <FormattedMessage id="goBack" />
      </Link>
      <h1 className={styles.title}>
        <FormattedMessage id="showcaseMode" />
      </h1>
      <StoryList
        mode={StoryMode.Showcase}
        onSelectStory={id => onSelectStory(id)}
      />
    </div>
  );
};

export default ShowcaseSelector;
