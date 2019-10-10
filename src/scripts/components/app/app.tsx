import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';

import rootReducer from '../../reducers/index';
import {languageSelector} from '../../reducers/language';
import LayerSelector from '../layer-selector/layer-selector';
import Globes from '../globes/globes';
import Menu from '../menu/menu';
import ProjectionMenu from '../projection-menu/projection-menu';

import translations from '../../i18n';
import styles from './app.styl';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, createLogger({collapsed: true}))
);

const App: FunctionComponent<{}> = () => (
  <StoreProvider store={store}>
    <TranslatedApp />
  </StoreProvider>
);

const TranslatedApp: FunctionComponent<{}> = () => {
  const language = useSelector(languageSelector);

  return (
    <Router>
      <IntlProvider locale={language} messages={translations[language]}>
        <div className={styles.app}>
          <Switch>
            <Route path="/" exact>
              <Globes />

              <div className={styles.layoutContainer}>
                <Menu />
                <div className={styles.timeslider} />
                <ProjectionMenu />
                <LayerSelector />
              </div>
            </Route>

            <Route path="/present">
              <h1>presenter mode</h1>
            </Route>

            <Route path="/showcase">
              <h1>show case mode</h1>
            </Route>
          </Switch>
        </div>
      </IntlProvider>
    </Router>
  );
};

export default App;
