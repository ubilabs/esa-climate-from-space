import React, {FunctionComponent} from 'react';
import SatelliteGraphicIcon from '../icons/satellite-graphic-icon/satellite-graphic-icon';
import SatelliteInfoIcon from '../icons/satellite-info-icon/satellite-info-icon';

import styles from './satellite-element.module.styl';
import {useScreenSize} from '../../../../../hooks/use-screen-size';

interface Props {
  isSelected: boolean;
  iconIndex: number;
  onClick: (id: number) => void;
  label: string;
  info: string;
}

const SatelliteElement: FunctionComponent<Props> = ({
  isSelected,
  iconIndex,
  onClick,
  label,
  info
}) => {
  const dialogRef = React.createRef<HTMLDialogElement>();

  const closingContent = (
    <>
      <span className={styles.label}>{label}</span>
      <button
        autoFocus
        onClick={() => dialogRef.current?.close()}
        className={styles.closeButton}></button>
    </>
  );

  const {isDesktop, isMobile} = useScreenSize();
  return (
    <div className={styles.satellite}>
      {isSelected && (
        <>
          <span className={styles.label}>{label}</span>
          <SatelliteInfoIcon onClick={() => dialogRef.current?.showModal()} />
          <dialog ref={dialogRef} className={styles.dialog}>
            <div className={styles.top}>{isMobile && closingContent}</div>
            <div className={styles.mainContent}>
              {isDesktop && <SatelliteGraphicIcon />}

              <div>
                {isDesktop && (
                  <div className={styles.top}>{closingContent}</div>
                )}
                <p>{info}</p>
              </div>
            </div>
          </dialog>
        </>
      )}

      <SatelliteGraphicIcon
        onClick={() => onClick(iconIndex)}
        isSelected={isSelected}
      />
    </div>
  );
};

export default SatelliteElement;
