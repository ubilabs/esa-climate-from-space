import { ReactNode } from "react";
import InfoPopover from "../info-popover/info-popover";

import styles from "./credentials.module.css";

interface Props {
  children: ReactNode;
  description: string;
}

const Credentials = ({ children, description }: Props) => {
  return (
    <InfoPopover
      description={description}
      className={styles.container}
      contentClassName={styles.credentials}
    >
      {children}
    </InfoPopover>
  );
};

export default Credentials;
