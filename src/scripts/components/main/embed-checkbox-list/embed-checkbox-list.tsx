import {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {useLocation} from 'react-router-dom';
import cx from 'classnames';

import {ElementOptions, UiEmbedElement} from '../../../types/embed-elements';
import {useStoryParams} from '../../../hooks/use-story-params';
import useIsStoriesPath from '../../../hooks/use-is-stories-path';

import styles from './embed-checkbox-list.module.css';

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
  const {currentStoryId} = useStoryParams();
  const isStoriesPath = useIsStoriesPath();
  const isDataPath = pathname === '/';
  const isStoriesList = elementList.title === 'stories';
  const isStory = elementList.title === 'story';
  const isApp = elementList.title === 'app';

  const disabledEmbed =
    (isDataPath && (isStoriesList || isStory)) ||
    (isStoriesPath && (isStory || isApp)) ||
    (currentStoryId && (isStoriesList || isApp));

  const checkboxListClasses = cx(
    styles.checkboxListContainer,
    disabledEmbed && styles.disabledEmbed,
    styles[elementList.title]
  );

  return (
    <div className={checkboxListClasses}>
      <h2 className={styles.listTitle}>
        <FormattedMessage id={elementList.title} />
      </h2>
      <div
        className={styles.checkBoxList}
        title={disabledEmbed ? 'Disabled for this layer' : ''}>
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
    </div>
  );
};

export default EmbedCheckboxList;
