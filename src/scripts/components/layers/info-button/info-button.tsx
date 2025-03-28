import { FunctionComponent, useState } from "react";

import Overlay from "../../main/overlay/overlay";
import { InfoIcon } from "../../main/icons/info-icon";
import LayerInfo from "../layer-info/layer-info";
import Button from "../../main/button/button";

import { LayerListItem } from "../../../types/layer-list";

import styles from "./info-button.module.css";

interface Props {
  layer: LayerListItem | null;
}

const InfoButton: FunctionComponent<Props> = ({ layer }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    layer && (
      <>
        <Button
          icon={InfoIcon}
          className={styles.infoButton}
          onClick={() => setShowMenu(true)}
        />

        {showMenu && (
          <Overlay onClose={() => setShowMenu(false)}>
            <LayerInfo layer={layer} />
          </Overlay>
        )}
      </>
    )
  );
};

export default InfoButton;
