import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { useStory } from "../../../../../providers/story/use-story";
import { TextContainer } from "../generic/text-container/text-container";
import { TextBlock } from "../generic/text-container/text-block/text-block";
import { StorySectionProps } from "../../../../../types/story";
import { useContentParams } from "../../../../../hooks/use-content-params";

export const ClosingScreen: FunctionComponent<StorySectionProps> = () => {
  const { story } = useStory();

  const { category } = useContentParams();
  const { formatMessage } = useIntl();

  if (!story) {
    return null;
  }

  const message = formatMessage({ id: "exploreMoreInCategory" }, { category });

  return (
    <div style={{ backgroundColor: "#011e2b" }}>
      <TextContainer>
        <TextBlock text={message} />
      </TextContainer>
    </div>
  );
};
