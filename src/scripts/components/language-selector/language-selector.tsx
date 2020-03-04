import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';

import setLanguageAction from '../../actions/set-language';
import Button from '../button/button';

import {Language} from '../../types/language';

const languages = Object.values(Language);

const LanguageSelector: FunctionComponent = () => {
  const dispatch = useDispatch();
  const setLanguage = (language: Language) =>
    dispatch(setLanguageAction(language));

  return (
    <ul>
      {languages.map(language => (
        <Button
          key={language}
          onClick={() => setLanguage(language)}
          label={`language.${language}`}
        />
      ))}
    </ul>
  );
};

export default LanguageSelector;
