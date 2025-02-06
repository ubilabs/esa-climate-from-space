import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import cx from 'classnames';
import {FormattedMessage} from 'react-intl';

import {storyListSelector} from '../../../selectors/story/list';
import {selectedTagsSelector} from '../../../selectors/story/selected-tags';
import StoryListItem from '../story-list-item/story-list-item';
import {filterStories} from '../../../libs/filter-stories';

import {StoryMode} from '../../../types/story-mode';

import styles from './story-list.module.css';

interface Props {
  mode: StoryMode;
  selectedIds?: string[];
  onSelectStory?: (id: string) => void;
}

const StoryList: FunctionComponent<Props> = ({
  mode,
  selectedIds,
  onSelectStory = () => {}
}) => {
  const stories = useSelector(storyListSelector);
  const selectedTags = useSelector(selectedTagsSelector);
  const filteredStories = filterStories(stories, selectedTags);

  const classes = cx(
    styles.storyListGrid,
    mode === StoryMode.Present && styles.present,
    mode === StoryMode.Showcase && styles.showcase
  );

  return (
    <div className={styles.storyList}>
      {filteredStories.length ? (
        <div className={classes}>
          {filteredStories.map(story => {
            let selectedIndex = selectedIds?.indexOf(story.id);

            if (typeof selectedIndex !== 'number') {
              selectedIndex = -1;
            }

            return (
              <StoryListItem
                key={story.id}
                story={story}
                mode={mode}
                selectedTags={selectedTags}
                selectedIndex={selectedIndex}
                onSelectStory={id => onSelectStory(id)}
              />
            );
          })}
        </div>
      ) : (
        <div className={styles.noMatchingStories}>
          <FormattedMessage id={'noStoriesMatch'} />
        </div>
      )}
    </div>
  );
};

export default StoryList;
