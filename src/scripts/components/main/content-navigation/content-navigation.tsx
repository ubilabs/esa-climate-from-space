import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from 'react';
import styles from './content-navigation.module.css';
import cx from 'classnames';

const GAP_BETWEEN_ELEMENTS = 16;

interface Props {
  showContentList: boolean;
}

// Placeholder content
// Todo: Replace with actual content
const contents = [
  {
    name: 'Anomalies du niveau de la mere',
    type: 'image',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Bienvenue sur le site Climate from Space With long title',
    type: 'layer',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Changement de la couverture des terres',
    type: 'image',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: "Le cycle de l'eau",
    type: 'video',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Les glaciers surface',
    type: 'blog',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Température de surface de la mer',
    type: 'image',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Évolution des forêts',
    type: 'layer',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Cycle du carbone',
    type: 'video',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Fonte des glaces',
    type: 'blog',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: "Température de l'air with another longer title",
    type: 'image',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Changements climatiques',
    type: 'layer',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Événements extrêmes',
    type: 'video',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  },
  {
    name: 'Biodiversité',
    type: 'blog',
    link: 'https://cfs.climate.esa.int/index.html#/stories/story-32/0'
  }
];

const ContentNavigation: FunctionComponent<Props> = ({showContentList}) => {
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

  const {x} = getCoordinates(0);

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
