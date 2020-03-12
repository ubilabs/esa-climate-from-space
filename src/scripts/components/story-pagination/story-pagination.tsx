import React, {FunctionComponent} from 'react';

import {StoryMode} from '../../types/story-mode';

interface Props {
  mode: StoryMode;
}

const StoryPagination: FunctionComponent<Props> = ({mode}) => <div>{mode}</div>;

export default StoryPagination;
