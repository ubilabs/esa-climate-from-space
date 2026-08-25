import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { VegaEmbed } from "react-vega";
import type { Result, VisualizationSpec } from "vega-embed";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import { MediaSlideContainer } from "../../../../../layout/media-slide-container/media-slide-container";

import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";

import {
  ChartsModule,
  StorySectionProps,
} from "../../../../../../../types/story";

import styles from "./story-chart.module.css";

const StoryVegaChart: FunctionComponent<{ spec: VisualizationSpec }> = ({
  spec,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartResultRef = useRef<Result | null>(null);

  // Redux Toolkit freezes the story JSON in development. Vega mutates the
  // specification by attaching internal metadata such as Symbol(vega_id), so
  // passing the stored object directly throws "object is not extensible".
  const mutableSpec = useMemo(() => structuredClone(spec), [spec]);

  const resizeChart = useCallback(() => {
    const container = containerRef.current;

    if (!container || !chartResultRef.current) {
      return;
    }

    chartResultRef.current.view
      .width(container.clientWidth)
      .height(container.clientHeight)
      .run();
  }, []);

  const handleEmbed = useCallback(
    (result: Result) => {
      chartResultRef.current = result;
      resizeChart();
    },
    [resizeChart],
  );

  useEffect(() => {
    let resizeRAF = 0;
    const container = containerRef.current;

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(resizeChart);
    });

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(resizeRAF);
      chartResultRef.current = null;
    };
  }, [resizeChart]);

  return (
    <VegaEmbed
      ref={containerRef}
      className={styles.chartEmbed}
      spec={mutableSpec}
      options={{ actions: false }}
      onEmbed={handleEmbed}
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
