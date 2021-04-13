import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import styles from './caption.styl';
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
      style={{
        position: imageFit === ImageFit.Cover ? 'absolute' : 'static'
      }}
      className={classes}>
      <div className={styles.content}>
        <ReactMarkdown
          source={content}
          allowedTypes={[
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
