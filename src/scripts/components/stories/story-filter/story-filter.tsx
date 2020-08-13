import React, {FunctionComponent, useState, useEffect, useRef} from 'react';
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
const scrollSpeed = 4; // pixels per frame

const StoryFilter: FunctionComponent = () => {
  const dispatch = useDispatch();
  const stories = useSelector(storyListSelector);
  const selectedTags = useSelector(selectedTagsSelector);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(false);
  const maxScroll =
    (innerRef.current?.scrollWidth || 0) - (innerRef.current?.offsetWidth || 0);

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

  // handle left side scrolling
  useEffect(() => {
    if (!scrollLeft) {
      return () => {};
    }

    const raf = {id: 0}; // keep reference to requestAniationFrame id
    const loop = () => {
      if (innerRef.current && translateValue < 0) {
        translateValue += scrollSpeed;
        innerRef.current.style.transform = `translateX(${translateValue}px)`;
        raf.id = requestAnimationFrame(loop);
      }
    };

    loop();

    return () => cancelAnimationFrame(raf.id);
  }, [scrollLeft]);

  // handle right side scrolling
  useEffect(() => {
    if (!scrollRight) {
      return () => {};
    }

    const raf = {id: 0}; // keep reference to requestAniationFrame id
    const loop = () => {
      if (innerRef.current && translateValue > maxScroll * -1) {
        translateValue -= scrollSpeed;
        innerRef.current.style.transform = `translateX(${translateValue}px)`;
        raf.id = requestAnimationFrame(loop);
      }
    };

    loop();

    return () => cancelAnimationFrame(raf.id);
  }, [scrollRight, maxScroll]);

  return (
    <div className={styles.storyFilter}>
      <div
        className={styles.arrowIcon}
        onMouseEnter={() => setScrollLeft(true)}
        onMouseLeave={() => setScrollLeft(false)}>
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
      <div
        className={styles.arrowIcon}
        onMouseEnter={() => setScrollRight(true)}
        onMouseLeave={() => setScrollRight(false)}>
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
