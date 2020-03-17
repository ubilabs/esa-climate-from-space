import React, {FunctionComponent} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useIntl} from 'react-intl';

import StoryList from '../story-list/story-list';
import Header from '../header/header';

import {StoryMode} from '../../types/story-mode';

import styles from './showcase-selector.styl';

const ShowcaseSelector: FunctionComponent = () => {
  const params = useParams<{storyIds?: string}>();
  const history = useHistory();
  const intl = useIntl();
  const storyIds = params.storyIds?.split('&');
  const selectedIds = storyIds || [];

  const onSelectStory = (id: string) => {
    const isInList = selectedIds.includes(id);
    const newIds = isInList
      ? selectedIds.filter(selectedId => selectedId !== id)
      : selectedIds.concat(id);
    history.replace(`/showcase/${newIds.join('&')}`);
  };

  return (
    <div className={styles.showcaseSelector}>
      <Header
        backLink="/"
        backButtonId="backToDataMode"
        title={intl.formatMessage({id: 'showcaseMode'})}
        selectedIds={selectedIds}
      />
      <StoryList
        mode={StoryMode.Showcase}
        onSelectStory={id => onSelectStory(id)}
        selectedIds={selectedIds}
      />
    </div>
  );
};

export default ShowcaseSelector;
