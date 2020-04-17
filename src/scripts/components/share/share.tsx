import React, {FunctionComponent, useState} from 'react';

import {YoutubeIcon} from '../icons/youtube-icon';
import {TwitterIcon} from '../icons/twitter-icon';
import {InstagramIcon} from '../icons/instagram-icon';
import {FacebookIcon} from '../icons/facebook-icon';
import {CopyIcon} from '../icons/copy-icon';
import {ShareIcon} from '../icons/share-icon';
import config from '../../config/main';

import styles from './share.styl';
import {FormattedMessage} from 'react-intl';
import Button from '../button/button';
import {CloseIcon} from '../icons/close-icon';
import Overlay from '../overlay/overlay';
import {replaceUrlPlaceholders} from '../../libs/replace-url-placeholders';

const Share: FunctionComponent = () => {
  const [showShare, setShowShare] = useState(false);
  const currentUrl = window.location.href;
  const shareUrl = `ESA Climate From Space: ${window.location.href}`;
  const facebookUrl = replaceUrlPlaceholders(config.api.facebook, {
    currentUrl
  });
  const twitterUrl = replaceUrlPlaceholders(config.api.twitter, {
    currentUrl
  });
  const urlInput = document.querySelector('#urlInput') as HTMLInputElement;
  const copyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    } else {
      urlInput.select();
      document.execCommand('copy');
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
        <Overlay showCloseButton={false} onClose={() => {}}>
          <div className={styles.shareOverlay}>
            <Button
              icon={CloseIcon}
              className={styles.closeButton}
              onClick={() => setShowShare(false)}
            />
            <h1 className={styles.title}>Share with the world</h1>
            <div className={styles.shareButtons}>
              <a href={'#'} target={'blank'} className={styles.button}>
                <YoutubeIcon />
                <span>Youtube</span>
              </a>
              <a href={twitterUrl} target={'blank'} className={styles.button}>
                <TwitterIcon />
                <span>Twitter</span>
              </a>
              <a href={facebookUrl} target={'blank'} className={styles.button}>
                <FacebookIcon />
                <span>Facebook</span>
              </a>
              <a href={'#'} target={'blank'} className={styles.button}>
                <InstagramIcon />
                <span>Instagram</span>
              </a>
              <button
                id="urlInput"
                onClick={() => copyUrl()}
                className={styles.button}>
                <CopyIcon />
                <span>
                  <FormattedMessage id={'copyLink'} />
                </span>
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
};

export default Share;
