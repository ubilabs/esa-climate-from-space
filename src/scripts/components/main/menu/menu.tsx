import React, {FunctionComponent, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import LanguageSelector from '../language-selector/language-selector';
import Button from '../button/button';
import {PresenterIcon} from '../icons/presenter-icon';
import {LanguageIcon} from '../icons/language-icon';
import {InfoIcon} from '../icons/info-icon';
import {DownloadIcon} from '../icons/download-icon';
import {CCILogo} from '../icons/cci-logo';
import AboutProject from '../about-project/about-project';
import Overlay from '../overlay/overlay';
import {WindowsIcon} from '../icons/windows-icon';
import {LinuxIcon} from '../icons/linux-icon';
import {AppleIcon} from '../icons/apple-icon';
import config from '../../../config/main';

import styles from './menu.styl';

const Menu: FunctionComponent = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <React.Fragment>
      <nav className={styles.menuContainer}>
        {showOverlay ? (
          <Overlay onClose={() => setShowOverlay(false)}>
            <AboutProject />
          </Overlay>
        ) : (
          <React.Fragment>
            <ul className={styles.menuList}>
              <li className={styles.menuItemTitle}>
                <PresenterIcon /> <FormattedMessage id={'modes'} />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={'presenterMode'}
                  link={'/present'}
                />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={'showcaseMode'}
                  link={'/showcase'}
                />
              </li>
              <li className={styles.subMenuTitle}>
                <DownloadIcon /> <FormattedMessage id={'offline'} />
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.downloadUrls.windows}
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <WindowsIcon />
                  Windows
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.downloadUrls.macOS}
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <AppleIcon />
                  macOS
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.downloadUrls.linux}
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <LinuxIcon />
                  Linux
                </a>
              </li>
            </ul>

            <ul className={styles.menuList}>
              <li className={styles.menuItemTitle}>
                <LanguageIcon /> <FormattedMessage id={'language'} />
              </li>
              <li>
                <LanguageSelector className={styles.menuListItem} />
              </li>
            </ul>
            <ul className={styles.menuList}>
              <li className={styles.menuItemTitle}>
                <InfoIcon /> <FormattedMessage id={'info'} />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={'about'}
                  onClick={() => setShowOverlay(true)}
                />
              </li>
              <li className={styles.menuListItem}>
                <a
                  href="https://www.esa.int/"
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <FormattedMessage id={'EsaWebsite'} />
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href="https://climate.esa.int/"
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <FormattedMessage id={'CCIWebsite'} />
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href="https://github.com/ubilabs/esa-climate-from-space"
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <FormattedMessage id={'github'} />
                </a>
              </li>
            </ul>
          </React.Fragment>
        )}
      </nav>
      <div className={styles.logo}>
        <CCILogo />
      </div>
    </React.Fragment>
  );
};

export default Menu;
