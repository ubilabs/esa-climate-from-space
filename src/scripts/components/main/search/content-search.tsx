import { useState } from "react";
import { useSearch } from "./search";

type SearchResult = {
  storyId: string | number;
  id: string | number;
  title: string;
  text?: string;
};

import styles from "./content-search.module.css";

export default function ContentSearch() {
  const { searchLayers, searchStories } = useSearch();
  const [query, setQuery] = useState("");
  const results: Record<"layers" | "stories", SearchResult[]> = {
    layers: searchLayers(query) as SearchResult[],
    stories: searchStories(query) as SearchResult[],
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search across all content..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {/* Results are now rendered below the input */}
      <div className={styles.results}>
        {results.layers.length > 0 && (
          <>
            <h3>Layers</h3>
            <ul>
              {results.layers.map((result) => (
                <li
                  className="search-result"
                  key={`layer-${result.storyId}-${result.id}`}
                >
                  <strong>{result.name}</strong>
                  {result.text && <div>{result.text}</div>}
                </li>
              ))}
            </ul>
          </>
        )}
        {results.stories.length > 0 && (
          <>
            <h3>Stories</h3>
            <ul>
              {results.stories.map((result) => (
                <li
                  className="search-result"
                  key={`story-${result.storyId}-${result.id}`}
                >
                  <strong>{result.title}</strong>
                  {result.text && <div>{result.text}</div>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
