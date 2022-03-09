import React, {FunctionComponent, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {welcomeScreenSelector} from '../../../selectors/welcome-screen';
import WelcomeScreen from '../welcome-screen/welcome-screen';
import OnboardingTooltip from '../onboarding-tooltip/onboarding-tooltip';
import setLanguageAction from '../../../actions/set-language';
import {languageSelector} from '../../../selectors/language';

const Onboarding: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
  const language = useSelector(languageSelector);
  const welcomeScreenChecked = useSelector(welcomeScreenSelector);

  return (
    <React.Fragment>
      {!welcomeScreenChecked && (
        <WelcomeScreen
          onStartOnboarding={() => {
            dispatch(setLanguageAction(language));
            setOnboardingStep(1);
          }}
        />
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
