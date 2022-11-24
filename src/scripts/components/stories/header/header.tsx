import React, {FunctionComponent} from 'react';

import Button from '../../main/button/button';
import {ArrowBackIcon} from '../../main/icons/arrow-back-icon';
import {EsaLogoShort} from '../../main/icons/esa-logo-short';

import styles from './header.styl';

interface Props {
  backLink: string;
  backButtonId: string;
  title: string;
  children?: React.ReactElement | React.ReactElement[];
}

const Header: FunctionComponent<Props> = ({
  backLink,
  title,
  backButtonId,
  children
}) => (
  <div className={styles.header}>
    <div className={styles.logo}>
      <EsaLogoShort />
    </div>
    <Button
      className={styles.backButton}
      icon={ArrowBackIcon}
      label={backButtonId}
      link={backLink}
      hideLabelOnMobile
    />
    {title && <h1 className={styles.title}>{title}</h1>}
    <div className={styles.rightContent}>{children}</div>
  </div>
);

export default Header;
