import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import LanguageSelector from '../language-selector/language-selector';
import Button from '../button/button';
import {PresenterIcon} from '../icons/presenter-icon';
import {LanguageIcon} from '../icons/language-icon';
import {InfoIcon} from '../icons/info-icon';
import {DownloadIcon} from '../icons/download-icon';

import styles from './menu.styl';

const Menu: FunctionComponent = () => {
  return (
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
          <Button className={styles.menuButton} label={'about'} />
        </li>
        <li className={styles.menuListItem}>
          <Button className={styles.menuButton} label={'EsaWebsite'} />
        </li>
        <li className={styles.menuListItem}>
          <Button className={styles.menuButton} label={'CCIWebsite'} />
        </li>
        <li className={styles.menuListItem}>
          <Button className={styles.menuButton} label={'github'} />
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
