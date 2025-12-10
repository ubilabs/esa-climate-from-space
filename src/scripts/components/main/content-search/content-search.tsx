import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useSearch } from "../../../hooks/use-search";
import SeachResult from "../search-result/search-result";
import { SearchIcon } from "../icons/search-icon";
import { CloseIcon } from "../icons/close-icon";

import styles from "./content-search.module.css";

enum FilterType {
  All = "all",
  Blog = "blog",
  Layer = "layer",
  Video = "video",
  Image = "image",
}

type Filter = {
  type: FilterType;
  labelId: string;
  icon: string;
};
const filters: Filter[] = [
  { type: FilterType.All, labelId: "search.allOptions", icon: "check" },
  { type: FilterType.Blog, labelId: "contentType.blog", icon: "blog" },
  { type: FilterType.Layer, labelId: "contentType.layer", icon: "layer" },
  { type: FilterType.Video, labelId: "contentType.video", icon: "video" },
  { type: FilterType.Image, labelId: "contentType.image", icon: "image" },
];

export default function ContentSearch() {
  const { search } = useSearch();
  const intl = useIntl();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.All);
  const searchResult = search(query);

  const filteredResults = searchResult.filter((result) => {
    if (activeFilter === FilterType.All) return true;
    return result.type === activeFilter;
  });

  return (
    <div className={styles.container}>
      <h3>
        <FormattedMessage id="search.title" />
      </h3>
      <div className={styles.searchInputWrapper}>
        <SearchIcon />
        <input
          type="text"
          placeholder={intl.formatMessage({ id: "search.placeholder" })}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={intl.formatMessage({ id: "search.placeholder" })}
        />
        {query && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => setQuery("")}
            aria-label={intl.formatMessage({ id: "search.clear" })}
          >
            <CloseIcon />
          </button>
        )}
      </div>
      <div
        className={styles.filters}
        role="group"
        aria-label={intl.formatMessage({ id: "search.filtersLabel" })}
      >
        {filters.map(({ type, labelId: label, icon }) => (
          <button
            key={type}
            className={`${styles.filterChip} ${activeFilter === type ? styles.active : ""}`}
            onClick={() => setActiveFilter(type)}
            {...(icon ? { "data-icon": icon } : {})}
            aria-pressed={activeFilter === type}
            aria-label={intl.formatMessage({ id: label })}
          >
            <FormattedMessage id={label} />
          </button>
        ))}
      </div>

      {query && (
        <div className={styles.resultsCount} role="status" aria-live="polite">
          <FormattedMessage
            id="search.resultsCount"
            values={{ count: filteredResults.length, query }}
          />
        </div>
      )}

      {filteredResults.length > 0 && (
        <ul
          className={styles.results}
          aria-label={intl.formatMessage({ id: "search.resultsLabel" })}
        >
          {filteredResults.map((result) => (
            <SeachResult
              key={`${result.type}-${result.item.id}`}
              result={result}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
