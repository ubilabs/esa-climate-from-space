import { useEffect, useRef } from "react";
import { useStory } from "../providers/story/use-story";
import { getUpdatedStoryUrl } from "../libs/get-updated-story-url";
import { useLocation, useNavigationType } from "react-router-dom";
import { extractSlideIndex } from "../libs/content-url-parameter";
import { getHashPathName } from "../libs/get-hash-path";
import { getCssVarPx } from "../libs/get-css-var-in-px";

export const useSyncStoryUrl = () => {
  const { getScrollAnchorRefsMap, storyElementRef, story, lenisRef } =
    useStory();
  const activeNodeKeyRef = useRef<string | null>(null);

  const initialSlideIndex = extractSlideIndex(getHashPathName());
  const isInitialScrollPerformed = useRef(Boolean(!initialSlideIndex)); // Flag to ensure initial scroll only happens once

  const isProgrammaticScroll = useRef(false);

  const location = useLocation();
  const navigationType = useNavigationType();

  // Effect for initial scroll on page load
  useEffect(() => {
    if (isInitialScrollPerformed.current || isProgrammaticScroll.current) {
      return; // Already performed initial scroll
    }

    const headerHeight = getCssVarPx("--header-height");

    if (story && lenisRef.current && initialSlideIndex > 0) {
      lenisRef.current.scrollTo(
        initialSlideIndex * (window.innerHeight - headerHeight),
        {
          force: true,
          onComplete: () => {
            isInitialScrollPerformed.current = true;
          },
        },
      );
    }
  }, [storyElementRef, story, lenisRef, initialSlideIndex]);

  // Effect for when the url is changed by the user
  useEffect(() => {
    const index = extractSlideIndex(location.pathname);
    const headerHeight = getCssVarPx("--header-height");

    if (
      navigationType !== "PUSH" &&
      isInitialScrollPerformed.current &&
      index >= 0
    ) {
      lenisRef.current?.scrollTo(index * (window.innerHeight - headerHeight), {
        onStart: () => {
          isProgrammaticScroll.current = true;
        },
        onComplete: () => {
          isProgrammaticScroll.current = false;
        },
      });
    }
  }, [location, navigationType, lenisRef]);

  // Effect for Intersection Observer to update URL on scroll
  useEffect(() => {
    const container = storyElementRef.current;
    const nodeMap = getScrollAnchorRefsMap();

    if (!container || !story || nodeMap.size === 0) return;

    // Precompute lookups once.
    const nodeToKey = new WeakMap<Element, string>();
    nodeMap.forEach((node, key) => nodeToKey.set(node, key));

    const indexByKey = new Map<string, number>();
    let i = 0;
    for (const key of nodeMap.keys()) {
      indexByKey.set(key, i++);
    }

    // Track current intersections.
    const intersecting = new Map<string, number>();

    let frameRequested = false;
    const applyMostVisible = () => {
      frameRequested = false;
      if (isProgrammaticScroll.current || intersecting.size === 0) return;

      // Find key with max intersection ratio.
      let bestKey: string | null = null;
      let bestRatio = -1;
      for (const [key, ratio] of intersecting) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestKey = key;
        }
      }
      if (!bestKey || bestKey === activeNodeKeyRef.current) return;

      activeNodeKeyRef.current = bestKey;

      const idx = indexByKey.get(bestKey);
      if (typeof idx === "number") {
        // Keeping the URL parameters intact is crucial to prevent the <UrlSync> useEffect
        // from being triggered redundantly, which can cause the URL to update again.
        const newUrl =
          getUpdatedStoryUrl(location.pathname, idx) +
          location.search +
          location.hash;
        // Directly using window.history.pushState for updating the URL
        // This approach is chosen to avoid triggering a re-render
        // The URL update here is solely for sharing purposes and does not involve state management
        window.history.pushState(null, "", `#${newUrl}`);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = nodeToKey.get(entry.target);
          if (!key) continue;

          if (entry.isIntersecting) {
            intersecting.set(key, entry.intersectionRatio);
          } else {
            intersecting.delete(key);
          }
        }

        // Batch compute/navigation to next frame.
        if (!frameRequested) {
          frameRequested = true;
          requestAnimationFrame(applyMostVisible);
        }
      },
      {
        root: container,
        // A few thresholds make ratios more stable without being noisy.
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    nodeMap.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [
    story,
    storyElementRef,
    getScrollAnchorRefsMap,
    location.pathname,
    location.search,
    location.hash,
  ]);
};
