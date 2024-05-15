import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';
import {useSelector} from 'react-redux';

import YoutubePlayer from '../../../youtube-player/youtube-player';
import {languageSelector} from '../../../../../selectors/language';

import styles from './chapter-video.module.styl';

interface Props {
  videoId: string;
}

const ChapterVideo: FunctionComponent<Props> = ({videoId}) => {
  const language = useSelector(languageSelector);

  return (
    <div className={styles.chapterVideo}>
      <Parallax speed={20} className={styles.videoText} easing="easeInQuad">
        <h3>Invisible for human eyes, but visible for infrared cam</h3>
        <p>This video show metane gase leaking during extraction operation</p>
      </Parallax>
      <div className={styles.videoContainer}>
        <YoutubePlayer
          videoId={videoId}
          language={language}
          isStoryMode={true}
        />
        <p className={styles.videoCaption}>
          Quantification of methane emissions and fire intensity from the
          Karaturun East 2023 blowout. Time series of methane emission rates
          <span> (in metric tonnes per hour, t/h)</span> derived from the
          satellite observations which passed the quality screening.
        </p>
      </div>
    </div>
  );
};

export default ChapterVideo;
