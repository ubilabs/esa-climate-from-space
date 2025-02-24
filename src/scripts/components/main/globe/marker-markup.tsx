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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="5" stroke="#00B398"   className={styles.outer} />
      <circle cx="12" cy="12" r="2" fill="#00B398" />
    </svg>
  );
};
