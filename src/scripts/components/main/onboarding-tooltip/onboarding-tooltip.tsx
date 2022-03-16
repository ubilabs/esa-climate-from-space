import React, {FunctionComponent, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import cx from 'classnames';

import Button from '../button/button';
import {CloseIcon} from '../icons/close-icon';
import Overlay from '../overlay/overlay';

import styles from './onboarding-tooltip.styl';

interface Props {
  step: number;
  onPageChange: (step: number) => void;
  onClose: () => void;
}

const OnboardingTooltip: FunctionComponent<Props> = ({
  step,
  onPageChange,
  onClose
}) => {
  const intl = useIntl();

  const onboardingContent = [
    {
      content: intl.formatMessage({id: 'tooltip-stories'}),
      elementId: 'ui-stories'
    },
    {
      content: intl.formatMessage({id: 'tooltip-layers'}),
      elementId: 'ui-layers'
    },
    {
      content: intl.formatMessage({id: 'tooltip-share'}),
      elementId: 'ui-share'
    },
    {
      content: intl.formatMessage({id: 'tooltip-menu'}),
      elementId: 'ui-menu'
    },
    {
      content: intl.formatMessage({id: 'tooltip-projection'}),
      elementId: 'ui-projection'
    },
    {
      content: intl.formatMessage({id: 'tooltip-compass'}),
      elementId: 'ui-compass'
    },
    {
      content: intl.formatMessage({id: 'tooltip-download'}),
      elementId: 'ui-download'
    }
  ];

  const currentStep = onboardingContent[step - 1];
  const referenceElement: HTMLElement | null = document.querySelector(
    `#${currentStep.elementId}`
  );

  const [referencePosition, setReferencePosition] = useState<DOMRect | null>(
    null
  );

  // set tooltip position, reposition when window size changes
  useEffect(() => {
    if (!referenceElement) {
      return () => {};
    }

    const setPosition = () => {
      setReferencePosition(referenceElement.getBoundingClientRect());
    };
    window.addEventListener('resize', setPosition);
    setReferencePosition(referenceElement.getBoundingClientRect());

    // hightlight current ui element
    referenceElement.classList.add(styles.highlighted);

    return () => {
      // remove highlight
      referenceElement.classList.remove(styles.highlighted);

      window.removeEventListener('resize', setPosition);
    };
  }, [referenceElement]);

  if (!referencePosition) {
    return null;
  }

  const isBottomTooltip = referencePosition.top > window.innerHeight / 2;

  const onboardingClasses = cx(
    styles.onboarding,
    isBottomTooltip && styles.bottomTooltip
  );

  const onBackClick = () => {
    if (step > 1) {
      onPageChange(step - 1);
    } else {
      return;
    }
  };

  const onNextClick = () => {
    if (step <= onboardingContent.length - 1) {
      onPageChange(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <Overlay className={styles.onboardingOverlay} showCloseButton={false}>
      <div
        id="onboarding"
        style={{
          top: `${referencePosition.y}px`,
          left: `${referencePosition.x}px`
        }}
        className={onboardingClasses}>
        <Button
          icon={CloseIcon}
          className={styles.closeButton}
          onClick={() => onClose()}
        />
        <div className={styles.content}>
          <span>{currentStep.content}</span>
        </div>
        {currentStep && (
          <div className={styles.navigation}>
            <Button
              className={styles.navigationButton}
              disabled={step === 1 ? true : false}
              label="back"
              onClick={() => onBackClick()}
            />
            <span>{`${step} / ${onboardingContent.length}`}</span>
            <Button
              label={step === onboardingContent.length ? 'letsGo' : 'next'}
              className={styles.navigationButton}
              onClick={() => onNextClick()}
            />
          </div>
        )}
      </div>
    </Overlay>
  );
};

export default OnboardingTooltip;
