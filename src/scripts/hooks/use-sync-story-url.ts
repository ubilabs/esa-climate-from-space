import { useEffect, useRef } from "react";
import { useMatomo } from "@streamr/matomo-tracker-react";
import { useStory } from "../providers/story/use-story";
import { getUpdatedStoryUrl } from "../libs/get-updated-story-url";
import { useLocation, useNavigationType } from "react-router-dom";
import { extractSlideIndex } from "../libs/content-url-parameter";
import { getHashPathName } from "../libs/get-hash-path";
import { getCssVarPx } from "../libs/get-css-var-in-px";
import { useAppRouteFlags } from "./use-app-route-flags";

export const useSyncStoryUrl = () => {
  const { getScrollAnchorRefsMap, storyElementRef, story, lenisRef } =
    useStory();

  const { isStoryEEI } = useAppRouteFlags();
  const { trackPageView } = useMatomo();
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
      const lengthfactor = story.modules
        .slice(0, initialSlideIndex - 1)
        .reduce((sum, current) => {
          return (
            sum + (("lengthFactor" in current ? current.lengthFactor : 0) ?? 0)
          );
        }, story.splashscreen.lengthFactor ?? 1);

      lenisRef.current.scrollTo(
        (isStoryEEI ? lengthfactor : initialSlideIndex) *
          (window.innerHeight - headerHeight),
        {
          force: true,
          onComplete: () => {
            console.log(
              "starting initial",
              (isStoryEEI ? lengthfactor : initialSlideIndex) *
                (window.innerHeight - headerHeight),
            );
            isInitialScrollPerformed.current = true;
          },
        },
      );
    }
  }, [storyElementRef, story, lenisRef, initialSlideIndex, isStoryEEI]);

  // Effect for when the url is changed by the user
  useEffect(() => {
    const index = extractSlideIndex(location.pathname);

    if (story) {
      const lengthfactor = story.modules
        .slice(0, index - 1)
        .reduce((sum, current) => {
          return (
            sum + (("lengthFactor" in current ? current.lengthFactor : 0) ?? 0)
          );
        }, story.splashscreen.lengthFactor ?? 1);

      const headerHeight = getCssVarPx("--header-height");

      if (
        navigationType !== "PUSH" &&
        isInitialScrollPerformed.current &&
        index >= 0
      ) {
        lenisRef.current?.scrollTo(
          (isStoryEEI ? lengthfactor : index) *
            (window.innerHeight - headerHeight),
          {
            force: true,
            onStart: () => {
              isProgrammaticScroll.current = true;
            },
            onComplete: () => {
              isProgrammaticScroll.current = false;
            },
          },
        );
      }
    }
  }, [
    location,
    navigationType,
    lenisRef,
    story,
    initialSlideIndex,
    isStoryEEI,
  ]);

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
        const storyUrl = getUpdatedStoryUrl(location.pathname, idx);
        // Keeping the URL parameters intact is crucial to prevent the <UrlSync> useEffect
        // from being triggered redundantly, which can cause the URL to update again.
        if (storyUrl !== location.pathname) {
          // Track page view on URL change
          trackPageView({
            href: storyUrl,
          });
        }
        // Directly using window.history.pushState for updating the URL
        // This approach is chosen to avoid triggering a re-render
        // The URL update here is solely for sharing purposes and does not involve state management
        window.history.pushState(null, "", `#${storyUrl}`);
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
    trackPageView,
  ]);
};
