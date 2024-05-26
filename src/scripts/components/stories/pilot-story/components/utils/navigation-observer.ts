import {chapterMainElement, chapters} from '../../config/main';
import {ChapterPosition} from '../../types/globe';

/**
 * Represents a class that observes the navigation and handles intersection events.
 */
export class NavigationObserver {
  private observer: IntersectionObserver;
  private handleSetChapter: (index: number, type: ChapterPosition) => void;

  /**
   * Constructs a new instance of the NavigationObserver class.
   * @param parallaxController - The parallax controller object.
   * @param setSelectedChapterIndex - The function to set the selected chapter index.
   * @param setChapterType - The function to set the chapter type.
   */
  constructor(
    private parallaxController: {
      elements: {el: HTMLElement; isInView: boolean | null}[];
    } | null,
    private setSelectedChapterIndex: (index: number) => void,
    private setChapterType: (type: ChapterPosition) => void
  ) {
    this.observer = new IntersectionObserver(this.handleIntersect, {
      threshold: 1
    });
    this.handleSetChapter = (index: number, type: ChapterPosition) => {
      // There seems to be in issue on iOs where the index is NaN. Investigate further?
      if (Number.isNaN(index)) {
        return;
      }
      this.setSelectedChapterIndex(index);

      // Set the chapter type to intro if the current chapter is the last one
      //  We do this to avoid the intro chapter being set as content and the progress indication leaking out of the container
      this.setChapterType(
        index === chapters.length - 1 ? ChapterPosition.INTRO : type
      );
    };
  }

  private handleIntersect = (entries: IntersectionObserverEntry[]) => {
    let isTitleInView = false;
    let currentIntroIndex = 0;

    const chapterElements = this.parallaxController?.elements?.filter(
      ({el}: {el: HTMLElement}) => el.id === chapterMainElement
    );

    const currentChapter = chapterElements?.filter(({isInView}) => isInView)[0];

    const currentChapterIndex = Number(
      currentChapter?.el.getAttribute('data-scroll-index-chapter')
    );

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentIntroIndex = Number(
          entry.target.getAttribute('data-scroll-index-intro')
        );

        isTitleInView = true;
      }
    });

    if (isTitleInView) {
      this.handleSetChapter(currentIntroIndex, ChapterPosition.INTRO);
    } else {
      this.handleSetChapter(currentChapterIndex, ChapterPosition.CONTENT);
    }
  };

  /**
   * Observes the specified target element.
   * @param target - The target element to observe.
   */
  observe(target: Element) {
    this.observer.observe(target);
  }

  /**
   * Stops observing the specified target element.
   * @param target - The target element to unobserve.
   */
  unobserve(target: Element) {
    this.observer.unobserve(target);
  }
}
