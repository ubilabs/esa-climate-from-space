import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import Button from "../../main/button/button";
import { EsaLogo } from "../../main/icons/esa-logo";
import { ArrowBackIcon } from "../../main/icons/arrow-back-icon";

import styles from "./legacy-header.module.css";

interface Props {
  backLink: string;
  backButtonId: string;
  title: string;
  children?: React.ReactElement | React.ReactElement[];
}

// LegacyHeader component is used in the legacy stories (prior to v.2.0.0) as well as showcase- and present view section of the application.
const LegacyHeader: FunctionComponent<Props> = ({
  backLink,
  title,
  backButtonId,
  children,
}) => {
  const { back_link } = useSelector(embedElementsSelector);

  const showBackLink = Boolean(back_link);

  return (
    <div className={styles.header}>
      <EsaLogo variant="logo" />
      {showBackLink && (
        <Button
          className={styles.backButton}
          icon={ArrowBackIcon}
          label={backButtonId}
          link={backLink}
          hideLabelOnMobile
        />
      )}
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.rightContent}>{children}</div>
    </div>
  );
};

export default LegacyHeader;
