import React, {FunctionComponent} from 'react';

import Button from '../../main/button/button';
import {ArrowBackIcon} from '../../main/icons/arrow-back-icon';
import {useStoryParams} from '../../../hooks/use-story-params';

import {SlideType} from '../../../types/slide-type';

import styles from './header.styl';

interface Props {
  backLink: string;
  backButtonId: string;
  title: string;
}

const Header: FunctionComponent<Props> = ({
  backLink,
  title,
  backButtonId,
  children
}) => {
  const {selectedStory, slideIndex} = useStoryParams();

  const isSplashScreen =
    selectedStory?.slides[slideIndex].type === SlideType.Splashscreen;

  return (
    <div className={styles.header}>
      <Button
        className={styles.backButton}
        icon={ArrowBackIcon}
        label={backButtonId}
        link={backLink}
      />
      {!isSplashScreen && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.rightContent}>{children}</div>
    </div>
  );
};

export default Header;
