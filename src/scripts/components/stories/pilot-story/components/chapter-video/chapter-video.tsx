import React, {FunctionComponent} from 'react';
import {Parallax} from 'react-scroll-parallax';
import {useSelector} from 'react-redux';

import YoutubePlayer from '../../../youtube-player/youtube-player';
import {languageSelector} from '../../../../../selectors/language';

import styles from './chapter-video.module.styl';

interface Props {
  video: {
    title: string;
    text: string;
    videoId: string;
    caption: string;
  };
}

const ChapterVideo: FunctionComponent<Props> = ({video}) => {
  const language = useSelector(languageSelector);
  const {title, text, videoId, caption} = video;

  return (
    <Parallax opacity={[0, 2]} className={styles.chapterVideo}>
      <Parallax speed={20} className={styles.videoText} easing="easeInQuad">
        <h3>{title}</h3>
        <p>{text}</p>
      </Parallax>
      <div className={styles.videoContainer}>
        <YoutubePlayer
          videoId={videoId}
          language={language}
          isStoryMode={true}
        />
        <p className={styles.videoCaption}>{caption}</p>
      </div>
    </Parallax>
  );
};

export default ChapterVideo;
