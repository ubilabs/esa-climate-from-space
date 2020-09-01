import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';
import cx from 'classnames';

import styles from './button.styl';

interface Props {
  label?: string;
  icon?: FunctionComponent;
  link?: string;
  disabled?: boolean;
  className?: string;
  hideLabelOnMobile?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: FunctionComponent<Props> = ({
  label,
  link,
  icon: Icon,
  disabled = false,
  className = '',
  hideLabelOnMobile,
  onClick
}) => {
  const classes = cx(
    styles.button,
    className,
    disabled && styles.disabled,
    hideLabelOnMobile && styles.hideLabel
  );

  return link ? (
    <Link
      onClick={event => disabled && event.preventDefault()}
      className={classes}
      to={link}>
      {Icon && <Icon />}
      {label && (
        <span className={styles.label}>
          <FormattedMessage id={label} />
        </span>
      )}
    </Link>
  ) : (
    <button disabled={disabled} className={classes} onClick={onClick}>
      {Icon && <Icon />}
      {label && (
        <span className={styles.label}>
          <FormattedMessage id={label} />
        </span>
      )}
    </button>
  );
};

export default Button;
