import { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";

import { setSelectedTags } from "../../../reducers/story";
import { CheckIcon } from "../../main/icons/check-icon";

import styles from "./selected-tags.module.css";

interface Props {
  selectedTags: string[];
}

const SelectedTags: FunctionComponent<Props> = ({ selectedTags }) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.selectedTags}>
      {selectedTags.map((tag) => (
        <div key={tag} className={styles.tag}>
          <CheckIcon />
          <FormattedMessage id={`tags.${tag}`} />
        </div>
      ))}
      <button
        className={styles.resetFilters}
        onClick={() => dispatch(setSelectedTags([]))}
      >
        <FormattedMessage id={"resetFilters"} />
      </button>
    </div>
  );
};

export default SelectedTags;
