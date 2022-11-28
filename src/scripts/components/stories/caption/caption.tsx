import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import styles from './caption.module.styl';
import {ImageFit} from '../../../types/image-fit';

interface Props {
  content: string;
  showLightbox: boolean;
  imageFit?: ImageFit;
}

const Caption: FunctionComponent<Props> = ({
  content,
  showLightbox,
  imageFit
}) => {
  const classes = cx(styles.caption, showLightbox && styles.lightboxCaption);

  return (
    <div
      className={classes}
      style={{
        position: imageFit === ImageFit.Cover ? 'absolute' : 'static'
      }}>
      <div className={styles.content}>
        <ReactMarkdown
          children={content}
          allowedElements={[
            'heading',
            'text',
            'paragraph',
            'break',
            'strong',
            'emphasis'
          ]}
        />
      </div>
    </div>
  );
};

export default Caption;
