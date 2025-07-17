import { FunctionComponent, useEffect, useRef } from "react";
import { useStory } from "../providers/story/use-story";
import { getUpdatedStoryUrl } from "../libs/get-updated-story-url";
import { useLocation, useNavigate } from "react-router-dom";
import { extractSlideIndex } from "../libs/content-url-parameter";
import { getHashPathName } from "../libs/get-hash-path";

export const SyncStoryUrl: FunctionComponent = () => {
  const { getScrollableFormatsMap, storyElementRef, story } = useStory();
  const activeNodeKeyRef = useRef<string | null>(null);
  const initialScrollPerformed = useRef(false); // Flag to ensure initial scroll only happens once

  const location = useLocation();
  const navigate = useNavigate();

  // Effect for initial scroll on page load
  useEffect(() => {
    if (initialScrollPerformed.current) {
      return; // Already performed initial scroll
    }

    const nodeMap = getScrollableFormatsMap();
    const initialSlideIndex = extractSlideIndex(getHashPathName());

    // Only attempt to scroll if there's an initial index and the nodeMap is populated enough
    if (initialSlideIndex > 0 && nodeMap.size > initialSlideIndex) {
      const targetNode = Array.from(nodeMap.values())[initialSlideIndex];
      if (targetNode) {
        targetNode.scrollIntoView({ behavior: "auto", block: "start" });
        initialScrollPerformed.current = true; // Mark as performed
      }
    }
    // Dependencies: Re-run if nodeMap changes (meaning more nodes might be available)
    // or if storyElementRef changes (container is ready), or story data is available.
  }, [getScrollableFormatsMap, storyElementRef, story]);

  // Effect for Intersection Observer to update URL on scroll
  useEffect(() => {
    const container = storyElementRef.current;
    const nodeMap = getScrollableFormatsMap();

    if (!container || !story || nodeMap.size === 0) {
      return;
    }

    // Track the intersection ratio for each node's key.
    const intersectingNodeKeys = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = [...nodeMap.entries()].find(
            ([, node]) => node === entry.target,
          )?.[0];

          if (!key) return;

          if (entry.isIntersecting) {
            intersectingNodeKeys.set(key, entry.intersectionRatio);
          } else {
            intersectingNodeKeys.delete(key);
          }
        });

        if (intersectingNodeKeys.size === 0) return;

        // Find the key with the highest intersection ratio.
        const mostVisibleKey = [...intersectingNodeKeys.entries()].reduce(
          (max, entry) => (entry[1] > max[1] ? entry : max),
        )[0];

        if (mostVisibleKey && mostVisibleKey !== activeNodeKeyRef.current) {
          activeNodeKeyRef.current = mostVisibleKey;
          const index = [...nodeMap.keys()].indexOf(mostVisibleKey);
          const newUrl = getUpdatedStoryUrl(location.pathname, index);
          navigate(newUrl);
        }
      },
      {
        root: container,
        threshold: 0.1,
      },
    );

    nodeMap.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [story, storyElementRef, getScrollableFormatsMap, location, navigate]);

  return null;
};
