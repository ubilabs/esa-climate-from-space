import React, {FunctionComponent} from 'react';

import ChapterProgressIndication from '../chapter-progress-indication/chapter-progress-indication';

import cx from 'classnames';

import styles from './nav-chapter-overview.module.styl';
interface Props {
  chapters: Record<'title' | 'subtitle', string>[];
  isCollapsed?: boolean;
  className?: string;
  callback?: () => void;
  gap?: number;
  isSubchapter?: boolean;
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
 * @param {Props} props - The component props.
 * @param {Chapter[]} props.chapters - The array of chapters.
 * @param {boolean} props.isCollapsed - Indicates whether the chapter overview is collapsed or not.
 * @param {string} props.className - The CSS class name for the component.
 * @returns {JSX.Element} The rendered component.
 */
const NavChapterOverview: FunctionComponent<Props> = ({
  chapters,
  isCollapsed,
  className,
  callback,
  gap,
  isSubchapter
}) => (
  <div className={cx(styles.navChapterContainer, className)}>
    <ChapterProgressIndication chapters={chapters} gap={gap} />
    {!isCollapsed && (
      <ul>
        {chapters.map(({title}, index) => (
          <li
            key={index}
            onClick={() => {
              // Todo: Refactor
              // 1.  Get rid of nested turning
              // 2. Only works because there is currently just one subchapter
              // 3. Code is duplicated in chapter-progress-indication.tsx
              scrollToChapterIndex(
                // eslint-disable-next-line no-nested-ternary
                isSubchapter ? (index === 0 ? 5 : 6) : index
              );
              callback && callback();
            }}>
            {title}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default NavChapterOverview;
