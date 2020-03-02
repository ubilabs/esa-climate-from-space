import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router} from 'react-router-dom';

import rootReducer from '../../reducers/index';
import {languageSelector} from '../../selectors/language';
import UrlSync from '../url-sync/url-sync';
import LayerLoader from '../layer-loader/layer-loader';
import Init from '../init/init';
import LayerSelector from '../layer-selector/layer-selector';
import Navigation from '../navigation/navigation';
import GlobeZoom from '../globe-zoom/globe-zoom';
import {EsaLogo} from '../icons/esa-logo';
import Globes from '../globes/globes';

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
          <div className={styles.logo}>
            <EsaLogo />
          </div>
          <main className={styles.main}>
            {false && <div>StoryContent</div>}
            <Globes />
            {false && <div>StoryMedia</div>}
          </main>
          <Navigation />
          <GlobeZoom />
          <LayerSelector />
        </div>
      </IntlProvider>
      <UrlSync />
      <LayerLoader />
      <Init />
    </Router>
  );
};

export default App;
