import { FunctionComponent, useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Trigger dialog visibility upon initial rendering
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
    }
  }, []);

  const classes = cx(styles.overlay, className);

  return (
    <dialog ref={dialogRef} className={classes} onClose={onClose}>
      {showCloseButton && (
        <Button
          icon={CloseIcon}
          className={styles.closeButton}
          onClick={() => dialogRef.current?.close()}
        />
      )}
      <div className={styles.overlayContent} onWheel={(e) => e.stopPropagation()}>{children}</div>
    </dialog>
  );
};

export default Overlay;
