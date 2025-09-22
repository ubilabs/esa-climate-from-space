import { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router-dom";

import { ElementOptions } from "../../../types/embed-elements";
import EmbedCheckboxList from "../embed-checkbox-list/embed-checkbox-list";
import { parseUrl } from "../../../libs/language-url-parameter";
import { Language } from "../../../types/language";
import { uiEmbedElements } from "../../../config/main";

import styles from "./embed-settings.module.css";

export const autoLng = "autoLng";

interface Props {
  elementsChecked: ElementOptions;
  handleChange: (elements: ElementOptions) => void;
}

const EmbedSettings: FunctionComponent<Props> = ({
  elementsChecked,
  handleChange,
}) => {
  const { pathname } = useLocation();

  return (
    <div className={styles.settings}>
      {uiEmbedElements.map((element) => (
        <EmbedCheckboxList
          disabledEmbed={!pathname.includes(element.embedPath)}
          key={element.title}
          elementList={element}
          elementsChecked={elementsChecked}
          handleChange={(elements) => handleChange(elements)}
        />
      ))}
      <div className={styles.languageSelect}>
        <label htmlFor="language" className={styles.title}>
          <FormattedMessage id="embedLanguage" />
        </label>
        <select
          name="language"
          id="language"
          defaultValue={parseUrl() ?? autoLng}
          onChange={(event) => {
            const selectedLng = event.target.value as Language;

            handleChange({
              ...elementsChecked,
              lng: selectedLng,
            });
          }}
        >
          <option value="autoLng">
            <FormattedMessage id="detectLanguage" />
          </option>
          {Object.values(Language).map((lng) => (
            <option key={lng} value={lng as Language}>
              <FormattedMessage id={`language.${lng}`} />
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EmbedSettings;
