import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useIntl} from 'react-intl';

import setGlobeProjectionAction from '../../actions/set-globe-projection';
import {ProjectionIcon} from '../icons/ProjectionIcon';

import {GlobeProjection} from '../../types/globe-projection';

import styles from './projection-menu.styl';

const ProjectionMenu: FunctionComponent = () => {
  const intl = useIntl();
  const projections = Object.values(GlobeProjection);
  const dispatch = useDispatch();
  const onProjectionClick = (projection: GlobeProjection) => {
    dispatch(setGlobeProjectionAction(projection));
  };
  const [isOpen, setIsOpen] = useState(false);
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
