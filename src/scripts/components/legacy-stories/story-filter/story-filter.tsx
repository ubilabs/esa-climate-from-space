import {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import { ArrowLeftIcon } from "../../main/icons/arrow-left-icon";
import { ArrowRightIcon } from "../../main/icons/arrow-right-icon";
import { CheckIcon } from "../../main/icons/check-icon";

import { selectedTagsSelector } from "../../../selectors/story/selected-tags";
import { setSelectedTags } from "../../../reducers/story";
import { useGetStoryListQuery } from "../../../services/api";
import { languageSelector } from "../../../selectors/language";

import styles from "./story-filter.module.css";

const StoryFilter: FunctionComponent = () => {
  const dispatch = useDispatch();
  const language = useSelector(languageSelector);
  const { data: stories } = useGetStoryListQuery(language);
  const selectedTags = useSelector(selectedTagsSelector);
  const [translateValue, setTranslateValue] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const scrollSpeed = 50; // pixels per frame
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateMaxScroll = () => {
      if (innerRef.current) {
        setMaxScroll(
          innerRef.current.scrollWidth - innerRef.current.clientWidth,
        );
      }
    };

    calculateMaxScroll();
  }, [stories]);

  useLayoutEffect(() => {
    const calculateMaxScroll = () => {
      if (innerRef.current) {
        setMaxScroll(
          innerRef.current.scrollWidth - innerRef.current.clientWidth,
        );
      }
    };

    window.addEventListener('resize', calculateMaxScroll);
    return () => {
      window.removeEventListener('resize', calculateMaxScroll);
    };
  }, []);

  const allTags: string[] = stories
    .map(({ tags }) => tags)
    .filter(Boolean)
    .flat();
  const uniqTags = Array.from(new Set(allTags));
  const isSelected = (tag: string) => selectedTags.includes(tag);
  const getTagClasses = (tag: string) =>
    cx(styles.tag, isSelected(tag) && styles.selected);

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((oldTag) => oldTag !== tag)
      : selectedTags.concat([tag]);

    dispatch(setSelectedTags(newTags));
  };
  const resetTags = () => dispatch(setSelectedTags([]));

  const leftClick = () => {
    if (translateValue < 0) {
      const newTranslateValue = translateValue + scrollSpeed;
      setTranslateValue(newTranslateValue);
    }
  };

  const rightClick = () => {
    if (translateValue >= maxScroll * -1) {
      const newTranslateValue = translateValue - scrollSpeed;
      setTranslateValue(newTranslateValue);
    }
  };

  return (
    <div className={styles.storyFilter}>
      <div
        className={styles.arrowIcon}
        onClick={() => leftClick()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            leftClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <ArrowLeftIcon />
      </div>
      <div className={styles.tagScrollerOuter}>
        <div
          className={styles.tagScrollerInner}
          style={{ transform: `translateX(${translateValue}px)` }}
          ref={innerRef}
        >
          {uniqTags.map((tag) => (
            <div
              className={getTagClasses(tag)}
              onClick={() => toggleTag(tag)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  toggleTag(tag);
                }
              }}
              role="button"
              tabIndex={0}
              key={tag}
            >
              {isSelected(tag) && <CheckIcon />}
              <FormattedMessage id={`tags.${tag}`} />
            </div>
          ))}
        </div>
      </div>
      <div
        className={styles.arrowIcon}
        onClick={() => rightClick()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            rightClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <ArrowRightIcon />
      </div>
      <button
        disabled={selectedTags.length === 0}
        className={styles.resetButton}
        onClick={resetTags}
      >
        <FormattedMessage id="resetFilters" />
      </button>
    </div>
  );
};

export default StoryFilter;
