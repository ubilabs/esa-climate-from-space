import { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";
import cx from "classnames";

import { ElementOptions, UiEmbedElement } from "../../../types/embed-elements";

import styles from "./embed-checkbox-list.module.css";

interface Props {
  elementList: UiEmbedElement;
  elementsChecked: ElementOptions;
  handleChange: (elements: ElementOptions) => void;
  disabledEmbed: boolean;
}

const EmbedCheckboxList: FunctionComponent<Props> = ({
  elementList,
  elementsChecked,
  handleChange,
  disabledEmbed,
}) => {
  const checkboxListClasses = cx(
    styles.checkboxListContainer,
    disabledEmbed && styles.disabledEmbed,
    styles[elementList.title],
  );

  return (
    <div className={checkboxListClasses}>
      <h2 className={styles.listTitle}>
        <FormattedMessage id={elementList.title} />
      </h2>
      <div
        className={styles.checkBoxList}
        title={disabledEmbed ? "Disabled for this layer" : ""}
      >
        {elementList.elements.map((element) => {

          // Disable header checkboxes if the header itself is not checked
          const isDisabled =
            elementsChecked["header"] === false &&
            elementList.title === "app" &&
            element !== "header";

          return (
            <div
              className={cx(
                styles.checkboxListItem,
                isDisabled && styles.disabled,
                element === "header" && styles.divider,
              )}
              key={element}
            >
              <input
                type="checkbox"
                name={element}
                checked={elementsChecked[element] === true}
                onChange={(event) => {
                  const checked = event.target.checked;

                  handleChange({
                    ...elementsChecked,
                    [element]: checked,
                  });
                }}
              />
              <label htmlFor={element}>
                <FormattedMessage id={element} />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmbedCheckboxList;
