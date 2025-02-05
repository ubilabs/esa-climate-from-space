import {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';

import StoryList from '../story-list/story-list';
import StoryFilter from '../story-filter/story-filter';
import Header from '../header/header';
import Share from '../../main/share/share';
import {embedElementsSelector} from '../../../selectors/embed-elements-selector';

import {StoryMode} from '../../../types/story-mode';

import styles from './stories-selector.module.css';

const StoriesSelector: FunctionComponent = () => {
  const intl = useIntl();
  const {header, filter_tags} = useSelector(embedElementsSelector);

  return (
    <div className={styles.storiesSelector}>
      {header && (
        <Header
          backLink="/"
          backButtonId="backToDataMode"
          title={intl.formatMessage({id: 'storyMode'})}>
          <Share />
        </Header>
      )}
      {filter_tags && <StoryFilter />}
      <StoryList mode={StoryMode.Stories} />
    </div>
  );
};

export default StoriesSelector;
