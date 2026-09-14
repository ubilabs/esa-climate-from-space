import { useEffect, useState } from "react";

import { Legend, LegendEntry } from "../../../../../../../types/story";

import fetchAndParseCSV from "../../../../../../../libs/fetch-and-parse-csv";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";

import styles from "./legend-footer.module.css";

export default function LegendFooter({
  storyId,
  legend,
}: {
  storyId: string;
  legend: Omit<Legend, "type" | "unit">;
}) {
  const { description, entriesUrl } = legend;

  const [legendEntries, setLegendEntries] = useState<LegendEntry[]>([]);

  useEffect(() => {
    fetchAndParseCSV<LegendEntry>(getStoryAssetUrl(storyId, entriesUrl)).then(
      (data) => setLegendEntries(data),
    );
  }, [storyId, entriesUrl]);

  if (legendEntries.length === 0) {
    return null;
  }

  return (
    <div className={styles.legendFooter}>
      <p>{description}</p>

      <div
        className={styles.scale}
        role="img"
        aria-label={`Color scale from ${legendEntries[0]?.value} to ${legendEntries[legendEntries.length - 1]?.value}`}
      >
        <span>0.0</span>
        <div className={styles.colorSwatches} aria-hidden="true">
          {legendEntries.map(({ value, color }) => (
            <span
              key={value}
              className={styles.swatch}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>1.0</span>
      </div>
    </div>
  );
}
