import React, {FunctionComponent} from 'react';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import {languageSelector} from '../../../selectors/language';
import UrlSync from '../url-sync/url-sync';
import LayerLoader from '../../layers/layer-loader/layer-loader';
import Init from '../init/init';
import LayerSelector from '../../layers/layer-selector/layer-selector';
import Navigation from '../navigation/navigation';
import GlobeNavigation from '../globe-navigation/globe-navigation';
import {EsaLogo} from '../icons/esa-logo';
import TimeSlider from '../../layers/time-slider/time-slider';
import DataSetInfo from '../../layers/data-set-info/data-set-info';
import {createReduxStore} from './create-redux-store';

import Story from '../../stories/story/story';
import StoriesSelector from '../../stories/stories-selector/stories-selector';
import PresentationSelector from '../../stories/presentation-selector/presentation-selector';
import ShowcaseSelector from '../../stories/showcase-selector/showcase-selector';
import Globes from '../globes/globes';

import translations from '../../../i18n';

import styles from './app.styl';
import {useStoryMarkers} from '../../../hooks/use-story-markers';

// create redux store
const store = createReduxStore();

const App: FunctionComponent = () => (
  <StoreProvider store={store}>
    <TranslatedApp />
  </StoreProvider>
);

const TranslatedApp: FunctionComponent = () => {
  const language = useSelector(languageSelector);
  const markers = useStoryMarkers();

  return (
    <Router>
      <IntlProvider locale={language} messages={translations[language]}>
        <Switch>
          <Route
            path={[
              '/stories/:storyId/:slideIndex',
              '/present/:storyId/:slideIndex',
              '/showcase/:storyIds/:storyIndex/:slideIndex'
            ]}>
            <Story />
          </Route>
        </Switch>
        <Route
          path={['/present/:storyId', '/stories/:storyId']}
          render={props => <Redirect to={`${props.match.url}/0`} />}></Route>
        <Switch>
          <Route path="/" exact>
            <div className={styles.logo}>
              <EsaLogo />
            </div>
            <Globes markers={markers} backgroundColorString={'#10161A'} />
            <Navigation />
            <GlobeNavigation />
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
        </Switch>
      </IntlProvider>
      <UrlSync />
      <LayerLoader />
      <Init />
    </Router>
  );
};

export default App;
