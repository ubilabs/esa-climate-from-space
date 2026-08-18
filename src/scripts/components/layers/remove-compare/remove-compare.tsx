import { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { Link, matchPath, useLocation } from "react-router-dom";

import { CloseIcon } from "../../main/icons/close-icon";

import styles from "./remove-compare.module.css";

const RemoveCompare: FunctionComponent = () => {
  const intl = useIntl();
  const location = useLocation();
  const match = matchPath(
    "/layers/:mainLayerId/:compareLayerId",
    location.pathname,
  );

  if (!match) {
    return null;
  }

  const newPath = `/layers/${match.params.mainLayerId}`;

  return (
    <div className={styles.removeCompare}>
      <Link to={newPath}>
        <button
          className={styles.icon}
          title={intl.formatMessage({ id: "removeCompare" })}
        >
          <CloseIcon />
        </button>
      </Link>
    </div>
  );
};

export default RemoveCompare;
