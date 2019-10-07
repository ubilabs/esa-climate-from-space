import React, {FunctionComponent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {setProjectionAction, Projection} from '../../actions/set-projection';
import styles from './projection-menu.styl';

const ProjectionMenu: FunctionComponent<{}> = () => {
  const projections = Object.values(Projection);

  const dispatch = useDispatch();

  const onProjectionClick = (projection: Projection) => {
    dispatch(setProjectionAction(projection));
  };

  const [isOpen, setIsOpen] = useState(false);

  const onButtonClickHandler = () => setIsOpen(!isOpen);

  return (
    <div className={styles.projectionContainer}>
      <button
        onClick={() => onButtonClickHandler()}
        className={styles.projectionButton}>
        mode
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
