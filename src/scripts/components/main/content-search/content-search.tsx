import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import { useSearch } from "../../../hooks/use-search";
import { useScreenSize } from "../../../hooks/use-screen-size";

import { ActiveSearchState, Filter, FilterType } from "../../../types/search";

import SearchResult from "../search-result/search-result";
import { BackButton } from "../back-button/back-button";

import { SearchIcon } from "../icons/search-icon";
import { CloseIcon } from "../icons/close-icon";

import styles from "./content-search.module.css";

const filters: Filter[] = [
  { type: FilterType.All, labelId: "search.allOptions", icon: "check" },
  { type: FilterType.Blog, labelId: "contentType.blog", icon: "blog" },
  { type: FilterType.Layer, labelId: "contentType.layer", icon: "layer" },
  { type: FilterType.Video, labelId: "contentType.video", icon: "video" },
  { type: FilterType.Image, labelId: "contentType.image", icon: "image" },
];

export default function ContentSearch() {
  const search = useSearch();
  const intl = useIntl();
  const { isDesktop } = useScreenSize();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.All);
  const searchResult = search(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredResults = searchResult.filter((result) => {
    if (activeFilter === FilterType.All) return true;
    return result.type === activeFilter;
  });

  const { state } = useLocation();

  useEffect(() => {
    // Focus input only if no active search state is provided
    if (!state?.search) {
      inputRef.current?.focus();
    }
  }, [state?.search]);

  useEffect(() => {
    if (state?.search) {
      const { query, filter } = state.search as ActiveSearchState;
      if (query) {
        setQuery(query);
      }
      if (filter) {
        setActiveFilter(filter);
      }
    }
  }, [state?.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.heading}>
        <BackButton label="back_to_overview" link="/"></BackButton>
      </header>

      <div className={styles.searchContainer}>
        {isDesktop && (
          <h3>
            <FormattedMessage id="search.title" />
          </h3>
        )}
        <div className={styles.searchInputWrapper}>
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            placeholder={intl.formatMessage({ id: "search.placeholder" })}
            value={query}
            onChange={handleInputChange}
            aria-label={intl.formatMessage({ id: "search.placeholder" })}
          />
          {query && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
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
              <SearchResult
                key={`${result.type}-${result.item.id}`}
                query={query}
                filter={activeFilter}
                result={result}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
