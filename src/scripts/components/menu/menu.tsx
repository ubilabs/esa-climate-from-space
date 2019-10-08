import React, {FunctionComponent, useState} from 'react';
import {Link} from 'react-router-dom';

import styles from './menu.styl';

interface MenuItem {
  id: string;
  name: string;
  link?: string;
}

const Menu: FunctionComponent<{}> = () => {
  const menuItems: MenuItem[] = [
    {
      id: 'presenter-mode',
      name: 'Presenter Mode',
      link: '/present'
    },
    {
      id: 'show-case-mode',
      name: 'Show Case Mode',
      link: '/showcase'
    },
    {id: 'language', name: 'Change language'},
    {id: 'share', name: 'Share Content'},
    {id: 'export', name: 'Export Data'},
    {id: 'info', name: 'More Information'}
  ];

  const [isOpen, setIsOpen] = useState(false);

  const onButtonClickHandler = () => setIsOpen(!isOpen);

  return (
    <div className={styles.menuContainer}>
      <button
        onClick={() => onButtonClickHandler()}
        className={styles.menuButton}>
        ..
      </button>
      {isOpen && (
        <ul className={styles.menuList}>
          {menuItems.map(menuItem => (
            <li className={styles.menuListItem} key={menuItem.id}>
              {menuItem.link ? (
                <Link to={menuItem.link}>{menuItem.name}</Link>
              ) : (
                menuItem.name
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Menu;
