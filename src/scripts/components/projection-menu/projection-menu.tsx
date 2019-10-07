import React, {FunctionComponent, useState} from 'react';
import styles from './projection-menu.styl';

interface ProjectionMenuItem {
  id: string;
  name: string;
}

const ProjectionMenu: FunctionComponent<{}> = () => {
  const projectionItems = [
    {
      id: 'sphere',
      name: 'Sphere'
    },
    {
      id: 'mercator',
      name: 'Mercator'
    },
    {
      id: 'plate-carrée ',
      name: 'Plate carrée '
    }
  ] as ProjectionMenuItem[];

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
          {projectionItems.map(projectionItem => (
            <li className={styles.projectionListItem} key={projectionItem.id}>
              {projectionItem.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectionMenu;
