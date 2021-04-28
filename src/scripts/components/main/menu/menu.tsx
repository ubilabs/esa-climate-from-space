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
import {AnalyticsIcon} from '../icons/analytics-icon';
import {LinuxIcon} from '../icons/linux-icon';
import {AppleIcon} from '../icons/apple-icon';
import config from '../../../config/main';
import {Ubilabslogo} from '../icons/ubilabs-logo';
import Attributions from '../attributions/attributions';
import TrackingToggle from '../tracking-toggle/tracking-toggle';
import {FeedbackIcon} from '../icons/feedback-icon';

import styles from './menu.styl';

const Menu: FunctionComponent = () => {
  const [overlayType, setOverlayType] = useState<string | null>(null);
  // @ts-ignore - injected via webpack's define plugin
  const version = INFO_VERSION;

  return (
    <React.Fragment>
      <nav className={styles.menuContainer}>
        {overlayType ? (
          <Overlay onClose={() => setOverlayType(null)}>
            {overlayType === 'about' ? <AboutProject /> : <Attributions />}
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
              <li className={styles.subMenuTitle}>
                <FeedbackIcon /> <FormattedMessage id={'feedback'} />
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.feedbackUrl}
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <FormattedMessage id={'provideFeedback'} />
                </a>
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
                  onClick={() => setOverlayType('about')}
                />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={'attributions'}
                  onClick={() => setOverlayType('attributions')}
                />
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.esaWebsite}
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <FormattedMessage id={'EsaWebsite'} />
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.cciWebsite}
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <FormattedMessage id={'CCIWebsite'} />
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.githubRepo}
                  target={'_blank'}
                  rel="noopener noreferrer"
                  className={styles.menuButton}>
                  <FormattedMessage id={'github'} />
                </a>
              </li>
              <li className={styles.subMenuTitle}>
                <AnalyticsIcon /> <FormattedMessage id={'analytics'} />
              </li>
              <li className={styles.menuListItem}>
                <TrackingToggle />
              </li>
              <li className={styles.subMenuTitle}>
                <AnalyticsIcon /> <FormattedMessage id={'analytics'} />
              </li>
              <li className={styles.menuListItem}>
                <TrackingToggle />
              </li>
            </ul>
          </React.Fragment>
        )}
      </nav>
      <div className={styles.credits}>
        <div className={styles.logo}>
          <a
            href={config.ubilabsWebsite}
            target={'_blank'}
            rel="noopener noreferrer">
            <p className={styles.creditsText}>
              <FormattedMessage id={'madeBy'} />
            </p>
            <Ubilabslogo />
          </a>
        </div>
        <div className={styles.cciLogo}>
          <CCILogo />
          <div className={styles.version}>{version}</div>
        </div>
        <div className={styles.logo}>
          <a
            href={config.planetaryVisionsWebsite}
            target={'_blank'}
            rel="noopener noreferrer">
            <p className={styles.creditsText}>
              <FormattedMessage id={'contentBy'} />
            </p>
            <img src={config.planeratyVisionsLogo} />
          </a>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Menu;
