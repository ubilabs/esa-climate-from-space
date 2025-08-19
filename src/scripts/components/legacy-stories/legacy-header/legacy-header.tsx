import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import Button from "../../main/button/button";
import { ArrowBackIcon } from "../../main/icons/arrow-back-icon";

import styles from "./legacy-header.module.css";
import { EsaLogo } from "../../main/icons/esa-logo";

interface Props {
  backLink: string;
  backButtonId: string;
  title: string;
  children?: React.ReactElement | React.ReactElement[];
}

// LegacyHeader component is used in the old stories and navigation (prior to v.2.0.0) section of the application.
const LegacyHeader: FunctionComponent<Props> = ({
  backLink,
  title,
  backButtonId,
  children,
}) => {
  const { back_link } = useSelector(embedElementsSelector);

  const disabledEmbedLink = Boolean(back_link);

  const appRoute = useSelector((state: any) => state.appRoute);
  console.log("appRoute", appRoute);
  return (
    <div className={styles.header}>
      <EsaLogo variant="logo" />
      {disabledEmbedLink && (
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
