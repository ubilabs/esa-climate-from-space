import React, {FunctionComponent, useEffect} from 'react';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import {
  MatomoProvider,
  createInstance,
  useMatomo
} from '@datapunt/matomo-tracker-react';

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

import translations from '../../../i18n';
import {useStoryMarkers} from '../../../hooks/use-story-markers';

import styles from './app.styl';

// create redux store
const store = createReduxStore();

const instance = createInstance({
  urlBase: 'https://maltemodrow.matomo.cloud/',
  siteId: 1, // optional, default value: `1`
  // userId: 'UID76903202', // optional, default value: `undefined`.
  trackerUrl: 'https://maltemodrow.matomo.cloud/matomo.php', // optional, default value: `${urlBase}matomo.php`
  srcUrl: 'https://cdn.matomo.cloud/maltemodrow.matomo.cloud/matomo.js', // optional, default value: `${urlBase}matomo.js`
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  linkTracking: false // optional, default value: true
});

const App: FunctionComponent = () => (
  <MatomoProvider value={instance}>
    <StoreProvider store={store}>
      <TranslatedApp />
    </StoreProvider>
  </MatomoProvider>
);

const TranslatedApp: FunctionComponent = () => {
  const markers = useStoryMarkers();
  const language = useSelector(languageSelector);
  const {pushInstruction, trackPageView} = useMatomo();

  useEffect(() => {
    console.log('should track');

    pushInstruction('requireConsent');
    pushInstruction('requireCookieConsent');

    // setTimeout(() => {
    //   pushInstruction('rememberConsentGiven');
    //   pushInstruction('rememberCookieConsentGiven');
    // }, 10000);

    trackPageView({
      documentTitle: 'moin moin', // optional
      href: 'https://LINK.TO.PAGE' // optional
    });
  }, []);

  return (
    <Router>
      <IntlProvider locale={language} messages={translations[language]}>
        <Switch>
          <Route path="/" exact>
            <div className={styles.logo}>
              <EsaLogo />
            </div>
            <DataViewer markers={markers} backgroundColor={'#10161A'} />
            <Navigation />
            <TimeSlider />
            <DataSetInfo />
            <LayerSelector />
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
      </IntlProvider>
      <UrlSync />
      <LayerLoader />
      <Init />
    </Router>
  );
};

export default App;
