import {chapterMainElement} from '../../config/main';
import {ChapterType} from '../../types/globe';

/**
 * Represents a class that observes the navigation and handles intersection events.
 */
export class NavigationObserver {
  private observer: IntersectionObserver;
  private handleSetChapter: (index: number, type: ChapterType) => void;

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
    private setChapterType: (type: ChapterType) => void
  ) {
    this.observer = new IntersectionObserver(this.handleIntersect, {
      threshold: 1
    });
    this.handleSetChapter = (index: number, type: ChapterType) => {
      this.setSelectedChapterIndex(index);
      this.setChapterType(type);
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
      currentChapter?.el.getAttribute('data-scroll-index')
    );

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentIntroIndex = Number(
          entry.target.getAttribute('data-scroll-index')
        );

        isTitleInView = true;
      }
    });

    if (isTitleInView) {
      this.handleSetChapter(currentIntroIndex, ChapterType.INTRO);
    } else {
      this.handleSetChapter(currentChapterIndex, ChapterType.CONTENT);
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
