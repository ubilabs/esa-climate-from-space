import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import styles from './button.styl';

interface Props {
  label?: string;
  icon?: FunctionComponent;
  link?: string;
  className?: string;
  onClick?: () => void;
}

const Button: FunctionComponent<Props> = ({
  label,
  link,
  icon: Icon,
  className = '',
  onClick
}) => {
  const classes = `${styles.button} ${className}`;

  return link ? (
    <Link className={classes} to={link}>
      {Icon && <Icon />} {label && <FormattedMessage id={label} />}
    </Link>
  ) : (
    <button className={classes} onClick={onClick}>
      {Icon && <Icon />}
      {label && <FormattedMessage id={label} />}
    </button>
  );
};

export default Button;
