import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import cx from 'classnames';

import setLanguageAction from '../../../actions/set-language';
import Button from '../button/button';
import {languageSelector} from '../../../selectors/language';

import {Language} from '../../../types/language';

import styles from './language-selector.styl';

const languages = Object.values(Language);

interface Props {
  className?: string;
}

const LanguageSelector: FunctionComponent<Props> = ({className = ''}) => {
  const classes = `${styles.languageItem} ${className}`;
  const selectedLanguage = useSelector(languageSelector);
  const dispatch = useDispatch();

  return (
    <ul className={styles.language}>
      {languages.map(language => {
        const buttonClasses = cx(
          styles.button,
          language === selectedLanguage && styles.buttonActive
        );

        return (
          <li className={classes} key={language}>
            <Button
              className={buttonClasses}
              key={language}
              onClick={() => dispatch(setLanguageAction(language))}
              label={`language.${language}`}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default LanguageSelector;
