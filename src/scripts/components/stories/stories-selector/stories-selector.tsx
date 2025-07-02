import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import StoryList from "../story-list/story-list";
import StoryFilter from "../story-filter/story-filter";
import Header from "../header/header";
import Share from "../../main/share/share";
import { AppRoute } from "../../../types/app-routes";

import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import styles from "./stories-selector.module.css";

const StoriesSelector: FunctionComponent = () => {
  const intl = useIntl();
  const { header  } = useSelector(embedElementsSelector);

  return (
    <div className={styles.storiesSelector}>
      {header && (
        <Header
          backLink="/"
          backButtonId="backToDataMode"
          title={intl.formatMessage({ id: "storyMode" })}
        >
          <Share />
        </Header>
      )}
      <StoryFilter />
      <StoryList route={AppRoute.Stories} />
    </div>
  );
};

export default StoriesSelector;
