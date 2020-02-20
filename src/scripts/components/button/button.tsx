import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import styles from './button.styl';

interface Props {
  label?: string;
  icon?: FunctionComponent;
  link?: string;
  onClick?: () => void;
}

const Button: FunctionComponent<Props> = ({
  label,
  link,
  icon: Icon,
  onClick
}) => {
  return link ? (
    <Link className={styles.button} to={link}>
      {Icon && <Icon />} {label && <FormattedMessage id={label} />}
    </Link>
  ) : (
    <button className={styles.button} onClick={onClick}>
      {Icon && <Icon />}
      {label && <FormattedMessage id={label} />}
    </button>
  );
};

export default Button;
