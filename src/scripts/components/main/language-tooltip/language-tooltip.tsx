import { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

import Button from "../button/button";
import { ChangeLanguageIcon } from "../icons/change-language-icon";

import styles from "./language-tooltip.module.css";

interface Props {
  onClose: () => void;
  onMenuOpen: () => void;
}

const LanguageTooltip: FunctionComponent<Props> = ({ onClose, onMenuOpen }) => (
  <div className={styles.languageTooltip}>
    <div className={styles.detectedLanguage}>
      <ChangeLanguageIcon />
      <p className={styles.language}>
        <FormattedMessage id={"detectedLanguage"} />
      </p>
    </div>
    <div className={styles.buttons}>
      <Button
        className={styles.changeLanguage}
        label="changeLanguage"
        onClick={() => onMenuOpen()}
      />
      <Button
        className={styles.keepLanguage}
        label="keepLanguage"
        onClick={() => onClose()}
      />
    </div>
  </div>
);

export default LanguageTooltip;
