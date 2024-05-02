import React, {FunctionComponent, SVGAttributes} from 'react';

interface Props extends Omit<SVGAttributes<SVGSVGElement>, 'viewBox'> {
  isCollapsed?: boolean;
}

const DrawerToggleIcon: FunctionComponent<Props> = props => {
  const {isCollapsed, ...rest} = props;

  const path = isCollapsed
    ? 'M12 21.0001L7.5 16.5001L8.95 15.0501L12 18.1001L15.05 15.0501L16.5 16.5001L12 21.0001ZM8.95 9.0501L7.5 7.6001L12 3.1001L16.5 7.6001L15.05 9.0501L12 6.0001L8.95 9.0501Z'
    : 'M8.9 20L7.5 18.6L12 14.1L16.5 18.6L15.1 20L12 16.9L8.9 20ZM12 9.9L7.5 5.4L8.9 4L12 7.1L15.1 4L16.5 5.4L12 9.9Z';

  return (
    <svg viewBox="0 0 24 24" height="24" width="24" {...rest}>
      <path d={path} fill="currentColor" />
    </svg>
  );
};

export default DrawerToggleIcon;
