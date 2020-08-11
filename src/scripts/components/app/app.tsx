import React, {FunctionComponent} from 'react';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import {languageSelector} from '../../selectors/language';
import UrlSync from '../url-sync/url-sync';
import LayerLoader from '../layer-loader/layer-loader';
import Init from '../init/init';
import LayerSelector from '../layer-selector/layer-selector';
import Navigation from '../navigation/navigation';
import GlobeNavigation from '../globe-navigation/globe-navigation';
import {EsaLogo} from '../icons/esa-logo';
import TimeSlider from '../time-slider/time-slider';
import DataSetInfo from '../data-set-info/data-set-info';
import {createReduxStore} from './create-redux-store';

import Story from '../story/story';
import StoriesSelector from '../stories-selector/stories-selector';
import PresentationSelector from '../presentation-selector/presentation-selector';
import ShowcaseSelector from '../showcase-selector/showcase-selector';
import Globes from '../globes/globes';

import translations from '../../i18n';

import styles from './app.styl';
import {StoriesStateSelector} from '../../selectors/story/story-state';
import {selectedLayerIdsSelector} from '../../selectors/layers/selected-ids';

// create redux store
const store = createReduxStore();

const App: FunctionComponent = () => (
  <StoreProvider store={store}>
    <TranslatedApp />
  </StoreProvider>
);

const TranslatedApp: FunctionComponent = () => {
  const language = useSelector(languageSelector);
  const selectedLayers = useSelector(selectedLayerIdsSelector);
  const stories = useSelector(StoriesStateSelector).list;
  const hideMarkers = Boolean(
    selectedLayers.mainId || selectedLayers.compareId
  );

  const storyMarkers = stories.map(story => ({
    id: story.id,
    title: story.title,
    position: story.position
  }));

  const markers = hideMarkers ? [] : storyMarkers;

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
            <Globes markers={markers} />
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
