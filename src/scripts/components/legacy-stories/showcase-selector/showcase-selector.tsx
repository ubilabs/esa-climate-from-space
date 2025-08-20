import { FunctionComponent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl, FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import StoryList from "../story-list/story-list";
import LegacyHeader from "../legacy-header/legacy-header";
import { PlayIcon } from "../../main/icons/play-icon";
import Button from "../../main/button/button";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import { AppRoute } from "../../../types/app-routes";

import styles from "./showcase-selector.module.css";

const ShowcaseSelector: FunctionComponent = () => {
  const params = useParams<{ storyIds?: string }>();
  const navigate = useNavigate();
  const intl = useIntl();
  const storyIds = params.storyIds?.split("&");
  const selectedIds = storyIds || [];
  const { header } = useSelector(embedElementsSelector);

  const onSelectStory = (id: string) => {
    const isInList = selectedIds.includes(id);
    const newIds = isInList
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : selectedIds.concat(id);
    navigate(`/showcase/${newIds.join("&")}`, { replace: true });
  };
  const isDisabled = selectedIds.length === 0;

  return (
    <div className={styles.showcaseSelector}>
      {header && (
        <LegacyHeader
          backLink="/"
          backButtonId="backToDataMode"
          title={intl.formatMessage({ id: "showcase" })}
        >
          <FormattedMessage
            id="storiesSelected"
            values={{ numberSelected: selectedIds.length }}
          />
          <Button
            disabled={isDisabled}
            label={"play"}
            link={`/showcase/${selectedIds.join("&")}/0/0`}
            icon={PlayIcon}
          />
        </LegacyHeader>
      )}
      <StoryList
        route={AppRoute.Showcase}
        onSelectStory={(id) => onSelectStory(id)}
        selectedIds={selectedIds}
      />
    </div>
  );
};

export default ShowcaseSelector;
