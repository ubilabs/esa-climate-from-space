import React, {FunctionComponent, useState} from 'react';
import {Link} from 'react-router-dom';

import {MenuIcon} from '../icons/MenuIcon';
import {PresenterIcon} from '../icons/PresenterIcon';
import {ShowCaseIcon} from '../icons/ShowCaseIcon';
import {LanguageIcon} from '../icons/LanguageIcon';
import {ShareIcon} from '../icons/ShareIcon';
import {InfoIcon} from '../icons/InfoIcon';
import {ExportIcon} from '../icons/ExportIcon';
import LanguageSelector from '../language-selector/language-selector';

import {MenuItem} from '../../types/menu-item';

import styles from './menu.styl';

const Menu: FunctionComponent = () => {
  const menuItems: MenuItem[] = [
    {
      id: 'presenter-mode',
      name: 'Presenter Mode',
      link: '/present',
      icon: PresenterIcon
    },
    {
      id: 'show-case-mode',
      name: 'Show Case Mode',
      link: '/showcase',
      icon: ShowCaseIcon
    },
    {id: 'language', name: 'Change language', icon: LanguageIcon},
    {id: 'share', name: 'Share Content', icon: ShareIcon},
    {id: 'export', name: 'Export Data', icon: ExportIcon},
    {id: 'info', name: 'More Information', icon: InfoIcon}
  ];

  const [isOpen, setIsOpen] = useState(false);

  const onButtonClickHandler = () => setIsOpen(!isOpen);

  return (
    <div className={styles.menuContainer}>
      <button
        onClick={() => onButtonClickHandler()}
        className={styles.menuButton}>
        <MenuIcon />
      </button>
      {isOpen && (
        <ul className={styles.menuList}>
          {menuItems.map(menuItem => {
            const Icon = menuItem.icon;
            return (
              <li className={styles.menuListItem} key={menuItem.id}>
                {menuItem.link ? (
                  <Link to={menuItem.link}>
                    <Icon /> {menuItem.name}
                  </Link>
                ) : (
                  <React.Fragment>
                    <Icon /> {menuItem.name}
                  </React.Fragment>
                )}

                {menuItem.id === 'language' && <LanguageSelector />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Menu;
