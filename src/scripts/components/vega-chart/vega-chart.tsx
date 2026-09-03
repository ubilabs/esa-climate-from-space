import { FunctionComponent, useEffect, useRef, useState } from "react";
import embed, { type Result, type VisualizationSpec } from "vega-embed";

import styles from "./vega-chart.module.css";

async function loadFonts() {
  if (!document.fonts) {
    return;
  }

  try {
    await document.fonts.load("16px NotesESA");
    await document.fonts.load("18px NotesESA");
  } catch (error) {
    console.error("Error loading fonts:", error);
  }
}

type VegaEmbedProps = {
  spec: VisualizationSpec;
};

export const VegaEmbed: FunctionComponent<VegaEmbedProps> = ({ spec }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let resizeRAF = 0;
    let chartResult: Result | null = null;
    let cleanup = () => {};

    async function renderChart() {
      try {
        await loadFonts();

        const container = containerRef.current;

        if (!container || cancelled) {
          return;
        }

        const responsiveSpec = {
          ...spec,
          width: container.clientWidth,
          height: container.clientHeight,
        };

        chartResult = await embed(container, responsiveSpec, {
          actions: false,
        });

        const handleResize = () => {
          cancelAnimationFrame(resizeRAF);
          resizeRAF = requestAnimationFrame(() => {
            chartResult?.view
              .width(container.clientWidth)
              .height(container.clientHeight)
              .run();
          });
        };

        window.addEventListener("resize", handleResize);

        cleanup = () => {
          window.removeEventListener("resize", handleResize);
          cancelAnimationFrame(resizeRAF);
          chartResult?.finalize();
        };
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Could not render chart.",
          );
        }
      }
    }

    renderChart();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [spec]);

  return (
    <div
      ref={containerRef}
      className={errorMessage ? styles.error : styles.vis}
    >
      {errorMessage}
    </div>
  );
};

export const VegaChart = VegaEmbed;
