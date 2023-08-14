/* eslint-disable camelcase */
import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';

import Button from '../../main/button/button';
import {ArrowBackIcon} from '../../main/icons/arrow-back-icon';
import {EsaLogoShort} from '../../main/icons/esa-logo-short';
import {embedElementsSelector} from '../../../selectors/embed-elements-selector';

import styles from './header.module.styl';

interface Props {
  backLink: string;
  backButtonId: string;
  title: string;
  children?: React.ReactElement | React.ReactElement[];
}

const Header: FunctionComponent<Props> = ({
  backLink,
  title,
  backButtonId,
  children
}) => {
  const {pathname} = useLocation();
  const {back_link, story_back_link} = useSelector(embedElementsSelector);
  const isStoriesPath =
    pathname === '/stories' ||
    pathname === '/showcase' ||
    pathname === '/present';
  const isStoryPath =
    pathname.startsWith('/stories/story-') ||
    pathname.startsWith('/showcase/story-') ||
    pathname.startsWith('/present/story-');
  console.log(pathname, isStoryPath);
  const disabledEmbedLink =
    (isStoriesPath && back_link) || (isStoryPath && story_back_link);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <EsaLogoShort />
      </div>
      {disabledEmbedLink && (
        <Button
          className={styles.backButton}
          icon={ArrowBackIcon}
          label={backButtonId}
          link={backLink}
          hideLabelOnMobile
        />
      )}
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.rightContent}>{children}</div>
    </div>
  );
};

export default Header;
