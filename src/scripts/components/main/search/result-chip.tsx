import { SearchResult } from "./search";

import styles from "./result-chip.module.css";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedContentAction } from "../../../reducers/content";
import { setSelectedLayerIds } from "../../../reducers/layers";

function highlightMatches(
  text: string,
  indices: readonly [number, number][],
): React.ReactNode {
  if (!indices || indices.length === 0) {
    return text;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Sort indices by start position
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);

  sortedIndices.forEach(([start, end], i) => {
    // Add text before the match
    if (start > lastIndex) {
      parts.push(text.substring(lastIndex, start));
    }

    // Add highlighted match
    parts.push(
      <span key={i} className={styles.highlight}>
        {text.substring(start, end + 1)}
      </span>,
    );

    lastIndex = end + 1;
  });

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

export default function ResultChip({ result }: { result: SearchResult }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the first match for display
  const firstMatch = result.matches?.[0];
  let displayText = "";
  let displayIndices: readonly [number, number][] = [];

  if (firstMatch && firstMatch.indices && firstMatch.indices.length > 0) {
    const text = firstMatch.value || "";
    const firstMatchIndices = firstMatch.indices[0];
    const matchStart = firstMatchIndices[0];
    const matchEnd = firstMatchIndices[1];

    // Get some context around the match (50 chars before and after)
    const contextStart = Math.max(0, matchStart - 50);
    const contextEnd = Math.min(text.length, matchEnd + 50);

    displayText = text.substring(contextStart, contextEnd);

    // Adjust indices relative to the new substring
    displayIndices = [[matchStart - contextStart, matchEnd - contextStart]];

    // Add ellipsis if we cut off text
    if (contextStart > 0) {
      displayText = "..." + displayText;
      displayIndices = displayIndices.map(
        ([s, e]) => [s + 3, e + 3] as [number, number],
      );
    }
    if (contextEnd < text.length) {
      displayText = displayText + "...";
    }
  }

  const category = result.item.categories?.[0];
  const id = result.item.id;

  const handleResultSelect = () => {
    if (!category || !id) {
      return;
    }
    if (result.type === "layer") {
      dispatch(setSelectedLayerIds({ layerId: id, isPrimary: true }));
      navigate(`/${category}/data`);
    } else {
      navigate(`/${category}/stories/${id}/0`);
    }
  };

  return (
    <li className={styles.container}>
      <button
        className={styles.button}
        onClick={handleResultSelect}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleResultSelect();
          }
        }}
      >
        <strong>{result.item.title || result.item.name}</strong>
        {displayText && (
          <div className={styles.matches}>
            <div className={styles.matchItem}>
              {highlightMatches(displayText, displayIndices)}
            </div>
            <div className={styles.meta}>
              <span className={styles.type} data-content-type={result.type}>
                {result.type}
              </span>
              {result.item.categories?.map((category: string) => (
                <span key={category} className={styles.type}>
                  <FormattedMessage id={`categories.${category}`} />
                </span>
              ))}
            </div>
          </div>
        )}
      </button>
    </li>
  );
}
