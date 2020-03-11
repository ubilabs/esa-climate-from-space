import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import rootReducer from '../../reducers/index';
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

import Story from '../story/story';
import StoriesSelector from '../stories-selector/stories-selector';
import PresentationSelector from '../presentation-selector/presentation-selector';
import ShowcaseSelector from '../showcase-selector/showcase-selector';
import Globes from '../globes/globes';
import {isElectron, connectToStore} from '../../libs/electron/index';

import translations from '../../i18n';

import styles from './app.styl';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, createLogger({collapsed: true}))
);

// connect electron messages to redux store
if (isElectron()) {
  connectToStore(store.dispatch);
}

const App: FunctionComponent = () => (
  <StoreProvider store={store}>
    <TranslatedApp />
  </StoreProvider>
);

const TranslatedApp: FunctionComponent = () => {
  const language = useSelector(languageSelector);

  return (
    <Router>
      <IntlProvider locale={language} messages={translations[language]}>
        <Route
          path={[
            '/stories/:storyId/:slideIndex',
            '/present/:storyId/:slideIndex',
            '/showcase/:storyIds/:storyIndex/:slideIndex'
          ]}>
          <Story />
        </Route>
        <Route
          path={['/present/:storyId', '/stories/:storyId']}
          render={props => <Redirect to={`${props.match.url}/0`} />}></Route>
        <Switch>
          <Route path="/" exact>
            <div className={styles.logo}>
              <EsaLogo />
            </div>
            <Globes />
            <Navigation />
            <GlobeNavigation />
            <TimeSlider />
            <DataSetInfo />
            <LayerSelector />
          </Route>
          <Route path="/stories" exact>
            <StoriesSelector />
          </Route>
          <Route path="/present">
            <PresentationSelector />
          </Route>
          <Route path={['/showcase/:storyIds', '/showcase']}>
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
