import React, {FunctionComponent, useState} from 'react';

import Button from '../button/button';

import styles from './navigation.styl';
import Overlay from '../overlay/overlay';

const Navigation: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.navigation}>
      <Button label="more" onClick={() => setIsOpen(true)} />
      {isOpen && <Overlay onClose={() => setIsOpen(false)} isOpen={isOpen} />}
    </div>
  );
};

export default Navigation;
