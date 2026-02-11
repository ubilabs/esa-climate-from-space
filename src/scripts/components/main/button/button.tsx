import { FunctionComponent, PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import cx from "classnames";

import styles from "./button.module.css";

interface Props {
  label?: string;
  icon?: FunctionComponent;
  link?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  hideLabelOnMobile?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
  replace?: boolean;
  state?: Record<string, string>;
}

const Button: FunctionComponent<PropsWithChildren<Props>> = ({
  label,
  link,
  icon: Icon,
  disabled = false,
  className = "",
  id,
  hideLabelOnMobile,
  onClick,
  ariaLabel,
  children,
  replace,
  state,
}) => {
  const classes = cx(
    styles.button,
    className,
    disabled && styles.disabled,
    hideLabelOnMobile && styles.hideLabel,
  );

  const { formatMessage } = useIntl();

  return link ? (
    <Link
      onClick={(event) => disabled && event.preventDefault()}
      id={id}
      className={classes}
      to={link}
      state={state}
      replace={replace}
      aria-label={ariaLabel && formatMessage({ id: ariaLabel })}
    >
      {Icon && <Icon />}
      {children}
      {label && (
        <span className={styles.label}>
          <FormattedMessage id={label} />
        </span>
      )}
    </Link>
  ) : (
    <button
      disabled={disabled}
      className={classes}
      id={id}
      onClick={onClick}
      aria-label={ariaLabel && formatMessage({ id: ariaLabel })}
    >
      {Icon && <Icon />}
      {children}
      {label && (
        <span className={styles.label}>
          <FormattedMessage id={label} />
        </span>
      )}
    </button>
  );
};

export default Button;
