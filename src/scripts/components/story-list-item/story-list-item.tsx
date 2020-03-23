import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import cx from 'classnames';

import {StoryListItem as StoryListItemType} from '../../types/story-list';
import {StoryMode} from '../../types/story-mode';
import {replaceUrlPlaceholders} from '../../libs/replace-url-placeholders';
import {DownloadButton} from '../download-button/download-button';
import {getStoryMediaUrl} from '../../libs/get-story-media-url';
import config from '../../config/main';

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
  const downloadUrl = replaceUrlPlaceholders(config.api.storyOfflinePackage, {
    id: story.id
  });
  const downloadId = `story-${story.id}`;
  const imageUrl = getStoryMediaUrl(story.id, story.image);

  return (
    <div
      style={{backgroundImage: `url(${imageUrl})`}}
      className={classes}
      onClick={() => mode === StoryMode.Showcase && onSelectStory(story.id)}>
      {selectedIndex >= 0 && (
        <div className={styles.storyNumber}>{selectedIndex + 1}</div>
      )}
      <div className={styles.imageInfo}>
        <p className={styles.title}>{story.title}</p>
        <p className={styles.description}>{story.description}</p>
        <div className={styles.downloadButton}>
          <DownloadButton url={downloadUrl} id={downloadId} />
        </div>
      </div>
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
