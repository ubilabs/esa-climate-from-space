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

import styles from './menu.styl';

const Menu: FunctionComponent = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <React.Fragment>
      <nav className={styles.menuContainer}>
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
            <Button className={styles.menuButton} label={'download'} />
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
            <Button
              className={styles.menuButton}
              label={'EsaWebsite'}
              link="https://www.esa.int/"
            />
          </li>
          <li className={styles.menuListItem}>
            <Button
              className={styles.menuButton}
              label={'CCIWebsite'}
              link="https://climate.esa.int/"
            />
          </li>
          <li className={styles.menuListItem}>
            <Button
              className={styles.menuButton}
              label={'github'}
              link="https://github.com/ubilabs/esa-climate-from-space"
            />
          </li>
        </ul>
      </nav>
      {showOverlay && (
        <Overlay onClose={() => setShowOverlay(false)}>
          <AboutProject />
        </Overlay>
      )}
      <div className={styles.logo}>
        <CCILogo />
      </div>
    </React.Fragment>
  );
};

export default Menu;
