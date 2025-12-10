import { useState } from "react";
import { useSearch } from "./search";

import ResultChip from "./result-chip";
import { SearchIcon } from "../icons/search-icon";

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
  label: string;
  icon: string;
};
const filters: Filter[] = [
  { type: FilterType.All, label: "All Options", icon: "check" },
  { type: FilterType.Blog, label: "Story", icon: "blog" },
  { type: FilterType.Layer, label: "Data Layer", icon: "layer" },
  { type: FilterType.Video, label: "Video", icon: "video" },
  { type: FilterType.Image, label: "Image Gallery", icon: "image" },
];

export default function ContentSearch() {
  const { search } = useSearch();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.All);
  const searchResult = search(query);

  const filteredResults = searchResult.filter((result) => {
    if (activeFilter === FilterType.All) return true;
    return result.type === activeFilter;
  });

  return (
    <div className={styles.container}>
      <h2>What are you looking for?</h2>
      <div className={styles.searchInputWrapper}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search ESA Climate from Space"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={styles.filters}>
        {filters.map(({ type, label, icon }) => (
          <button
            key={type}
            className={`${styles.filterChip} ${activeFilter === type ? styles.active : ""}`}
            onClick={() => setActiveFilter(type)}
            {...(icon ? { "data-icon": icon } : {})}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredResults.length > 0 && (
        <>
          <div className={styles.resultsCount}>
            {filteredResults.length} results for {query}
          </div>
          <ul className={styles.results}>
            {filteredResults.map((result) => (
              <ResultChip
                key={`${result.type}-${result.item.id}`}
                result={result}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
