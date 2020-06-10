import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {useDispatch} from 'react-redux';
import cx from 'classnames';

import setSelectedStoryTags from '../../actions/set-selected-story-tags';

import styles from './story-tags.styl';

interface Props {
  tags: string[];
  selected: string[];
}

const StoryTags: FunctionComponent<Props> = ({tags, selected}) => {
  const dispatch = useDispatch();
  const toggleTag = (tag: string) => {
    const newTags = selected.includes(tag)
      ? selected.filter(oldTag => oldTag !== tag)
      : selected.concat([tag]);

    dispatch(setSelectedStoryTags(newTags));
  };
  const getTagClasses = (tag: string) =>
    cx(styles.tag, selected.includes(tag) && styles.selected);

  return (
    <div className={styles.tags}>
      {tags.map(tag => (
        <span
          className={getTagClasses(tag)}
          key={tag}
          onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
            event.preventDefault();
            event.stopPropagation();
            toggleTag(tag);
          }}>
          <FormattedMessage id={`tags.${tag}`} />
        </span>
      ))}
    </div>
  );
};

export default StoryTags;
