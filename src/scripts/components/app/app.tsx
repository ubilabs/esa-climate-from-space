import React, {FunctionComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router} from 'react-router-dom';

import rootReducer from '../../reducers/index';
import {languageSelector} from '../../selectors/language';
import Button from '../button/button';
import UrlSync from '../url-sync/url-sync';
import LayerLoader from '../layer-loader/layer-loader';
import Init from '../init/init';
import {StoryIcon} from '../icons/story-icon';
import {LayersIcon} from '../icons/layers-icon';
import {ZoomIn} from '../icons/zoom-in';
import {ZoomOut} from '../icons/zoom-out';
import Logo from '../logo/logo';

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
          <Logo />
          <div className={styles.nav}>
            <Button label="stories" link="/stories" icon={StoryIcon} />
            <Button
              label="layers"
              onClick={() => console.log('placeholder')}
              icon={LayersIcon}
            />
            <Button label="more" onClick={() => console.log('placeholder')} />
          </div>
          <div className={styles.zoom}>
            <Button icon={ZoomIn} onClick={() => console.log('placeholder')} />
            <Button icon={ZoomOut} onClick={() => console.log('placeholder')} />
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
