import { FunctionComponent, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import cx from "classnames";
import { setSelectedTags } from "../../../reducers/story";

import styles from "./story-tags.module.css";

interface Props {
  tags: string[];
  selected: string[];
}

const StoryTags: FunctionComponent<Props> = ({ tags, selected }) => {
  const dispatch = useDispatch();
  const [showAllTags, setShowAllTags] = useState(false);
  const toggleTag = (tag: string) => {
    const newTags = selected.includes(tag)
      ? selected.filter((oldTag) => oldTag !== tag)
      : selected.concat([tag]);
    dispatch(setSelectedTags(newTags));
  };
  const getTagClasses = (tag: string) =>
    cx(styles.tag, selected.includes(tag) && styles.selected);

  const sortedTags = tags
    .map((tag) => tag)
    .sort((a, b) => {
      const isSelectedA = selected.includes(a);
      const isSelectedB = selected.includes(b);

      if (isSelectedA && !isSelectedB) {
        return -1;
      }

      if (isSelectedB && !isSelectedA) {
        return 1;
      }

      return 0;
    });

  const tagCount = 3;

  return (
    <div className={styles.tags}>
      {sortedTags
        .slice(0, showAllTags ? sortedTags.length : tagCount)
        .map((tag) => (
          <span
            className={getTagClasses(tag)}
            key={tag}
            onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
              event.preventDefault();
              event.stopPropagation();
              toggleTag(tag);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                toggleTag(tag);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <FormattedMessage id={`tags.${tag}`} />
          </span>
        ))}
      {!showAllTags && sortedTags.length > tagCount && (
        <span
          className={styles.tag}
          onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
            event.preventDefault();
            event.stopPropagation();
            setShowAllTags(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              setShowAllTags(true);
            }
          }}
          role="button"
          tabIndex={0}
        >
          +{sortedTags.length - tagCount}
        </span>
      )}
    </div>
  );
};

export default StoryTags;
