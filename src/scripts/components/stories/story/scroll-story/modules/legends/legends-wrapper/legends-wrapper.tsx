import { ReactNode } from "react";
import InfoPopover from "../../info-popover/info-popover";

import cx from "classnames";

import styles from "./legends-wrapper.module.css";

interface Props {
  children: ReactNode;
  description: string;
  className?: string;
}

const LegendsWrapper = ({ children, description, className }: Props) => {
  return (
    <InfoPopover
      description={description}
      className={styles.legendContainer}
      contentClassName={cx(styles.legend, className)}
    >
      {children}
    </InfoPopover>
  );
};

export default LegendsWrapper;
