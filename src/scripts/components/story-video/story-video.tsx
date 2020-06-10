import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import {languageSelector} from '../../selectors/language';

import styles from './story-video.styl';

interface Props {
  videoId: string;
}

const StoryVideo: FunctionComponent<Props> = ({videoId}) => {
  const language = useSelector(languageSelector);

  return (
    <div className={styles.storyVideo}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&cc_load_policy=1&cc_lang_pref=${language}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen></iframe>
    </div>
  );
};

export default StoryVideo;
