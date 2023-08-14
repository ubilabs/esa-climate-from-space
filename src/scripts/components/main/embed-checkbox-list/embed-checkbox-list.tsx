import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import cx from 'classnames';

import {ElementOptions, UiEmbedElement} from '../../../types/embed-elements';

import styles from './embed-checkbox-list.module.styl';

interface Props {
  elementList: UiEmbedElement;
  elementsChecked: ElementOptions;
  handleChange: (elements: ElementOptions) => void;
}

const EmbedCheckboxList: FunctionComponent<Props> = ({
  elementList,
  elementsChecked,
  handleChange
}) => {
  const checkboxListClasses = cx(
    styles.checkboxList,
    styles[elementList.title]
  );
  const convertToTitleCase = (inputString: string) =>
    inputString
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <div className={checkboxListClasses}>
      <h2 className={styles.listTitle}>
        <FormattedMessage id={elementList.title} />
      </h2>
      {elementList.elements.map(element => (
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
