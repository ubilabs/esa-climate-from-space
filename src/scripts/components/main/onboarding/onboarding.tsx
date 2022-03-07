import React, {FunctionComponent, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import cx from 'classnames';

import Button from '../button/button';
import {CloseIcon} from '../icons/close-icon';

import styles from './onboarding.styl';

interface Props {
  step: number;
  onPageChange: (step: number) => void;
  onClose: () => void;
}

const Onboarding: FunctionComponent<Props> = ({
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
  const referenceElement = document.querySelector(`#${currentStep.elementId}`);

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

    return () => window.removeEventListener('resize', setPosition);
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
    <div
      id="onboarding"
      style={{
        top: `${referencePosition.y}px`,
        left: `${referencePosition.x}px`
      }}
      className={onboardingClasses}>
      <div className={styles.content}>
        <span>{currentStep.content}</span>
        <Button
          icon={CloseIcon}
          className={styles.closeButton}
          onClick={() => onClose()}
        />
      </div>
      {currentStep && (
        <div className={styles.navigation}>
          <Button
            label="back"
            className={styles.navigationButton}
            onClick={() => onBackClick()}
          />
          <span>{`${step} / ${onboardingContent.length}`}</span>
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
