import React, {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';

import StoryList from '../story-list/story-list';
import Header from '../header/header';
import Share from '../../main/share/share';

import {StoryMode} from '../../../types/story-mode';

import styles from './presentation-selector.styl';

const PresentationSelector: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div className={styles.presentationSelector}>
      <Header
        backLink="/"
        backButtonId="backToDataMode"
        title={intl.formatMessage({id: 'presenter'})}>
        <Share />
      </Header>
      <StoryList mode={StoryMode.Present} />
    </div>
  );
};

export default PresentationSelector;
