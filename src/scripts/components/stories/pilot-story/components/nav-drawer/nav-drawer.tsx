import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';

import cx from 'classnames';

import {Drawer} from 'vaul';

import {useScreenSize} from '../../../../../hooks/use-screen-size';

import DrawerToggleIcon from '../icons/drawer-toggle-icon/drawer-toggle-icons';
import {getSnapPoint} from '../utils/nav-drawer';

import {useThunkDispatch} from '../../../../../hooks/use-thunk-dispatch';

import fetchLayerAction from '../../../../../actions/fetch-layer';
import setSelectedLayerIdsAction from '../../../../../actions/set-selected-layer-id';

import {GlobeIcon} from '../../../../main/icons/globe-icon';
import {chapters, subStory} from '../../config/main';
import {useChapter} from '../../hooks/use-chapter';
import Button from '../button/button';
import {GlobeExploreIcon} from '../icons/globe-explore-icon';
import NavPositionIcon from '../icons/nav-position-icon/nav-position-icon';
import NavChapterOverview from '../nav-chapter-overview/nav-chapter-overview';

import styles from './nav-drawer.module.styl';

/**
 * NavDrawer component.
 *
 * @returns {ReactElement} The rendered NavDrawer component.
 */
const NavDrawer: FunctionComponent = () => {
  const {selectedChapterIndex, chapterPosition, isSubChapter} = useChapter();

  const thunkDispatch = useThunkDispatch();
  const dispatch = useDispatch();

  const [titleRef, setTitleRef] = useState<HTMLDivElement | null>(null);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);

  // Snap points of the drawer refer to the positions where the drawer can be placed at.
  // Can either be a fraction between 0 and 1 or a string in px. (e.g. '50px')
  // When using px however, the height of the device is not taken into account. See https://github.com/emilkowalski/vaul
  const [snap, setSnap] = useState<number | string | null>(null);

  const {Root, Portal, Content, Title} = Drawer;

  const {isMobile} = useScreenSize();

  // Get the initial snap point for the drawer based on the height of the handle element and the window height.
  const initialSnapPoint = useMemo(() => getSnapPoint(titleRef), [titleRef]);
  const maxSnapPoint = useMemo(
    () => (isMobile ? getSnapPoint(contentRef) : 0.7),
    [contentRef, isMobile]
  );

  // Set the snap point once to initialSnapPoint is calculated.
  useEffect(() => {
    if (initialSnapPoint) {
      setSnap(initialSnapPoint);
    }
  }, [initialSnapPoint]);

  const modalTarget = document.getElementById('drawer');

  const isCollapsed = snap === initialSnapPoint;

  // Todo: Refactor to use the same data structure for chapters and subStory
  const navChapters = isSubChapter
    ? [
        {title: subStory[0].title, subtitle: subStory[0].subTitle},
        {title: 'Next Chapter', subtitle: ''}
      ]
    : chapters;

  return (
    <Root
      // Set the snap points of the drawer where to drawer can be placed at.
      snapPoints={[initialSnapPoint, maxSnapPoint]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      // We do not have an trigger outside of the drawer to open it (e.g. an open button) */
      // Instead, the drawer is - technically - always open and can only be extended and collapsed  */
      // If you want to toggle the visibility of the drawer, you can use this property */
      open={true}
      // Setting modal to false allows the user to still interact with the content behind the drawer.
      modal={false}
      onDrag={e => e.stopPropagation()}
      closeThreshold={0}>
      <Portal container={modalTarget}>
        {
          <Content
            onDragEnter={e => e.stopPropagation()}
            className={cx(
              styles.content,
              snap === maxSnapPoint && styles.open
            )}>
            <Title
              // Set the reference to the handle element to calculate the initial snap point.
              ref={titleRef => setTitleRef(titleRef)}
              className={cx(styles.title)}
              // Toggle the snap point between the initial snap point and 1 when the handle is clicked.
              onClick={() =>
                setSnap(snap === maxSnapPoint ? initialSnapPoint : maxSnapPoint)
              }>
              {isCollapsed ? (
                <span className={styles.header}>
                  {isMobile && (
                    <NavPositionIcon
                      position={chapterPosition}
                      isFirst={selectedChapterIndex === 0}
                      isSubChapter={isSubChapter}
                    />
                  )}
                  {navChapters[selectedChapterIndex] &&
                    navChapters[selectedChapterIndex].subtitle}
                </span>
              ) : (
                'Story Position'
              )}
              <DrawerToggleIcon isCollapsed={!snap || isCollapsed} />
            </Title>
            <div
              className={styles.navContainer}
              ref={contentRef => setContentRef(contentRef)}>
              <NavChapterOverview
                chapters={navChapters}
                callback={() =>
                  setSnap(
                    snap === maxSnapPoint ? initialSnapPoint : maxSnapPoint
                  )
                }
                // eslint-disable-next-line no-undefined
                gap={isSubChapter ? 84 : undefined}
                isSubchapter={isSubChapter}
              />
              <Button
                link={'/stories'}
                icon={GlobeIcon}
                label="Back to Stories"
                className={styles.navLinks}
              />
              <Button
                link="/"
                onClick={() => {
                  const layerId = 'greenhouse.xch4';
                  const isMain = true;
                  thunkDispatch(fetchLayerAction(layerId)).then(() => {
                    dispatch(setSelectedLayerIdsAction(layerId, isMain));
                  });
                }}
                className={styles.navLinks}
                icon={GlobeExploreIcon}
                label="explore the story datasets"
              />
            </div>
          </Content>
        }
      </Portal>
    </Root>
  );
};

export default NavDrawer;
