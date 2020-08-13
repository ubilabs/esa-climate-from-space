import React, {FunctionComponent} from 'react';

import {EsaLogo} from '../icons/esa-logo';

import styles from './logo.styl';

const Logo: FunctionComponent = () => (
  <div className={styles.logo}>
    <EsaLogo />
  </div>
);

export default Logo;
