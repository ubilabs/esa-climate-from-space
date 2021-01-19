import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {useDispatch} from 'react-redux';

import setSelectedStoryTagsAction from '../../../actions/set-selected-story-tags';
import {CheckIcon} from '../../main/icons/check-icon';

import styles from './tags-bubble.styl';

interface Props {
  selectedTags: string[];
}

const TagsBubble: FunctionComponent<Props> = ({selectedTags}) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.tagsBubble}>
      {selectedTags.map(tag => (
        <div key={tag} className={styles.tag}>
          <CheckIcon />
          <FormattedMessage id={`tags.${tag}`} />
        </div>
      ))}
      <button
        className={styles.resetFilters}
        onClick={() => dispatch(setSelectedStoryTagsAction([]))}>
        <FormattedMessage id={'resetFilters'} />
      </button>
    </div>
  );
};

export default TagsBubble;
