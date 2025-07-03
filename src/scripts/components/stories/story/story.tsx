import React, { FunctionComponent } from 'react';
import { ImageGallery } from './blocks/image-gallery/image-gallery';
import TextBlock from './blocks/text-block/text-block';

type StoryExtraProps = {
  ImageGallery?: typeof ImageGallery;
  TextBlock?: typeof TextBlock;
};

const Story: FunctionComponent<{ children?: React.ReactNode }> & StoryExtraProps = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

Story.ImageGallery = ImageGallery;
Story.TextBlock = TextBlock;

export default Story;

