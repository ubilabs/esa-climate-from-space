import React, {FunctionComponent} from 'react';

import Button from '../button/button';
import {ArrowBackIcon} from '../icons/arrow-back-icon';

import styles from './header.styl';

interface Props {
  backLink: string;
  backButtonId: string;
  title: string;
}

const Header: FunctionComponent<Props> = ({
  backLink,
  title,
  backButtonId,
  children
}) => (
  <div className={styles.header}>
    <Button
      className={styles.backButton}
      icon={ArrowBackIcon}
      label={backButtonId}
      link={backLink}
    />
    <h1 className={styles.title}>{title}</h1>
    {children}
  </div>
);

export default Header;
