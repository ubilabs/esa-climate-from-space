import React, {FunctionComponent} from 'react';

import {PresenterIcon} from '../icons/presenter-icon';
import {ShowCaseIcon} from '../icons/show-case-icon';
import {LanguageIcon} from '../icons/language-icon';
import {ShareIcon} from '../icons/share-icon';
import {InfoIcon} from '../icons/info-icon';
import {ExportIcon} from '../icons/export-icon';
import LanguageSelector from '../language-selector/language-selector';
import Button from '../button/button';
import {CCILogo} from '../icons/cci-logo';

import {MenuItem} from '../../types/menu-item';

import styles from './menu.styl';

const Menu: FunctionComponent = () => {
  const menuItems: MenuItem[] = [
    {
      id: 'presenterMode',
      link: '/present',
      icon: PresenterIcon
    },
    {
      id: 'showcaseMode',
      link: '/showcase',
      icon: ShowCaseIcon
    },
    {
      id: 'language',
      icon: LanguageIcon
    },
    {id: 'share', icon: ShareIcon},
    {id: 'export', icon: ExportIcon},
    {id: 'info', icon: InfoIcon}
  ];

  return (
    <div className={styles.menuContainer}>
      <ul className={styles.menuList}>
        {menuItems.map(menuItem => (
          <li className={styles.menuListItem} key={menuItem.id}>
            {menuItem.link ? (
              <Button
                label={menuItem.id}
                link={menuItem.link}
                icon={menuItem.icon}
              />
            ) : (
              <Button
                label={menuItem.id}
                icon={menuItem.icon}
                onClick={() => console.log('placeholder')}
              />
            )}
            {menuItem.id === 'language' && <LanguageSelector />}
          </li>
        ))}
      </ul>
      <div className={styles.logo}>
        <CCILogo />
      </div>
    </div>
  );
};

export default Menu;
