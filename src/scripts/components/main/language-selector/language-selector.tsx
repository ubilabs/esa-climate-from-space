import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";

import Button from "../button/button";
import { languageSelector } from "../../../selectors/language";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";

import { setLanguage } from "../../../reducers/language";
import { Language } from "../../../types/language";

import styles from "./language-selector.module.css";

const languages = Object.values(Language);

interface Props {
  className?: string;
}

const LanguageSelector: FunctionComponent<Props> = ({ className = "" }) => {
  const classes = `${styles.languageItem} ${className}`;
  const selectedLanguage = useSelector(languageSelector);
  const dispatch = useThunkDispatch();

  return (
    <ul className={styles.language}>
      {languages.map((language) => {
        const buttonClasses = cx(
          styles.button,
          language === selectedLanguage && styles.buttonActive,
        );

        return (
          <li className={classes} key={language}>
            <Button
              className={buttonClasses}
              key={language}
              onClick={() => dispatch(setLanguage(language))}
              label={`language.${language}`}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default LanguageSelector;
