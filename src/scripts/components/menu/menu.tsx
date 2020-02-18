import React, {FunctionComponent, useState} from 'react';
import {Link} from 'react-router-dom';
import {useIntl, FormattedMessage} from 'react-intl';

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
  const intl = useIntl();
  const menuItems: MenuItem[] = [
    {
      id: 'presenter-mode',
      name: intl.formatMessage({id: 'presenterMode'}),
      link: '/present',
      icon: PresenterIcon
    },
    {
      id: 'show-case-mode',
      name: intl.formatMessage({id: 'showcaseMode'}),
      link: '/showcase',
      icon: ShowCaseIcon
    },
    {
      id: 'language',
      name: intl.formatMessage({id: 'language'}),
      icon: LanguageIcon
    },
    {id: 'share', name: intl.formatMessage({id: 'share'}), icon: ShareIcon},
    {id: 'export', name: intl.formatMessage({id: 'export'}), icon: ExportIcon},
    {id: 'info', name: intl.formatMessage({id: 'info'}), icon: InfoIcon}
  ];

  const [isOpen, setIsOpen] = useState(false);
  const onButtonClickHandler = () => setIsOpen(!isOpen);

  return (
    <div className={styles.menuContainer}>
      <button
        onClick={() => onButtonClickHandler()}
        title={intl.formatMessage({id: 'more'})}
        className={styles.menuButton}>
        <FormattedMessage id="more" />
      </button>
      {isOpen && (
        <ul className={styles.menuList} onClick={() => setIsOpen(false)}>
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
