import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import cx from 'classnames';

import {languageSelector} from '../../../selectors/language';

import {StoryMode} from '../../../types/story-mode';

import styles from './story-video.styl';

interface Props {
  videoId: string;
  mode: StoryMode | null;
}

const StoryVideo: FunctionComponent<Props> = ({mode, videoId}) => {
  const language = useSelector(languageSelector);
  const classes = cx(
    styles.storyVideo,
    mode !== StoryMode.Stories && styles.presentationVideo
  );

  return (
    <div className={classes}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&cc_load_policy=1&hl=${language}&cc_lang_pref=${language}&color=red&controls=2&iv_load_policy=3&modestbranding=1&showinfo=0`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen></iframe>
    </div>
  );
};

export default StoryVideo;
