import React, {FunctionComponent, useState} from 'react';
import {Link} from 'react-router-dom';
import {useIntl} from 'react-intl';

import {MenuIcon} from '../icons/menu-icon';
import {PresenterIcon} from '../icons/presenter-icon';
import {ShowCaseIcon} from '../icons/show-case-icon';
import {LanguageIcon} from '../icons/language-icon';
import {ShareIcon} from '../icons/share-icon';
import {InfoIcon} from '../icons/info-icon';
import {ExportIcon} from '../icons/export-icon';
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
  const intl = useIntl();
  const onButtonClickHandler = () => setIsOpen(!isOpen);

  return (
    <div className={styles.menuContainer}>
      <button
        onClick={() => onButtonClickHandler()}
        title={intl.formatMessage({id: 'menu'})}
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
