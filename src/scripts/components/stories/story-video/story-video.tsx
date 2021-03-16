/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import cx from 'classnames';
import YouTube, {Options} from 'react-youtube';

import {languageSelector} from '../../../selectors/language';

import {StoryMode} from '../../../types/story-mode';

import styles from './story-video.styl';

interface Props {
  videoId: string;
  mode: StoryMode | null;
  onPlay: (event: any) => void;
}

const StoryVideo: FunctionComponent<Props> = ({mode, videoId, onPlay}) => {
  const language = useSelector(languageSelector);
  const isStoryMode = mode === StoryMode.Stories;
  const classes = cx(
    styles.storyVideo,
    !isStoryMode && styles.presentationVideo
  );

  const opts: Options = {
    height: '100%',
    width: '100%',
    playerVars: {
      rel: 0,
      cc_load_policy: 1,
      hl: language,
      // @ts-ignore
      cc_lang_pref: language,
      color: 'red',
      controls: 2,
      iv_load_policy: 3,
      modestbranding: 1,
      showinfo: 0,
      allow:
        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
    }
  };

  return (
    <div className={classes}>
      <YouTube
        containerClassName={styles.youtubePlayer}
        videoId={videoId}
        opts={opts}
        onReady={event => !isStoryMode && event.target.playVideo()}
        onPlay={event => onPlay(event)}
      />
    </div>
  );
};

export default StoryVideo;
