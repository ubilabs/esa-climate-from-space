/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import cx from 'classnames';
import {VideoJsPlayer} from 'video.js';

import {languageSelector} from '../../../selectors/language';
import {StoryMode} from '../../../types/story-mode';
import {YouTubePlayer} from 'youtube-player/dist/types';
import VideoJS from '../video-js/video-js';
import YoutubePlayer from '../youtube-player/youtube-player';

import {Slide} from '../../../types/story';

import styles from './story-video.styl';

interface Props {
  mode: StoryMode | null;
  storyId: string;
  slide: Slide;
  onPlay: (player: YouTubePlayer | VideoJsPlayer) => void;
}

const StoryVideo: FunctionComponent<Props> = ({
  mode,
  storyId,
  slide,
  onPlay
}) => {
  const {videoSrc, videoId, videoCaptions, videoPoster} = slide;
  const language = useSelector(languageSelector);
  const isStoryMode = mode === StoryMode.Stories;
  const classes = cx(
    styles.storyVideo,
    !isStoryMode && styles.presentationVideo
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
