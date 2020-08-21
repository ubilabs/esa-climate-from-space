import React, {FunctionComponent, useRef} from 'react';
import {FormattedMessage} from 'react-intl';
import {useSelector, useDispatch} from 'react-redux';
import cx from 'classnames';
import {ArrowLeftIcon} from '../../main/icons/arrow-left-icon';
import {ArrowRightIcon} from '../../main/icons/arrow-right-icon';
import {CheckIcon} from '../../main/icons/check-icon';

import {storyListSelector} from '../../../selectors/story/list';
import {selectedTagsSelector} from '../../../selectors/story/selected-tags';
import setSelectedStoryTags from '../../../actions/set-selected-story-tags';

import styles from './story-filter.styl';

let translateValue = 0;
const scrollSpeed = 50; // pixels per frame

const StoryFilter: FunctionComponent = () => {
  const dispatch = useDispatch();
  const stories = useSelector(storyListSelector);
  const selectedTags = useSelector(selectedTagsSelector);
  const innerRef = useRef<HTMLDivElement>(null);
  const getMaxScroll = () => {
    // @ts-ignore
    return innerRef.current.scrollWidth - innerRef.current?.clientWidth + 50;
  };

  const allTags: string[] = stories
    .map(({tags}) => tags)
    .filter(Boolean)
    // @ts-ignore Array.flat()
    .flat();
  const uniqTags = Array.from(new Set(allTags));
  const isSelected = (tag: string) => selectedTags.includes(tag);
  const getTagClasses = (tag: string) =>
    cx(styles.tag, isSelected(tag) && styles.selected);

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(oldTag => oldTag !== tag)
      : selectedTags.concat([tag]);

    dispatch(setSelectedStoryTags(newTags));
  };
  const resetTags = () => dispatch(setSelectedStoryTags([]));

  const leftClick = () => {
    if (innerRef.current && translateValue < 0) {
      translateValue += scrollSpeed;
      innerRef.current.style.transform = `translateX(${translateValue +
        scrollSpeed}px)`;
    }
  };

  const rightClick = () => {
    if (innerRef.current) {
      const maxScroll = innerRef.current && getMaxScroll();
      if (translateValue >= maxScroll * -1) {
        translateValue -= scrollSpeed;
        innerRef.current.style.transform = `translateX(${translateValue +
          scrollSpeed}px)`;
      }
    }
  };

  return (
    <div className={styles.storyFilter}>
      <div className={styles.arrowIcon} onClick={() => leftClick()}>
        <ArrowLeftIcon />
      </div>
      <div className={styles.tagScrollerOuter}>
        <div className={styles.tagScrollerInner} ref={innerRef}>
          {uniqTags.map(tag => (
            <div
              className={getTagClasses(tag)}
              onClick={() => toggleTag(tag)}
              key={tag}>
              {isSelected(tag) && <CheckIcon />}
              <FormattedMessage id={`tags.${tag}`} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.arrowIcon} onClick={() => rightClick()}>
        <ArrowRightIcon />
      </div>
      <button
        disabled={selectedTags.length === 0}
        className={styles.resetButton}
        onClick={resetTags}>
        <FormattedMessage id="resetFilters" />
      </button>
    </div>
  );
};

export default StoryFilter;
