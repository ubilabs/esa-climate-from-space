import React, {FunctionComponent, useState} from 'react';
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
      link: 'http://....'
    },
    {
      id: 'show-case-mode',
      name: 'Show Case Mode',
      link: 'http://....'
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
                <a href={menuItem.link}>{menuItem.name}</a>
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
