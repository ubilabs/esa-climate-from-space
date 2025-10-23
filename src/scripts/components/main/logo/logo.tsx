import { FunctionComponent } from "react";

import { EsaLogo } from "../icons/esa-logo";

import styles from "./logo.module.css";

const Logo: FunctionComponent = () => (
  <div className={styles.logo}>
    <EsaLogo variant="logoWithText" />
  </div>
);

export const EsaLogoLink: FunctionComponent = () => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    style={{ zIndex: 4 }}
    href="https://climate.esa.int"
  >
    <div className="logo">
      <EsaLogo variant="logoWithText" />
    </div>
  </a>
);
export default Logo;
