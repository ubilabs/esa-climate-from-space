import { FunctionComponent } from "react";

import { EsaLogo } from "../icons/esa-logo";

import styles from "./logo.module.css";

const Logo: FunctionComponent = () => (
  <div className={styles.logo}>
    <EsaLogo variant="logoWithText"/>
  </div>
);

export default Logo;
