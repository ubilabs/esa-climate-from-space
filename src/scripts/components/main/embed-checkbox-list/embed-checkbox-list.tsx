import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {useLocation} from 'react-router-dom';
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
  const {pathname} = useLocation();
  const isDataPath = pathname === '/';
  const isStoriesPath = pathname === '/stories';
  const isStoryPath = pathname.startsWith('/stories/story-');
  const isStoriesList = elementList.title === 'stories';
  const isStory = elementList.title === 'story';
  const isApp = elementList.title === 'app';

  const disabledEmbed =
    (isDataPath && (isStoriesList || isStory)) ||
    (isStoriesPath && (isStory || isApp)) ||
    (isStoryPath && (isStoriesList || isApp));

  const checkboxListClasses = cx(
    styles.checkboxList,
    disabledEmbed && styles.disabledEmbed,
    styles[elementList.title]
  );

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
          <label htmlFor={element}>
            <FormattedMessage id={element} />
          </label>
        </div>
      ))}
    </div>
  );
};

export default EmbedCheckboxList;
