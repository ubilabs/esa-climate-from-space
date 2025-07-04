import { FunctionComponent } from "react";

import styles from "./splashscreen.module.css";
import { FormatParallexSection } from "../block-format-section/block-format-section";

export const SplashScreen: FunctionComponent = () => {
  return <FormatParallexSection className={styles.splashscreen}>THIS IS A SPLASH SCREEN</FormatParallexSection>;
};
