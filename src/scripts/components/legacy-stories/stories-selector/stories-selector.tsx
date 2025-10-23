import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import StoryList from "../story-list/story-list";
import StoryFilter from "../story-filter/story-filter";
import LegacyHeader from "../legacy-header/legacy-header";
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
        <LegacyHeader
          backLink="/"
          backButtonId="backToDataMode"
          title={intl.formatMessage({ id: "storyMode" })}
        >
          <Share />
        </LegacyHeader>
      )}
      <StoryFilter />
      <StoryList route={AppRoute.Stories} />
    </div>
  );
};

export default StoriesSelector;
