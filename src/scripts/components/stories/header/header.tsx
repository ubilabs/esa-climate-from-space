import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import Button from "../../main/button/button";
import { ArrowBackIcon } from "../../main/icons/arrow-back-icon";
import { EsaLogoShort } from "../../main/icons/esa-logo-short";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import useIsStoriesPath from "../../../hooks/use-is-stories-path";
import { useStoryParams } from "../../../hooks/use-story-params";

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
  const { currentStoryId} = useStoryParams();
  const isStoriesPath = useIsStoriesPath();
  const { back_link, story_back_link } = useSelector(embedElementsSelector);


  const disabledEmbedLink =
    (isStoriesPath && back_link) || (currentStoryId && story_back_link);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <EsaLogoShort />
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
