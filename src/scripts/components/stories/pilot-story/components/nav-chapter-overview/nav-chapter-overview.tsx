import React, {FunctionComponent} from 'react';

import ChapterProgressIndication from '../chapter-progress-indication/chapter-progress-indication';

import cx from 'classnames';

import styles from './nav-chapter-overview.module.styl';
import {useScreenSize} from '../../../../../hooks/use-screen-size';
interface Props {
  chapters: Record<'title' | 'subtitle', string>[];
  isCollapsed?: boolean;
  className?: string;
  gap?: number;
}

export const scrollToChapterIndex = (index: number) => {
  const scrollEl = document.querySelector(
    `[data-scroll-index-intro="${index}"]`
  );

  scrollEl?.scrollIntoView({behavior: 'smooth', block: 'start'});
};

/**
 * Renders the navigation chapter overview component.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.chapters - The array of chapters.
 * @param {boolean} props.isCollapsed - Indicates whether the component is collapsed or not.
 * @param {number} props.selectedChapterIndex - The index of the selected chapter.
 * @param {Function} props.setSelectedChapterIndex - The function to set the selected chapter index.
 * @param {string} [props.className] - The optional class name for the component.
 * @param {number} [props.gap=24] - The optional gap size, defaults to 24px
 * @returns {JSX.Element} The rendered component.
 */
const NavChapterOverview: FunctionComponent<Props> = ({
  chapters,
  isCollapsed,
  className
}) => {
  const {isMobile} = useScreenSize();
  return (
    <div className={cx(styles.navChapterContainer, className)}>
      <ChapterProgressIndication chapters={chapters} gap={isMobile ? 42 : 24} />
      {!isCollapsed && (
        <ul>
          {chapters.map((chapter, index) => (
            <li
              key={index}
              onClick={() => {
                scrollToChapterIndex(index);
              }}>
              {chapter.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavChapterOverview;
