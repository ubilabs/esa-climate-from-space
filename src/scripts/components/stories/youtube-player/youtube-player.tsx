/* eslint-disable camelcase */
import React, {FunctionComponent} from 'react';
import YouTube, {YouTubeProps} from 'react-youtube';
import {YouTubePlayer} from 'youtube-player/dist/types';

import {Language} from '../../../types/language';

import styles from './youtube-player.styl';

interface Props {
  videoId?: string;
  language: Language;
  isStoryMode: boolean;
  onPlay: (player: YouTubePlayer) => void;
}

const YoutubePlayer: FunctionComponent<Props> = ({
  videoId,
  language,
  isStoryMode,
  onPlay
}) => {
  const options: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      rel: 0,
      cc_load_policy: 1,
      hl: language,
      // @ts-ignore
      cc_lang_pref: language,
      color: 'red',
      controls: 1,
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 1
      // allow:
      //   'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
    }
  };

  return (
    <YouTube
      className={styles.videoPlayer}
      id={videoId}
      opts={options}
      onReady={event => !isStoryMode && event.target.playVideo()}
      onPlay={event => onPlay(event.target)}
    />
  );
};

export default YoutubePlayer;
