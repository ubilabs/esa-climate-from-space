import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useIntl} from 'react-intl';

import setGlobeProjectionAction from '../../actions/set-globe-projection';
import {ProjectionIcon} from '../icons/projection-icon';

import {GlobeProjection} from '../../types/globe-projection';

import styles from './projection-menu.styl';

const ProjectionMenu: FunctionComponent = () => {
  const intl = useIntl();
  const projections = Object.values(GlobeProjection);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const onProjectionClick = (projection: GlobeProjection) => {
    setIsOpen(false);
    dispatch(setGlobeProjectionAction(projection));
  };
  const onButtonClickHandler = () => setIsOpen(!isOpen);

  return (
    <div className={styles.projectionContainer}>
      <button
        title={intl.formatMessage({id: 'projection'})}
        onClick={() => onButtonClickHandler()}
        className={styles.projectionButton}>
        <ProjectionIcon />
      </button>
      {isOpen && (
        <ul className={styles.projectionList}>
          {projections.map(projection => (
            <li
              onClick={() => onProjectionClick(projection)}
              className={styles.projectionListItem}
              key={projection}>
              {projection}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectionMenu;
