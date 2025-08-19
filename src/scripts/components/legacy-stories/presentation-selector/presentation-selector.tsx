import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import StoryList from "../story-list/story-list";
import LegacyHeader from "../legacy-header/legacy-header";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import { AppRoute } from "../../../types/app-routes";

import styles from "./presentation-selector.module.css";

const PresentationSelector: FunctionComponent = () => {
  const intl = useIntl();
  const { header } = useSelector(embedElementsSelector);

  return (
    <div className={styles.presentationSelector}>
      {header && (
        <LegacyHeader
          backLink="/"
          backButtonId="backToDataMode"
          title={intl.formatMessage({ id: "presenter" })}
        ></LegacyHeader>
      )}
      <StoryList route={AppRoute.Present} />
    </div>
  );
};

export default PresentationSelector;
