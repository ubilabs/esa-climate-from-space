import { FunctionComponent, useEffect, useMemo, useState } from "react";

import { VegaEmbed } from "react-vega";
import type { VisualizationSpec } from "vega-embed";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { MediaSlideContainer } from "../../../../../layout/media-slide-container/media-slide-container";
import {
  ChartsModule,
  StorySectionProps,
} from "../../../../../../../types/story";

import styles from "./story-chart.module.css";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";

const StoryVegaChart: FunctionComponent<{ spec: VisualizationSpec }> = ({
  spec,
}) => {
  // Story data is immutable, while Vega adds internal metadata to its spec.
  const mutableSpec = useMemo(
    () => ({
      ...structuredClone(spec),
      width: "container" as const,
      height: "container" as const,
      autosize: {
        type: "fit" as const,
        contains: "padding" as const,
        resize: true,
      },
    }),
    [spec],
  );

  return (
    <VegaEmbed
      className={styles.chartEmbed}
      spec={mutableSpec as VisualizationSpec}
      options={{ actions: false }}
    />
  );
};

const StoryChart: FunctionComponent<StorySectionProps> = () => {
  const {
    module: { slides },
    storyId,
    getRefCallback,
  } = useModuleContent<ChartsModule>();

  const [chartSpecs, setChartSpecs] = useState<
    Record<string, VisualizationSpec>
  >({});

  useEffect(() => {
    const abortController = new AbortController();

    Promise.all(
      (slides ?? []).map(async ({ url }) => {
        if (!url) {
          return undefined;
        }

        const response = await fetch(getStoryAssetUrl(storyId, url), {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Could not load chart specification: ${response.status} ${response.statusText}`,
          );
        }

        return [url, (await response.json()) as VisualizationSpec] as const;
      }),
    )
      .then((entries) => {
        setChartSpecs(
          Object.fromEntries(
            entries.filter(
              (entry): entry is readonly [string, VisualizationSpec] => !!entry,
            ),
          ),
        );
      })
      .catch((error: unknown) => {
        if (!abortController.signal.aborted) {
          console.error(error);
        }
      });

    return () => abortController.abort();
  }, [slides, storyId]);

  return (
    <div className={styles.storyChart}>
      {slides?.map(
        // Set leading as default so chart appears on the left / on top
        ({ url, text, caption, leading = true }, index) => (
          <MediaSlideContainer
            ref={getRefCallback?.(index, 0)}
            key={url || index}
            leading={leading}
            text={text}
            caption={caption}
            storyId={storyId}
          >
            {url && chartSpecs[url] && (
              <StoryVegaChart spec={chartSpecs[url]} />
            )}
          </MediaSlideContainer>
        ),
      )}
    </div>
  );
};

export default StoryChart;
