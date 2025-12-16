import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setSelectedLayerIds } from "../../../reducers/layers";
import type { SearchResult } from "../../../hooks/use-search";

import styles from "./search-result.module.css";

/**
 * Highlights matched substrings in the given text.
 * @param text The full text to display.
 * @param indices Array of [start, end] pairs for matches.
 * @returns React nodes with matches wrapped in a span.
 */
function highlightMatches(
  text: string,
  indices: readonly [number, number][],
): React.ReactNode {
  if (!indices?.length) return text;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  (Array.from(indices) as [number, number][])
    .sort((a: [number, number], b: [number, number]) => a[0] - b[0])
    .forEach(([start, end]: [number, number], i: number) => {
      if (start > lastIndex) parts.push(text.slice(lastIndex, start));
      parts.push(
        <span key={i} className={styles.highlight}>
          {text.slice(start, end + 1)}
        </span>,
      );
      lastIndex = end + 1;
    });

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

/**
 * Extracts display text and highlight indices from the first match in a search result.
 * Shows up to 50 characters before and after the match, with ellipsis if truncated.
 * @param result The search result object.
 * @returns An object containing displayText and displayIndices.
 */
function getDisplayMatch(result: SearchResult): {
  displayText: string;
  displayIndices: readonly [number, number][];
} {
  const firstMatch = result.matches?.[0];
  let displayText = "";
  let displayIndices: readonly [number, number][] = [];

  if (firstMatch?.indices?.length) {
    const text = firstMatch.value || "";
    const [matchStart, matchEnd] = firstMatch.indices[0];

    // Show up to 50 chars before/after match
    const contextStart = Math.max(0, matchStart - 50);
    const contextEnd = Math.min(text.length, matchEnd + 51);

    displayText = text.slice(contextStart, contextEnd);
    displayIndices = [[matchStart - contextStart, matchEnd - contextStart]];

    if (contextStart > 0) {
      displayText = "..." + displayText;
      displayIndices = [[displayIndices[0][0] + 3, displayIndices[0][1] + 3]];
    }
    if (contextEnd < text.length) {
      displayText += "...";
    }
  }

  return { displayText, displayIndices };
}

export default function SearchResult({
  query,
  result,
}: {
  query: string;
  result: SearchResult;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();

  const { displayText, displayIndices } = getDisplayMatch(result);

  const item = result.item;
  const category = item.categories?.[0];
  const id = item.id;

  const handleResultSelect = () => {
    if (!category || !id) {
      return;
    }

    // Persist search query in navigation state for back navigation
    navigate("/search", { state: { query } });

    if (result.type === "layer") {
      dispatch(setSelectedLayerIds({ layerId: id, isPrimary: true }));
      // Ensure navigation always happens after dispatch
      setTimeout(() => {
        navigate(`/${category}/data`, { state: { query } });
      }, 0);
    } else {
      navigate(`/${category}/stories/${id}/0`, {
        state: { query },
      });
    }
  };

  const title = "title" in item ? item.title : item.name;
  const resultTypeLabel = intl.formatMessage({
    id: `contentType.${result.type}`,
  });
  const ariaLabel = `${title}, ${resultTypeLabel}${item.categories ? `, ${item.categories.map((cat: string) => intl.formatMessage({ id: `categories.${cat}` })).join(", ")}` : ""}`;

  return (
    <li className={styles.container}>
      <button
        className={styles.button}
        onClick={handleResultSelect}
        aria-label={ariaLabel}
      >
        <strong>{title}</strong>
        {displayText && (
          <div className={styles.matches}>
            <div className={styles.matchItem}>
              {highlightMatches(displayText, displayIndices)}
            </div>
            <div className={styles.meta}>
              <span className={styles.type} data-content-type={result.type}>
                <FormattedMessage id={`contentType.${result.type}`} />
              </span>
              {item.categories?.map((category: string) => (
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
