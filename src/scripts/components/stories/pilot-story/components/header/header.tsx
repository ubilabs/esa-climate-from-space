import React, {FunctionComponent} from 'react';

import {EsaLogo} from '../../../../main/icons/esa-logo';

import styles from './header.module.styl';

interface Props {
  children?: React.ReactElement | React.ReactElement[];
}

const Header: FunctionComponent<Props> = ({children}) => (
  <div className={styles.header}>
    <div className={styles.logo}>
      <EsaLogo />
    </div>
    <div className={styles.rightContent}>{children}</div>
  </div>
);

export default Header;
