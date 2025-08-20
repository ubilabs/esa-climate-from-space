import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StoryIcon } from "../../main/icons/story-icon";

import styles from "./stories-button.module.css";

const StoriesButton: FunctionComponent = () => (
  <Link to={"/stories"} className={styles.storiesButton}>
    <button className={styles.storiesLabel}>
      <StoryIcon />
      <FormattedMessage id="stories" />
    </button>
  </Link>
);

export default StoriesButton;
