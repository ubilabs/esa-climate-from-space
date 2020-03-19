import React, {FunctionComponent, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import {useDispatch} from 'react-redux';
import cx from 'classnames';

import {StoryMode} from '../../types/story-mode';
import {Slide} from '../../types/story';
import {getStoryMediaUrl} from '../../libs/get-story-media-url';
import config from '../../config/main';
import setFlyToAction from '../../actions/set-fly-to';
import setSelectedLayerIdsAction from '../../actions/set-selected-layer-id';
import setGlobeTimeAction from '../../actions/set-globe-time';

import styles from './story-content.styl';

interface Props {
  storyId: string;
  mode: StoryMode;
  slide: Slide;
}

const StoryContent: FunctionComponent<Props> = ({mode, slide, storyId}) => {
  const dispatch = useDispatch();
  const defaultView = config.globe.view;
  const source = mode === StoryMode.Stories ? slide.text : slide.shortText;
  const [main, compare] = slide.layer || [];

  // fly to position given in a slide, if none given set to default
  // set layer given by story slide
  useEffect(() => {
    if (slide.flyTo) {
      dispatch(setFlyToAction(slide.flyTo || defaultView));

      if (main) {
        dispatch(setSelectedLayerIdsAction(main.id, true));
        dispatch(setGlobeTimeAction(main.timestamp || 0));
      }

      if (compare) {
        dispatch(setSelectedLayerIdsAction(compare.id, false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, slide]);

  // clean up story on unmount
  useEffect(
    () => () => {
      dispatch(setFlyToAction(null));
      dispatch(setSelectedLayerIdsAction(null, true));
      dispatch(setSelectedLayerIdsAction(null, false));
      dispatch(setGlobeTimeAction(0));
    },
    [dispatch]
  );

  const contentClasses = cx(
    styles.content,
    mode !== StoryMode.Stories && styles.shortTextContent
  );

  const transformImageUri = (originalSrc: string) =>
    getStoryMediaUrl(storyId, originalSrc);

  return (
    <div className={contentClasses}>
      <ReactMarkdown
        source={source}
        transformImageUri={transformImageUri}
        allowedTypes={[
          'heading',
          'text',
          'paragraph',
          'break',
          'strong',
          'emphasis',
          'image',
          'imageReference',
          'list',
          'listItem'
        ]}
      />
    </div>
  );
};

export default StoryContent;
