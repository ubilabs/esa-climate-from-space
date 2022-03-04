import React, {FunctionComponent, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import cx from 'classnames';

import Button from '../button/button';
import {CloseIcon} from '../icons/close-icon';

import styles from './onboarding.styl';

interface Props {
  id: number;
  onPageChange: (id: number) => void;
  onClose: () => void;
}

const Onboarding: FunctionComponent<Props> = ({id, onPageChange, onClose}) => {
  const intl = useIntl();

  const onboardingContent = [
    {
      id: 1,
      content: intl.formatMessage({id: 'tooltip-stories'}),
      elementId: 'stories'
    },
    {
      id: 2,
      content: intl.formatMessage({id: 'tooltip-layers'}),
      elementId: 'layers'
    },
    {
      id: 3,
      content: intl.formatMessage({id: 'tooltip-share'}),

      elementId: 'share'
    },
    {
      id: 4,
      content: intl.formatMessage({id: 'tooltip-menu'}),
      elementId: 'menu'
    },
    {
      id: 5,
      content: intl.formatMessage({id: 'tooltip-projection'}),
      elementId: 'projection'
    },
    {
      id: 6,
      content: intl.formatMessage({id: 'tooltip-compass'}),
      elementId: 'compass'
    },
    {
      id: 7,
      content: intl.formatMessage({id: 'tooltip-download'}),
      elementId: 'download'
    }
  ];
  const currentOnboarding = onboardingContent.find(
    content => content.id === id
  );

  const referenceElement = document.querySelector(
    `#${currentOnboarding?.elementId}`
  );

  const [referencePosition, setReferencePosition] = useState<DOMRect | null>(
    null
  );

  // set position of onboarding tooltip
  useEffect(() => {
    if (!referenceElement) {
      return;
    }
    setReferencePosition(referenceElement.getBoundingClientRect());
  }, [referenceElement]);

  // set new position when window size changes
  window.addEventListener(
    'resize',
    () =>
      referenceElement &&
      setReferencePosition(referenceElement.getBoundingClientRect())
  );

  if (!referencePosition) {
    return null;
  }

  const isBottomTooltip = referencePosition.top > window.innerHeight / 2;

  const onboardingClasses = cx(
    styles.onboarding,
    isBottomTooltip && styles.bottomTooltip
  );

  const onBackClick = () => {
    if (id > 1) {
      onPageChange(id - 1);
    } else {
      return;
    }
  };

  const onNextClick = () => {
    if (id <= onboardingContent.length - 1) {
      onPageChange(id + 1);
    } else {
      onClose();
    }
  };

  return (
    <div
      id="onboarding"
      style={{
        top: `${referencePosition.y}px`,
        left: `${referencePosition.x}px`
      }}
      className={onboardingClasses}>
      <div className={styles.content}>
        <span>{currentOnboarding?.content}</span>
        <Button
          icon={CloseIcon}
          className={styles.closeButton}
          onClick={() => onClose()}
        />
      </div>
      {currentOnboarding && (
        <div className={styles.navigation}>
          <Button
            label="back"
            className={styles.navigationButton}
            onClick={() => onBackClick()}
          />
          <span>{`${id} / ${onboardingContent.length}`}</span>
          <Button
            label="next"
            className={styles.navigationButton}
            onClick={() => onNextClick()}
          />
        </div>
      )}
    </div>
  );
};

export default Onboarding;
