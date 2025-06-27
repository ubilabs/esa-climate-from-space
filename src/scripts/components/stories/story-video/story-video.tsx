import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";
import { VideoJsPlayer } from "video.js";

import { languageSelector } from "../../../selectors/language";
import { AppRoute } from "../../../types/app-routes";
import { YouTubePlayer } from "youtube-player/dist/types";
import VideoJS from "../video-js/video-js";
import YoutubePlayer from "../youtube-player/youtube-player";

import { VideoItem } from "../../../types/gallery-item";

import styles from "./story-video.module.css";

interface Props {
  route: AppRoute | null;
  storyId: string;
  videoItem: VideoItem;
  onPlay: (player: YouTubePlayer | VideoJsPlayer) => void;
}

const StoryVideo: FunctionComponent<Props> = ({
  route,
  storyId,
  videoItem,
  onPlay,
}) => {
  const { videoSrc, videoId, videoCaptions, videoPoster } = videoItem;
  const language = useSelector(languageSelector);
  const isStoryMode = route === AppRoute.Stories;
  const classes = cx(
    styles.storyVideo,
    !isStoryMode && styles.presentationVideo,
  );

  return (
    <div className={classes}>
      {videoSrc ? (
        <VideoJS
          storyId={storyId}
          videoSrc={videoSrc}
          language={language}
          isStoryMode={isStoryMode}
          videoCaptions={videoCaptions}
          videoPoster={videoPoster}
          onPlay={onPlay}
        />
      ) : (
        <YoutubePlayer
          videoId={videoId}
          language={language}
          isStoryMode={isStoryMode}
          onPlay={onPlay}
        />
      )}
    </div>
  );
};

export default StoryVideo;
