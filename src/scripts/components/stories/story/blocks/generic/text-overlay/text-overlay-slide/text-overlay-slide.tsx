import { FunctionComponent } from "react";

import {
  GetRefCallback,
  ImageModuleSlide,
} from "../../../../../../../types/story";

import { TextWrapper } from "../../text-container/text-wrapper";

interface Props {
  slide: ImageModuleSlide;
  storyId: string;
  getRefCallback: GetRefCallback;
  index: number;
}

export const TextOverlaySlide: FunctionComponent<Props> = ({
  index,
  slide,
  storyId,
  getRefCallback,
}) => {
  if (!slide.text) {
    console.warn(
      `TextOverlaySlide: Slide for story ${storyId} has no text, skipping rendering.`,
    );
    return null;
  }

  return (
    <>
      <TextWrapper
        text={slide.text}
        storyId={storyId}
        refProp={getRefCallback(0, index)}
      />
    </>
  );
};
