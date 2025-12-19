import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation, useSearchParams } from "react-router-dom";

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
  const intl = useIntl();
  const { isDesktop } = useScreenSize();
  const { state } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const inputQuery = searchParams.get("searchQuery") || "";

  const search = useSearch();

  console.log("🚀 ~ content-search.tsx:31 → inputQuery:", inputQuery);

  const setInputQuery = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("searchQuery", value);
    } else {
      newParams.delete("searchQuery");
    }
    setSearchParams(newParams, { replace: true });
  };

  // const [inputQuery, setInputQuery] = useState("");
  const searchResult = search(inputQuery);

  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.All);

  const filteredResults = searchResult.filter((result) => {
    if (activeFilter === FilterType.All) return true;
    return result.type === activeFilter;
  });

  useEffect(() => {
    if (state?.search && typeof state.search === "object") {
      const { query, filter } = state.search as ActiveSearchState;
      if (query && query !== inputQuery) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("searchQuery", query);
        setSearchParams(newParams, { replace: true });
      }
      if (filter) {
        setActiveFilter(filter);
      }
    }
  }, [state?.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(e.target.value);
  };

  const handleClear = () => {
    setInputQuery("");
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
            value={inputQuery}
            onChange={handleInputChange}
            aria-label={intl.formatMessage({ id: "search.placeholder" })}
          />
          {inputQuery && (
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

        {inputQuery && (
          <div className={styles.resultsCount} role="status" aria-live="polite">
            <FormattedMessage
              id="search.resultsCount"
              values={{ count: filteredResults.length, query: inputQuery }}
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
                query={inputQuery}
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
