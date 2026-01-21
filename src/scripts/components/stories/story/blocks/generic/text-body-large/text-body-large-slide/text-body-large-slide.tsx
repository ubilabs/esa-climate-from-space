import { FunctionComponent } from "react";

import {
  GetRefCallback,
  ImageModuleSlide,
} from "../../../../../../../types/story";

import { TextContainer } from "../../text-container/text-container";
import { TextSection } from "../../text-container/text-section/text-section";

interface Props {
  slide: ImageModuleSlide;
  storyId: string;
  getRefCallback: GetRefCallback;
  index: number;
}

export const TextBodyLargeSlide: FunctionComponent<Props> = ({
  index,
  slide,
  storyId,
  getRefCallback,
}) => {
  if (!slide.text) {
    console.warn(
      `TextBodyLargeSlide: Slide for story ${storyId} has no text, skipping rendering.`,
    );
    return null;
  }

  return (
    <>
      <TextContainer index={0}>
        <TextSection text={slide.text} refProp={getRefCallback(0, index)} />
      </TextContainer>
    </>
  );
};
