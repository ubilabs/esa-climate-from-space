import React, {FunctionComponent, useState} from 'react';
import {Provider as StoreProvider, useDispatch, useSelector} from 'react-redux';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {MatomoProvider, createInstance} from '@datapunt/matomo-tracker-react';

import {languageSelector} from '../../../selectors/language';
import UrlSync from '../url-sync/url-sync';
import LayerLoader from '../../layers/layer-loader/layer-loader';
import Init from '../init/init';
import LayerSelector from '../../layers/layer-selector/layer-selector';
import Navigation from '../navigation/navigation';
import {EsaLogo} from '../icons/esa-logo';
import TimeSlider from '../../layers/time-slider/time-slider';
import DataSetInfo from '../../layers/data-set-info/data-set-info';
import {createReduxStore} from './create-redux-store';

import Story from '../../stories/story/story';
import StoriesSelector from '../../stories/stories-selector/stories-selector';
import PresentationSelector from '../../stories/presentation-selector/presentation-selector';
import ShowcaseSelector from '../../stories/showcase-selector/showcase-selector';
import DataViewer from '../data-viewer/data-viewer';
import Tracking from '../tracking/tracking';
import AboutProjectOverlay from '../about-project-overlay/about-project-overlay';
import WelcomeScreen from '../welcome-screen/welcome-screen';
import Overlay from '../overlay/overlay';

import translations from '../../../i18n';
import {useStoryMarkers} from '../../../hooks/use-story-markers';

import styles from './app.styl';
import {welcomeScreenSelector} from '../../../selectors/welcome-screen';
import Onboarding from '../onboarding/onboarding';
import setLanguageAction from '../../../actions/set-language';

// create redux store
const store = createReduxStore();

// create matomo tracking instance
const matomoInstance = createInstance({
  urlBase: 'https://matomo-ext.esa.int/',
  siteId: 6,
  trackerUrl: 'https://matomo-ext.esa.int/matomo.php',
  srcUrl: 'https://matomo-ext.esa.int/matomo.js'
});

const App: FunctionComponent = () => (
  <MatomoProvider value={matomoInstance}>
    <StoreProvider store={store}>
      <TranslatedApp />
    </StoreProvider>
  </MatomoProvider>
);

const TranslatedApp: FunctionComponent = () => {
  const dispatch = useDispatch();
  const markers = useStoryMarkers();
  const language = useSelector(languageSelector);
  const showWelcomeScreen = useSelector(welcomeScreenSelector);
  const [onboardingCount, setOnboardingCount] = useState<number | null>(null);

  const logo = (
    <Link to="/about">
      <div className={styles.logo}>
        <EsaLogo />
      </div>
    </Link>
  );

  return (
    <Router>
      <IntlProvider locale={language} messages={translations[language]}>
        <Switch>
          <Route path="/" exact>
            {logo}
            {showWelcomeScreen ? (
              <Overlay
                className={styles.welcomeOverlay}
                showCloseButton={false}>
                <WelcomeScreen
                  onStartOnboarding={() => {
                    dispatch(setLanguageAction(language));
                    setOnboardingCount(1);
                  }}
                />
              </Overlay>
            ) : (
              onboardingCount && (
                <Overlay
                  className={styles.onboardingOverlay}
                  showCloseButton={false}>
                  <Onboarding
                    id={onboardingCount}
                    onPageChange={id => setOnboardingCount(id)}
                    onClose={() => setOnboardingCount(null)}
                  />
                </Overlay>
              )
            )}
            <DataViewer markers={markers} backgroundColor={'#10161A'} />
            <Navigation />
            <TimeSlider />
            <DataSetInfo />
            <LayerSelector />
          </Route>
          <Route path="/about" exact>
            {logo}
            <AboutProjectOverlay />
          </Route>
          <Route path="/stories" exact>
            <StoriesSelector />
          </Route>
          <Route path="/present" exact>
            <PresentationSelector />
          </Route>
          <Route path={['/showcase/:storyIds', '/showcase']} exact>
            <ShowcaseSelector />
          </Route>
          <Route
            path={[
              '/stories/:storyId/:slideIndex',
              '/present/:storyId/:slideIndex',
              '/showcase/:storyIds/:storyIndex/:slideIndex'
            ]}
            exact>
            <Story />
          </Route>
        </Switch>
        <Tracking />
      </IntlProvider>
      <UrlSync />
      <LayerLoader />
      <Init />
    </Router>
  );
};

export default App;
