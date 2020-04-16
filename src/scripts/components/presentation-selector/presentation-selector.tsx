import React, {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';

import StoryList from '../story-list/story-list';
import Header from '../header/header';
import {ShareIcon} from '../icons/share-icon';
import Button from '../button/button';

import {StoryMode} from '../../types/story-mode';

import styles from './presentation-selector.styl';

const PresentationSelector: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div className={styles.presentationSelector}>
      <Header
        backLink="/"
        backButtonId="backToDataMode"
        title={intl.formatMessage({id: 'presenterMode'})}>
        <Button icon={ShareIcon} onClick={() => console.log('placeholder')} />
      </Header>
      <StoryList mode={StoryMode.Present} />
    </div>
  );
};

export default PresentationSelector;
