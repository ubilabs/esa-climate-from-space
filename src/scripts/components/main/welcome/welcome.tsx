import React, {FunctionComponent, useState} from 'react';
import {useSelector} from 'react-redux';

import {welcomeScreenSelector} from '../../../selectors/welcome-screen';
import WelcomeScreen from '../welcome-screen/welcome-screen';
import OnboardingTooltip from '../onboarding-tooltip/onboarding-tooltip';

const Onboarding: FunctionComponent = () => {
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
  const showWelcomeScreen = useSelector(welcomeScreenSelector);

  return (
    <React.Fragment>
      {showWelcomeScreen && (
        <WelcomeScreen onStartOnboarding={() => setOnboardingStep(1)} />
      )}

      {onboardingStep && (
        <OnboardingTooltip
          step={onboardingStep}
          onPageChange={(step: number) => setOnboardingStep(step)}
          onClose={() => setOnboardingStep(null)}
        />
      )}
    </React.Fragment>
  );
};

export default Onboarding;
