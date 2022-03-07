import React, {FunctionComponent, useState} from 'react';
import {useSelector} from 'react-redux';
import {welcomeScreenSelector} from '../../../selectors/welcome-screen';

import OnboardingTooltip from '../onboarding/onboarding';
import Overlay from '../overlay/overlay';
import WelcomeScreen from '../welcome-screen/welcome-screen';

import styles from './welcome.styl';

const Onboarding: FunctionComponent = () => {
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
  const showWelcomeScreen = useSelector(welcomeScreenSelector);

  return (
    <React.Fragment>
      {showWelcomeScreen && (
        <Overlay className={styles.welcomeOverlay} showCloseButton={false}>
          <WelcomeScreen onStartOnboarding={() => setOnboardingStep(1)} />
        </Overlay>
      )}

      {onboardingStep && (
        <Overlay className={styles.onboardingOverlay} showCloseButton={false}>
          <OnboardingTooltip
            step={onboardingStep}
            onPageChange={(step: number) => setOnboardingStep(step)}
            onClose={() => setOnboardingStep(null)}
          />
        </Overlay>
      )}
    </React.Fragment>
  );
};

export default Onboarding;
