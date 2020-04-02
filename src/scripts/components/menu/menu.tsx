import React, {FunctionComponent} from 'react';

import {PresenterIcon} from '../icons/presenter-icon';
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
      id: 'modes',
      icon: PresenterIcon,
      subItems: [
        {
          id: 'presenterMode',
          link: '/present'
        },
        {
          id: 'showcaseMode',
          link: '/showcase'
        }
      ]
    },
    {
      id: 'language',
      icon: LanguageIcon
    },
    {
      id: 'share',
      icon: ShareIcon,
      subItems: [
        {
          id: 'twitter'
        },
        {
          id: 'facebook'
        },
        {
          id: 'whatsApp'
        },
        {
          id: 'copyLink'
        }
      ]
    },
    {
      id: 'info',
      icon: InfoIcon,
      subItems: [
        {
          id: 'presenterMode',
          link: '/present'
        },
        {
          id: 'showcaseMode',
          link: '/showcase'
        }
      ]
    },
    {
      id: 'export',
      icon: ExportIcon,
      subItems: [
        {
          id: 'presenterMode',
          link: '/present'
        },
        {
          id: 'showcaseMode',
          link: '/showcase'
        }
      ]
    }
  ];

  return (
    <nav className={styles.menuContainer}>
      <ul className={styles.menuList}>
        {menuItems.map(menuItem => (
          <li className={styles.menuListItem} key={menuItem.id}>
            <Button
              className={styles.menuItemTitle}
              label={menuItem.id}
              icon={menuItem.icon}></Button>
            <ul className={styles.subMenuList}>
              {menuItem.subItems?.map(subItem => (
                <li className={styles.subMenuListItem} key={subItem.id}>
                  {subItem.link ? (
                    <Button
                      className={styles.menuButton}
                      label={subItem.id}
                      link={subItem.link}
                    />
                  ) : (
                    <Button
                      className={styles.menuButton}
                      label={subItem.id}
                      onClick={() => console.log('placeholder')}
                    />
                  )}
                </li>
              ))}
              {menuItem.id === 'language' && <LanguageSelector />}
            </ul>
          </li>
        ))}
      </ul>
      <div className={styles.logo}>
        <CCILogo />
      </div>
    </nav>
  );
};

export default Menu;
