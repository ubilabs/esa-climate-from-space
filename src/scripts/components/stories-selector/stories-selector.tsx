import React, {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';

import StoryList from '../story-list/story-list';
import Header from '../header/header';
import Button from '../button/button';
import styles from './stories-selector.styl';

import {StoryMode} from '../../types/story-mode';
import {ShareIcon} from '../icons/share-icon';

const StoriesSelector: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div className={styles.storiesSelector}>
      <Header
        backLink="/"
        backButtonId="backToDataMode"
        title={intl.formatMessage({id: 'storyMode'})}>
        <Button icon={ShareIcon} onClick={() => console.log('placeholder')} />
      </Header>
      <StoryList mode={StoryMode.Stories} />
    </div>
  );
};

export default StoriesSelector;
