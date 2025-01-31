import React, {useCallback, useEffect, useState} from 'react';
import styles from './content-navigation.module.css';
import cx from 'classnames';

const GAP_BETWEEN_ELEMENTS = 16;

const ContentNavigation = () => {
  const contents = [
    {name: 'Anomalies du niveau de la mer', type: 'image'},
    {
      name: 'Bienvenue sur le site Climate from Space With long title',
      type: 'layer'
    },
    {name: 'Changement de la couverture des terres', type: 'image'},
    {name: "Le cycle de l'eau", type: 'video'},
    {name: 'Les glaciers surface', type: 'blog'},
    {name: 'Température de surface de la mer', type: 'image'},
    {name: 'Évolution des forêts', type: 'layer'},
    {name: 'Cycle du carbone', type: 'video'},
    {name: 'Fonte des glaces', type: 'blog'},
    {name: "Température de l'air with another longer title", type: 'image'},
    {name: 'Changements climatiques', type: 'layer'},
    {name: 'Événements extrêmes', type: 'video'},
    {name: 'Biodiversité', type: 'blog'}
  ];

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [indexDelta, setIndexDelta] = useState(0);

  function computeCartesianCoordinates(radius: number, angleInDegrees: number) {
    const angleInRadians = angleInDegrees * (Math.PI / 180);

    const x = radius * Math.cos(angleInRadians);
    const y = radius * Math.sin(angleInRadians);

    return {x, y};
  }

  const getCoordinates = useCallback((pos: number) => {
    const _radius = 30;
    const angleInDegrees = pos * GAP_BETWEEN_ELEMENTS;
    const {x, y} = computeCartesianCoordinates(_radius, angleInDegrees);

    return {x, y: y + 50};
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) {
      setTouchStartY(e.touches[0].clientY);
      return;
    }

    const touchDelta = e.touches[0].clientY - touchStartY;

    const itemHeight = 32; // Height of each item in pixels
    const sensitivity = 0.5; // Adjust this to control movement sensitivity

    const delta = Math.round((touchDelta * sensitivity) / itemHeight);

    if (delta !== indexDelta) {
      setIndexDelta(delta);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  const showContentList = true;

  useEffect(() => {
    const listItems = document.querySelectorAll(
      'ul li'
      // eslint-disable-next-line no-undef
    ) as NodeListOf<HTMLElement>;

    for (const item of listItems) {
      const relativePosition = Number(
        item.getAttribute('data-relative-position')
      );

      const adjustedPosition = relativePosition + indexDelta;

      const {x, y} = getCoordinates(adjustedPosition);
      const rotation = adjustedPosition * 12;
      const opacity =
        adjustedPosition === 0
          ? 1
          : Math.pow(0.5, Math.abs(adjustedPosition)) * 0.5;

      item.style.top = `${y}%`;
      item.style.left = `${x}%`;
      item.style.opacity = `${opacity}`;
      item.style.rotate = `${rotation}deg`;

      item.setAttribute('data-relative-position', adjustedPosition.toString());
    }
  }, [indexDelta, getCoordinates, showContentList]);

  const relativePositionToCenter = (index: number, count: number): number =>
    index - Math.floor(count / 2);

  const {x, y} = getCoordinates(0);

  return (
    <ul
      className={cx(styles.contentNav, showContentList && styles.show)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}>
      {contents.map(({name, type}, index) => {
        const relativePosition = relativePositionToCenter(
          index,
          contents.length
        );

        return (
          <li
            data-content-type={type}
            data-relative-position={relativePosition}
            className={cx(
              relativePosition === 0 && styles.active,
              styles.contentNavItem
            )}
            key={index}>
            <span>{name}</span>
          </li>
        );
      })}
      <span
        aria-hidden="true"
        style={{
          // 20px for the width of the symbol plus 8px for the padding
          left: `calc(${x}% - 8px)`
        }}></span>
    </ul>
  );
};

export default ContentNavigation;
