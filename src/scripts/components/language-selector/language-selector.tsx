import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {useDispatch} from 'react-redux';

import setLocaleAction, {Locale} from '../../actions/set-locale';

const locales = Object.values(Locale);

const LanguageSelector: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const setLocale = (locale: Locale) => dispatch(setLocaleAction(locale));

  return (
    <ul>
      {locales.map(locale => (
        <li key={locale} onClick={() => setLocale(locale)}>
          <FormattedMessage id={`language.${locale}`} />
        </li>
      ))}
    </ul>
  );
};

export default LanguageSelector;
