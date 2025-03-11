import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

import StoryList from "../story-list/story-list";
import Header from "../header/header";
import Share from "../../main/share/share";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import { StoryMode } from "../../../types/story-mode";

import styles from "./presentation-selector.module.css";
import Menu from "../../main/menu/menu";

const PresentationSelector: FunctionComponent = () => {
  const intl = useIntl();
  const { header } = useSelector(embedElementsSelector);

  return (
    <div className={styles.presentationSelector}>
      {header && (
        <Header
          backLink="/"
          backButtonId="backToDataMode"
          title={intl.formatMessage({ id: "presenter" })}
        >
        </Header>
      )}
      <StoryList mode={StoryMode.Present} />
    </div>
  );
};

export default PresentationSelector;
