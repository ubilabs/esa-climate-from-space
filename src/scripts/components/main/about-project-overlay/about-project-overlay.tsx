import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';
import AboutProject from '../about-project/about-project';
import Overlay from '../overlay/overlay';

const AboutProjectOverlay: FunctionComponent = () => {
  const history = useHistory();

  return (
    <Overlay onClose={() => history.push('/')}>{<AboutProject />}</Overlay>
  );
};

export default AboutProjectOverlay;
