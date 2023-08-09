import React, {FunctionComponent} from 'react';

import styles from './embed-checkbox-list.module.styl';
import {ElementOptions} from '../../../types/embed-elements';

interface Props {
  elementsChecked: ElementOptions;
  handleChange: (elements: ElementOptions) => void;
}

const EmbedCheckboxList: FunctionComponent<Props> = ({
  elementsChecked,
  handleChange
}) => {
  const convertToTitleCase = (inputString: string) =>
    inputString
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <div className={styles.checkboxList}>
      {Object.keys(elementsChecked).map(element => (
        <div className={styles.checkboxListItem} key={element}>
          <input
            type="checkbox"
            name={element}
            checked={elementsChecked[element] === true}
            onChange={event => {
              const checked = event.target.checked;

              handleChange({
                ...elementsChecked,
                [element]: checked
              });
            }}
          />
          <label htmlFor={element}>{convertToTitleCase(element)}</label>
        </div>
      ))}
    </div>
  );
};

export default EmbedCheckboxList;
