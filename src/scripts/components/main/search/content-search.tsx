import { useState } from "react";
import { useSearch } from "./search";

import ResultChip from "./result-chip";
import { SearchIcon } from "../icons/search-icon";

import styles from "./content-search.module.css";

export default function ContentSearch() {
  const { search } = useSearch();
  const [query, setQuery] = useState("");
  const searchResult = search(query);

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
      {/* Results are now rendered below the input */}
      {searchResult.length > 0 && (
        <ul className={styles.results}>
          {searchResult.map((result) => (
            <ResultChip
              key={`${result.type}-${result.item.id}`}
              result={result}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
