import React, {FunctionComponent} from 'react';
import {useDispatch} from 'react-redux';

import setLanguageAction from '../../actions/set-language';
import Button from '../button/button';

import {Language} from '../../types/language';

import styles from './language-selector.styl';

const languages = Object.values(Language);

interface Props {
  className?: string;
}

const LanguageSelector: FunctionComponent<Props> = ({className = ''}) => {
  const classes = `${styles.languageItem} ${className}`;
  const dispatch = useDispatch();
  const setLanguage = (language: Language) =>
    dispatch(setLanguageAction(language));

  return (
    <ul className={styles.language}>
      {languages.map(language => (
        <li className={classes} key={language}>
          <Button
            className={styles.button}
            key={language}
            onClick={() => setLanguage(language)}
            label={`language.${language}`}
          />
        </li>
      ))}
    </ul>
  );
};

export default LanguageSelector;
