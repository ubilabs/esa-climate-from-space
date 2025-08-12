import { FunctionComponent } from "react";
import { createPortal } from "react-dom";
import cx from "classnames";

import Button from "../button/button";
import { CloseIcon } from "../icons/close-icon";

import styles from "./overlay.module.css";

interface Props {
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  children: React.ReactElement;
}

const Overlay: FunctionComponent<Props> = ({
  children,
  className = "",
  onClose,
  showCloseButton = true,
}) => {
  const modalElement = document.getElementById("modal");
  const classes = cx(styles.overlay, className);

  // stops progation when overlay is present
  // This is useful because otherwise the user would also
  // control the gesture-based navigation and interfere with the overlay
  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const Content = (
    <div
      className={classes}
      onWheel={stopPropagation}
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
      onClick={() => onClose && onClose()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          if (onClose) { onClose(); }
        }
      }}
      role="button"
      tabIndex={0}
    >
      {showCloseButton && (
        <Button
          icon={CloseIcon}
          className={styles.closeButton}
          onClick={() => onClose && onClose()}
        />
      )}
      <div className={styles.overlayContent}>{children}</div>
    </div>
  );

  if (modalElement) {
    return createPortal(Content, modalElement);
  }

  return null;
};

export default Overlay;
