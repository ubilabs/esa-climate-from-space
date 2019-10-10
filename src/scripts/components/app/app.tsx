import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';

import rootReducer from '../../reducers/index';
import {languageSelector} from '../../reducers/language';
import {selectedLayersSelector} from '../../reducers/selected-layers';
import LayerSelector from '../layer-selector/layer-selector';
import Globe from '../globe/globe';
import Menu from '../menu/menu';
import ProjectionMenu from '../projection-menu/projection-menu';
import PresentationSelector from '../presentation-selector/presentation-selector';
import ShowcaseSelector from '../showcase-selector/showcase-selector';

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
  const selectedLayers = useSelector(selectedLayersSelector);

  return (
    <Router>
      <IntlProvider locale={language} messages={translations[language]}>
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
              <PresentationSelector />
            </Route>
            <Route path="/showcase">
              <ShowcaseSelector />
            </Route>
          </Switch>
        </div>
      </IntlProvider>
    </Router>
  );
};

export default App;
