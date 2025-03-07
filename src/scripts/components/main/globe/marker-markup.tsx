import { FunctionComponent } from "react";

import styles from './globe.module.css';

interface Props {
  title: string;
}
// This is rendered to markup using React.renderToStaticMarkup
// So make sure not to use any state or hooks here
export const MarkerMarkup: FunctionComponent<Props> = ({ title }) => {
  return (
    <svg
      className={styles.marker}
      data-marker={title}
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
    >
      <circle cx="24" cy="24" r="10" stroke="#00B398"   className={styles.outer} />
      <circle cx="24" cy="24" r="4" fill="#00B398" />
    </svg>
  );
};
