import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {IntlProvider} from 'react-intl';

import rootReducer from '../../reducers/index';
import LayerSelector from '../layer-selector/layer-selector';
import Globe from '../globe/globe';
import Menu from '../menu/menu';

import {localeSelector} from '../../reducers/locale';
import translations from '../../i18n';

import styles from './app.styl';

const store = createStore(rootReducer, applyMiddleware(thunk, logger));

const App: FunctionComponent<{}> = () => (
  <StoreProvider store={store}>
    <TranslatedApp />
  </StoreProvider>
);

const TranslatedApp: FunctionComponent<{}> = () => {
  const locale = useSelector(localeSelector);

  return (
    <IntlProvider locale={locale} messages={translations[locale]}>
      <div className={styles.app}>
        <Globe />
        <LayerSelector />
        <Menu />
      </div>
    </IntlProvider>
  );
};

export default App;
