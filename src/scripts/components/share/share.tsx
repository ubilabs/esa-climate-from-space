import React, {FunctionComponent, useState, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import {TwitterIcon} from '../icons/twitter-icon';
import {FacebookIcon} from '../icons/facebook-icon';
import {CopyIcon} from '../icons/copy-icon';
import {ShareIcon} from '../icons/share-icon';
import config from '../../config/main';
import Button from '../button/button';
import {CloseIcon} from '../icons/close-icon';
import Overlay from '../overlay/overlay';
import {replaceUrlPlaceholders} from '../../libs/replace-url-placeholders';

import styles from './share.styl';

const Share: FunctionComponent = () => {
  const [showShare, setShowShare] = useState(false);
  const currentUrl = window.location.href;

  const facebookUrl = replaceUrlPlaceholders(config.share.facebook, {
    currentUrl: encodeURIComponent(currentUrl)
  });
  const twitterUrl = replaceUrlPlaceholders(config.share.twitter, {
    currentUrl: encodeURIComponent(currentUrl)
  });

  const ref = useRef<HTMLInputElement>(null);
  const copyUrl = () => {
    if (ref.current) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(currentUrl);
      } else {
        ref.current.value = currentUrl;
        ref.current.focus();
        ref.current.select();
        document.execCommand('copy');
      }
    }
  };
  return (
    <div className={styles.share}>
      <Button
        className={styles.shareButton}
        icon={ShareIcon}
        onClick={() => setShowShare(true)}
      />
      {showShare && (
        <Overlay showCloseButton={false}>
          <div className={styles.shareOverlay}>
            <Button
              icon={CloseIcon}
              className={styles.closeButton}
              onClick={() => setShowShare(false)}
            />
            <h1 className={styles.title}>
              <FormattedMessage id="share" />
            </h1>
            <div className={styles.shareButtons}>
              <a
                href={twitterUrl}
                target={'_blank'}
                rel="noopener noreferrer"
                className={styles.button}>
                <TwitterIcon />
                <span>Twitter</span>
              </a>
              <a
                href={facebookUrl}
                target={'_blank'}
                rel="noopener noreferrer"
                className={styles.button}>
                <FacebookIcon />
                <span>Facebook</span>
              </a>
              <div className={styles.button} onClick={() => copyUrl()}>
                <input ref={ref} type="hidden" contentEditable="true" />
                <CopyIcon />
                <span>
                  <FormattedMessage id={'copyLink'} />
                </span>
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
};

export default Share;
