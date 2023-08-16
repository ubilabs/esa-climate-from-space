import React, {FunctionComponent, LegacyRef} from 'react';
import cx from 'classnames';

import styles from './embed-textarea.module.styl';

interface Props {
  embedUrl: string;
  ref?: LegacyRef<HTMLInputElement>;
  className?: string;
}
const EmbedTextarea: FunctionComponent<Props> = ({
  embedUrl,
  ref,
  className = ''
}) => {
  const classes = cx(className, styles.embedPreviewArea);

  return (
    <div className={classes}>
      <span className={styles.previewContent}>
        {ref && <input ref={ref} type="hidden" contentEditable="true" />}
        {embedUrl}
      </span>
    </div>
  );
};

export default EmbedTextarea;
