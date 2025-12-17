import Button from "../button/button";

import styles from "./back-button.module.css";

export const BackButton = ({
  label,
  link,
}: {
  label: string;
  link: string;
}) => <Button label={label} link={link} className={styles.backButton}></Button>;
