import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import cx from 'classnames';

import {StoryListItem as StoryListItemType} from '../../types/story-list';
import {StoryMode} from '../../types/story-mode';

import styles from './story-list-item.styl';

interface Props {
  story: StoryListItemType;
  mode: StoryMode;
  selectedIndex: number;
  onSelectStory: (id: string) => void;
}

const StoryListItemContent: FunctionComponent<Props> = ({
  mode,
  story,
  selectedIndex,
  onSelectStory
}) => {
  const classes = cx(
    styles.storyItem,
    mode === StoryMode.Present && styles.present,
    selectedIndex >= 0 && styles.selected
  );

  return (
    <div
      className={classes}
      onClick={() => mode === StoryMode.Showcase && onSelectStory(story.id)}>
      <img src={story.image} className={styles.image} />
      {selectedIndex >= 0 && (
        <div className={styles.storyNumber}>{selectedIndex + 1}</div>
      )}
      <p className={styles.title}>{story.title}</p>
      <p className={styles.description}>{story.description}</p>
    </div>
  );
};

const StoryListItem: FunctionComponent<Props> = ({
  story,
  mode,
  selectedIndex,
  onSelectStory
}) => {
  const isShowcaseMode = mode === StoryMode.Showcase;

  return !isShowcaseMode ? (
    <Link to={`/${mode}/${story.id}`}>
      <StoryListItemContent
        selectedIndex={selectedIndex}
        mode={mode}
        story={story}
        onSelectStory={id => onSelectStory(id)}
      />
    </Link>
  ) : (
    <StoryListItemContent
      selectedIndex={selectedIndex}
      mode={mode}
      story={story}
      onSelectStory={id => onSelectStory(id)}
    />
  );
};

export default StoryListItem;
