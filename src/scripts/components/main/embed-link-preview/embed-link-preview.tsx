import React, {FunctionComponent, LegacyRef} from 'react';
import cx from 'classnames';

import styles from './embed-link-preview.module.styl';

interface Props {
  embedUrl: string;
  ref?: LegacyRef<HTMLInputElement>;
  className?: string;
}
const EmbedLinkPreview: FunctionComponent<Props> = ({
  embedUrl,
  ref,
  className = ''
}) => {
  const classes = cx(className, styles.embedLinkPreview);

  return (
    <div className={classes}>
      <span className={styles.previewContent}>
        {ref && <input ref={ref} type="hidden" contentEditable="true" />}
        {embedUrl}
      </span>
    </div>
  );
};

export default EmbedLinkPreview;
