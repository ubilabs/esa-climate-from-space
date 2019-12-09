import React, {FunctionComponent} from 'react';

import styles from './story-video.styl';

interface Props {
  videoId: string;
}

const StoryVideo: FunctionComponent<Props> = ({videoId}) => (
  <div className={styles.storyVideo}>
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen></iframe>
  </div>
);

export default StoryVideo;
