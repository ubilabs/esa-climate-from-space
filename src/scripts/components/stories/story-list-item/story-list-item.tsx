import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import cx from 'classnames';

import StoryTags from '../story-tags/story-tags';
import {replaceUrlPlaceholders} from '../../../libs/replace-url-placeholders';
import {DownloadButton} from '../../main/download-button/download-button';
import {getStoryAssetUrl} from '../../../libs/get-story-asset-urls';
import config from '../../../config/main';

import {StoryListItem as StoryListItemType} from '../../../types/story-list';
import {StoryMode} from '../../../types/story-mode';

import styles from './story-list-item.styl';

interface Props {
  story: StoryListItemType;
  mode: StoryMode;
  selectedIndex: number;
  selectedTags: string[];
  onSelectStory: (id: string) => void;
}

const StoryListItemContent: FunctionComponent<Props> = ({
  mode,
  story,
  selectedIndex,
  selectedTags,
  onSelectStory
}) => {
  const classes = cx(
    styles.storyListItem,
    mode === StoryMode.Present && styles.present,
    mode === StoryMode.Showcase && styles.showcase,
    selectedIndex >= 0 && styles.selected
  );
  const isStoriesMode = StoryMode.Stories === mode;
  const downloadUrl = replaceUrlPlaceholders(config.api.storyOfflinePackage, {
    id: story.id
  });
  const downloadId = `story-${story.id}`;
  const imageUrl = getStoryAssetUrl(story.id, story.image);

  return (
    <div
      className={classes}
      onClick={() => mode === StoryMode.Showcase && onSelectStory(story.id)}>
      {selectedIndex >= 0 && (
        <div className={styles.storyNumber}>{selectedIndex + 1}</div>
      )}
      <div
        className={styles.image}
        style={{backgroundImage: `url(${imageUrl})`}}></div>
      <div className={styles.info}>
        <p className={styles.title}>{story.title}</p>
        <p className={styles.description}>{story.description}</p>
        {/* {story.tags && isStoriesMode && (
          <StoryTags tags={story.tags} selected={selectedTags} />
        )} */}
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
  selectedTags,
  onSelectStory
}) => {
  const isShowcaseMode = mode === StoryMode.Showcase;

  return !isShowcaseMode ? (
    <Link to={`/${mode}/${story.id}/0`}>
      <StoryListItemContent
        selectedIndex={selectedIndex}
        selectedTags={selectedTags}
        mode={mode}
        story={story}
        onSelectStory={id => onSelectStory(id)}
      />
    </Link>
  ) : (
    <StoryListItemContent
      selectedIndex={selectedIndex}
      selectedTags={selectedTags}
      mode={mode}
      story={story}
      onSelectStory={id => onSelectStory(id)}
    />
  );
};

export default StoryListItem;
