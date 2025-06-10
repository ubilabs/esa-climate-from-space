import { FunctionComponent } from "react";

import styles from "./globe.module.css";
import { useScreenSize } from "../../../hooks/use-screen-size";

interface Props {
  title: string;
}
// This is rendered to markup using React.renderToStaticMarkup
// So make sure not to use any state or hooks here
export const MarkerMarkup: FunctionComponent<Props> = ({ title }) => {
  const { isDesktop } = useScreenSize();
  const markerSize = isDesktop ? 48 : 32;

  return (
    <svg
      className={styles.marker}
      data-marker={title}
      xmlns="http://www.w3.org/2000/svg"
      width={markerSize}
      height={markerSize}
      viewBox="0 0 32 32"
      fill="none"
    >
      <circle
        cx="16"
        cy="16"
        r="10"
        stroke="var(--main)"
        className={styles.outer}
      />
      <circle cx="16" cy="16" r="4" fill="var(--main)" />
    </svg>
  );
};
