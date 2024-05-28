import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import cx from 'classnames';

import styles from './button.module.styl';

interface Props {
  label?: string;
  icon?: FunctionComponent;
  link?: string;
  isBackButton?: boolean;
  className?: string;
  id?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: FunctionComponent<Props> = ({
  label,
  link,
  icon: Icon,
  isBackButton = false,
  className = '',
  id,
  onClick
}) => {
  const classes = cx(
    styles.button,
    className,
    isBackButton && styles.backButton
  );

  return link ? (
    <Link id={id} className={classes} to={link}>
      {Icon && <Icon />}
      {label && (
        <span className={styles.label} onClick={onClick}>
          {label}
        </span>
      )}
    </Link>
  ) : (
    <button className={classes} id={id} onClick={onClick}>
      {Icon && <Icon />}
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
};

export default Button;
