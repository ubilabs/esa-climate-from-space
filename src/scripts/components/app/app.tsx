import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import rootReducer from '../../reducers/index';
import {languageSelector} from '../../selectors/language';
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

import {StoryMode} from '../../types/story-mode';

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
              <Route
                path={['/layers/:mainLayerId?/:compareLayerId?', '/']}
                exact>
                <TimeSlider />
                <StoriesButton />
                <div className={styles.nav}>
                  <Menu />
                  <div className={styles.timeslider} />
                  <ProjectionMenu />
                  <LayerSelector />
                </div>
                <LayerLoader />
              </Route>

              <Route path="/present" exact>
                <PresentationSelector />
              </Route>

              <Route path={['/showcase/:storyIds', '/showcase/']} exact>
                <ShowcaseSelector />
              </Route>

              <Route path="/stories" exact>
                <StoriesSelector />
              </Route>

              <Route
                path={['/present/:storyId', '/stories/:storyId']}
                render={props => (
                  <Redirect to={`${props.match.url}/0`} />
                )}></Route>
            </Switch>
          </div>
          <div className={styles.story}>
            <Globes />
            <Route path={'/stories/:storyId/:page'}>
              <Story mode={StoryMode.Stories} />
            </Route>
            <Route path={'/present/:storyId/:page'}>
              <Story mode={StoryMode.Present} />
            </Route>
            <Route path={'/showcase/:storyIds/:storyNumber/:page'}>
              <Story mode={StoryMode.Showcase} />
            </Route>
          </div>
        </div>
      </IntlProvider>
      <UrlSync />
      <Init />
    </Router>
  );
};

export default App;
