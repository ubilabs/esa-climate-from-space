import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

import StoryTags from "../story-tags/story-tags";
import { replaceUrlPlaceholders } from "../../../libs/replace-url-placeholders";
import { DownloadButton } from "../../main/download-button/download-button";
import { getStoryAssetUrl } from "../../../libs/get-story-asset-urls";
import config from "../../../config/main";

import { StoryListItem as StoryListItemType } from "../../../types/story-list";
import { AppRoute } from "../../../types/app-routes";

import styles from "./story-list-item.module.css";

interface Props {
  story: StoryListItemType;
  mode: AppRoute;
  selectedIndex: number;
  selectedTags: string[];
  onSelectStory: (id: string) => void;
}

const StoryListItemContent: FunctionComponent<Props> = ({
  mode,
  story,
  selectedIndex,
  selectedTags,
  onSelectStory,
}) => {
  const classes = cx(
    styles.storyListItem,
    mode === AppRoute.Present && styles.present,
    mode === AppRoute.Showcase && styles.showcase,
    selectedIndex >= 0 && styles.selected,
  );
  const isStoriesMode = AppRoute.Stories === mode;
  const downloadUrl = replaceUrlPlaceholders(config.api.storyOfflinePackage, {
    id: story.id,
  });
  const downloadId = `story-${story.id}`;
  const imageUrl = getStoryAssetUrl(story.id, story.image);

  return (
    <div
      className={classes}
      onClick={() => mode === AppRoute.Showcase && onSelectStory(story.id)}
      onKeyDown={(event) => {
        if (mode === AppRoute.Showcase && (event.key === "Enter" || event.key === " ")) {
          onSelectStory(story.id);
        }
      }}
      role={mode === AppRoute.Showcase ? "button" : undefined}
      tabIndex={mode === AppRoute.Showcase ? 0 : undefined}
    >
      {selectedIndex >= 0 && (
        <div className={styles.storyNumber}>{selectedIndex + 1}</div>
      )}
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className={styles.info}>
        <p className={styles.title}>{story.title}</p>
        <p className={styles.description}>{story.description}</p>
        {story.tags && isStoriesMode && (
          <StoryTags tags={story.tags} selected={selectedTags} />
        )}
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
  onSelectStory,
}) => {
  const isShowcaseMode = mode === AppRoute.Showcase;

  return !isShowcaseMode ? (
    <Link to={`/${mode}/${story.id}/0`}>
      <StoryListItemContent
        selectedIndex={selectedIndex}
        selectedTags={selectedTags}
        mode={mode}
        story={story}
        onSelectStory={(id) => onSelectStory(id)}
      />
    </Link>
  ) : (
    <StoryListItemContent
      selectedIndex={selectedIndex}
      selectedTags={selectedTags}
      mode={mode}
      story={story}
      onSelectStory={(id) => onSelectStory(id)}
    />
  );
};

export default StoryListItem;
