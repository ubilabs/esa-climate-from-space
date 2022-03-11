import React, {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';
import ReactMarkdown from 'react-markdown';
import {useDispatch} from 'react-redux';

import setWelcomeScreenAction from '../../../actions/set-welcome-screen';
import Button from '../button/button';
import config from '../../../config/main';
import Overlay from '../overlay/overlay';

import styles from './welcome-screen.styl';

interface Props {
  onStartOnboarding: () => void;
}

const WelcomeScreen: FunctionComponent<Props> = ({onStartOnboarding}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const storeHideWelcomeScreen = (hideWelcomeScreen: boolean) => {
    localStorage.setItem(
      config.localStorageWelcomeScreenKey,
      hideWelcomeScreen.toString()
    );
    dispatch(setWelcomeScreenAction(true));
  };

  return (
    <Overlay className={styles.welcomeOverlay} showCloseButton={false}>
      <div className={styles.welcomeScreen}>
        <div className={styles.content}>
          <ReactMarkdown
            source={intl.formatMessage({id: 'welcomeContent'})}
            linkTarget="_blank"
            allowedTypes={[
              'heading',
              'text',
              'paragraph',
              'break',
              'strong',
              'emphasis',
              'image',
              'imageReference',
              'list',
              'listItem',
              'link'
            ]}
          />
          <div className={styles.tourButtons}>
            <Button
              className={styles.secondaryTourButton}
              label="cancelTour"
              onClick={() => storeHideWelcomeScreen(true)}
            />
            <Button
              className={styles.primaryTourButton}
              label="startTour"
              onClick={() => {
                storeHideWelcomeScreen(true);
                onStartOnboarding();
              }}
            />
          </div>
        </div>
      </div>
    </Overlay>
  );
};

export default WelcomeScreen;