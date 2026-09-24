import { ComponentProps, FunctionComponent } from "react";

import Overlay from "../overlay/overlay";

import styles from "./menu-overlay.module.css";

const MenuOverlay: FunctionComponent<ComponentProps<typeof Overlay>> = ({
  children,
  ...props
}) => (
  <Overlay {...props}>
    <div className={styles.menuOverlay}>
      <div className={styles.content}>{children}</div>
    </div>
  </Overlay>
);

export default MenuOverlay;
