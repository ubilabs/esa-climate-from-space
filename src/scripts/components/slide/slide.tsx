import React, {FunctionComponent} from 'react';
import {Slide as SlideType} from '../../types/story';
import styles from './slide.styl';

interface Props {
  slide: SlideType;
}

const Slide: FunctionComponent<Props> = ({slide}) => (
  <div className={styles.sidepanel}>
    <img src={slide.image} className={styles.previewImage} />
    <div className={styles.content}>
      <h1>{slide.title}</h1>
      <p>{slide.bodytext}</p>
    </div>
  </div>
);

export default Slide;
