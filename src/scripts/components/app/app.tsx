import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import rootReducer from '../../reducers/index';
import {languageSelector} from '../../reducers/language';
import LayerSelector from '../layer-selector/layer-selector';
import Globes from '../globes/globes';
import Menu from '../menu/menu';
import ProjectionMenu from '../projection-menu/projection-menu';
import PresentationSelector from '../presentation-selector/presentation-selector';
import ShowcaseSelector from '../showcase-selector/showcase-selector';
import StoriesSelector from '../stories-selector/stories-selector';
import StoriesButton from '../stories-button/stories-button';
import Story from '../story/story';
import UrlSync from '../url-sync/url-sync';
import LayerLoader from '../layer-loader/layer-loader';
import TimeSlider from '../time-slider/time-slider';
import Init from '../init/init';

import translations from '../../i18n';
import styles from './app.styl';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, createLogger({collapsed: true}))
);

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
        <div className={styles.app}>
          <div className={styles.layout}>
            <Switch>
              <Route path="/" exact>
                <TimeSlider />
                <StoriesButton />

                <div className={styles.nav}>
                  <Menu />
                  <div className={styles.timeslider} />
                  <ProjectionMenu />
                  <LayerSelector />
                </div>
              </Route>

              <Route path="/present">
                <PresentationSelector />
              </Route>

              <Route path="/showcase">
                <ShowcaseSelector />
              </Route>

              <Route path="/stories" exact>
                <StoriesSelector />
              </Route>

              <Route
                path="/stories/:storyId"
                exact
                render={props => (
                  <Redirect to={`${props.match.url}/0`} />
                )}></Route>
            </Switch>
          </div>

          <div className={styles.story}>
            <Globes />
            <Route path="/stories/:storyId/:page">
              <Story />
            </Route>
          </div>
        </div>
      </IntlProvider>

      <UrlSync />
      <LayerLoader />
      <Init />
    </Router>
  );
};

export default App;
