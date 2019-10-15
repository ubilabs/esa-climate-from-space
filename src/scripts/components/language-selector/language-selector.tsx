import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {useDispatch} from 'react-redux';

import setLanguageAction from '../../actions/set-language';

import {Language} from '../../types/language';

const languages = Object.values(Language);

const LanguageSelector: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const setLanguage = (language: Language) =>
    dispatch(setLanguageAction(language));

  return (
    <ul>
      {languages.map(language => (
        <li key={language} onClick={() => setLanguage(language)}>
          <FormattedMessage id={`language.${language}`} />
        </li>
      ))}
    </ul>
  );
};

export default LanguageSelector;
