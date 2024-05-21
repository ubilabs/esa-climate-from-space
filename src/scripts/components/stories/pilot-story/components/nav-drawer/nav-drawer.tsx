import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';

import cx from 'classnames';

import {Drawer} from 'vaul';

import {useScreenSize} from '../../../../../hooks/use-screen-size';

import {getSnapPoint} from '../utils/nav-drawer';
import DrawerToggleIcon from '../icons/drawer-toggle-icon/drawer-toggle-icons';

import styles from './nav-drawer.module.styl';
import {GlobeIcon} from '../../../../main/icons/globe-icon';
import {chapters} from '../../config/main';
import Button from '../button/button';
import {GlobeExploreIcon} from '../icons/globe-explore-icon';
import NavChapterOverview from '../nav-chapter-overview/nav-chapter-overview';

/**
 * NavDrawer component.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {ReactNode} props.children - The children elements.
 * @param {ReactElement} props.handle - The handle element.
 * @returns {ReactElement} The rendered NavDrawer component.
 */
const NavDrawer: FunctionComponent = () => {
  // Title is visible in the Nav Drawer when it is not open, basically the handle
  const handle = <h2 className={styles.header}>{chapters[0].subtitle}</h2>;

  // Content is visible in the Nav Drawer when it is open
  const children = (
    <div className={styles.navContainer}>
      <NavChapterOverview chapters={chapters} />
      <Button
        link={'/stories'}
        icon={GlobeIcon}
        label="Back to Stories"
        className={styles.navLinks}
      />
      <Button
        link={'/'}
        className={styles.navLinks}
        icon={GlobeExploreIcon}
        label="explore the story datasets"
      />
    </div>
  );
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const {isMobile} = useScreenSize();

  // Snap points of the drawer refer to the positions where the drawer can be placed at.
  // Can either be a fraction between 0 and 1 or a string in px. (e.g. '50px')
  // When using px however, the height of the device is not taken into account. See https://github.com/emilkowalski/vaul
  const [snap, setSnap] = useState<number | string | null>(null);

  const {Root, Portal, Content, Title} = Drawer;

  // Get the initial snap point for the drawer based on the height of the handle element and the window height.
  const initialSnapPoint = useMemo(() => getSnapPoint(ref), [ref]);

  // Set the snap point once to initialSnapPoint is calculated.
  useEffect(() => {
    if (initialSnapPoint) {
      setSnap(initialSnapPoint);
    }
  }, [initialSnapPoint]);

  // Get the children and class name from the handle element to pass them to the title element of the drawer.
  const {children: titleChildren, className} = handle.props;

  const modalTarget = document.getElementById('drawer');

  // Refers to how far the drawer can be extended, where 1 would be fully extended to the top of the page
  const maxSnapPoint = isMobile ? 0.62 : 0.7;

  const isCollapsed = snap === initialSnapPoint;

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
      closeThreshold={0}>
      <Portal container={modalTarget}>
        {
          <Content
            className={cx(
              styles.content,
              snap === maxSnapPoint && styles.open
            )}>
            <Title
              // Set the reference to the handle element to calculate the initial snap point.
              ref={elementRef => setRef(elementRef)}
              className={cx(className, styles.title)}
              // Toggle the snap point between the initial snap point and 1 when the handle is clicked.
              onClick={() =>
                setSnap(snap === maxSnapPoint ? initialSnapPoint : maxSnapPoint)
              }>
              {isCollapsed ? titleChildren : 'Story Position'}
              <DrawerToggleIcon isCollapsed={!snap || isCollapsed} />
            </Title>
            {children}
          </Content>
        }
      </Portal>
    </Root>
  );
};

export default NavDrawer;
