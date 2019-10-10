import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';

import rootReducer from '../../reducers/index';
import {localeSelector} from '../../reducers/locale';
import {selectedLayersSelector} from '../../reducers/selected-layers';
import LayerSelector from '../layer-selector/layer-selector';
import Globe from '../globe/globe';
import Menu from '../menu/menu';
import ProjectionMenu from '../projection-menu/projection-menu';
import PresenterMode from '../presenter-mode/presenter-mode';
import ShowCaseMode from '../show-case-mode/show-case-mode';

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
  const locale = useSelector(localeSelector);
  const selectedLayers = useSelector(selectedLayersSelector);

  return (
    <Router>
      <IntlProvider locale={locale} messages={translations[locale]}>
        <div className={styles.app}>
          <Switch>
            <Route path="/" exact>
              <div className={styles.globeContainer}>
                <Globe />
                {selectedLayers.compare && <Globe />}
              </div>
              <div className={styles.layoutContainer}>
                <Menu />
                <div className={styles.timeslider} />
                <ProjectionMenu />
                <LayerSelector />
              </div>
            </Route>
            <Route path="/present">
              <PresenterMode />
            </Route>
            <Route path="/showcase">
              <ShowCaseMode />
            </Route>
          </Switch>
        </div>
      </IntlProvider>
    </Router>
  );
};

export default App;
