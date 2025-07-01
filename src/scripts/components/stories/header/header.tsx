import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import { useContentParams } from "../../../hooks/use-content-params";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import Button from "../../main/button/button";
import { ArrowBackIcon } from "../../main/icons/arrow-back-icon";

import styles from "./header.module.css";

interface Props {
  backLink: string;
  backButtonId: string;
  title: string;
  children?: React.ReactElement | React.ReactElement[];
}

const Header: FunctionComponent<Props> = ({
  backLink,
  title,
  backButtonId,
  children,
}) => {
  const { currentStoryId} = useContentParams();
  const { isStoriesRoute} = useAppRouteFlags();
  const { back_link } = useSelector(embedElementsSelector);


  const disabledEmbedLink =
    (isStoriesRoute && back_link) || (currentStoryId);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
      </div>
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

export default Header;
