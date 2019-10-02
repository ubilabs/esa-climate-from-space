import React, {FunctionComponent, useState} from 'react';
import styles from './menu.styl';

interface MenuItems {
  id: number;
  name: string;
  link: string | null;
}

const Menu: FunctionComponent<{}> = () => {
  const menuItems = [
    {
      id: 1,
      name: 'Presenter Mode',
      link: 'http://....'
    },
    {
      id: 2,
      name: 'Show Case Mode',
      link: 'http://....'
    },
    {id: 3, name: 'Change language'},
    {id: 4, name: 'Share Content'},
    {id: 5, name: 'Export Data'},
    {id: 6, name: 'More Information'}
  ];

  const [isOpen, setIsOpen] = useState(false);

  const onButtonClickHandler = () => {
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    if (isOpen) {
      setIsOpen(false);
    }
  };

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
                <a href="{link}">{menuItem.name}</a>
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
