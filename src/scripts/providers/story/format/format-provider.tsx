import { PropsWithChildren } from "react";
import { ImageGalleryFormat } from "../../../types/story";
import { FormatContext } from "./use-format";

interface FormatProviderProps extends PropsWithChildren {
  // Todo: Update this for more content types
  content: ImageGalleryFormat;
  storyId: string;
}

export const FormatProvider = ({
  children,
  content,
  storyId,
}: FormatProviderProps) => {
  return <FormatContext value={{ content, storyId }}>{children}</FormatContext>;
};
