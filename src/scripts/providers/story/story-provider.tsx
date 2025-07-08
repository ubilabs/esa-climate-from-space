import {
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import { Story } from "../../types/story";
import { StoryContext } from "./use-story";
import { indexAttribute } from "../../components/stories/layout/block-format-layout/block-format-section";
import { useParallaxController } from "react-scroll-parallax";
import { useLocation, useNavigate } from "react-router-dom";

export interface StoryContextValue {
  story: Story | null;
  setStory: Dispatch<SetStateAction<Story | null>>;
  storyElement: HTMLDivElement | null;
  setStoryElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
  storySlideIndex: number;
  setStorySlideIndex: Dispatch<SetStateAction<number>>;
  // setStoryElementCallback: (
  //   elements: Array<HTMLDivElement> | undefined,
  //   element: HTMLDivElement | null,
  // ) => void;
  // storyRef: RefObject<HTMLDivElement | null>;
  // setStoryRef: Dispatch<SetStateAction<RefObject<HTMLDivElement | null>>>;
  // setParallaxProviderProps: Dispatch<SetStateAction<ParallaxProviderProps>>;
}

export function StoryProvider({ children }: { children: ReactNode }) {
  const [story, setStory] = useState<Story | null>(null);
  const [storyElement, setStoryElement] = useState<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialScroll = useRef(true);
  // Parse url for storySlideIndex
  function parseStorySlideIndexFromUrl() {
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    const index = parseInt(lastPart, 10);
    return isNaN(index) ? 0 : index;
  }

  const [storySlideIndex, setStorySlideIndex] = useState<number>(
    parseStorySlideIndexFromUrl(),
  );

  useLayoutEffect(() => {
    if (!storyElement || !isInitialScroll.current) return;

    const index = parseStorySlideIndexFromUrl();
    console.log("Parsed storySlideIndex from URL:", index);
    storyElement.addEventListener(
      "scroll",
      (e) => {
        setTimeout(() => {
          console.log("Story element scrolled: ", e.type);
          isInitialScroll.current = false;
        }, 1500);
      },
      { once: true },
    );

    const elementsWithIndex = storyElement.querySelectorAll("[data-index]");
    console.log("elementsWithIndex", elementsWithIndex);
    const targetElement = Array.from(elementsWithIndex).find(
      (el) => el.getAttribute("data-index") == index.toString(),
    );
    console.log("targetElement", targetElement);
    if (targetElement) {
      // Use requestAnimationFrame to ensure layout is ready
      // requestAnimationFrame(() => {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "end",
        // inline: "nearest",
      });
      console.log("Smooth-scrolled to element with index:", storySlideIndex);
      // });
    } else {
      console.warn("No element found with index:", storySlideIndex);
    }
  }, [storyElement]); // Intentionally empty: only run on initial mount

  useEffect(() => {
    if (isInitialScroll.current) {
      return;
    }
    console.log("setting slide index to", storySlideIndex);
    // keep current storySlideIndex in sync with the URL
    // replace the current URL with the new storySlideIndex but keep the current path
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/");
    if (pathParts.length > 1) {
      pathParts[pathParts.length - 1] = storySlideIndex?.toString() || "";
    }
    const newUrl = pathParts.join("/");
    console.log("newUrl path", newUrl);

    if (storySlideIndex !== null) {
      navigate(newUrl);
    }
  }, [location.pathname, navigate, storySlideIndex]);

  return (
    <StoryContext
      value={{
        story,
        setStory,
        storyElement,
        setStoryElement,
        setStorySlideIndex,
        storySlideIndex,
      }}
    >
      {children}
    </StoryContext>
  );
}
