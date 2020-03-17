import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import cx from 'classnames';

import Button from '../button/button';
import {PlayIcon} from '../icons/play-icon';
import {ArrowBackIcon} from '../icons/arrow-back-icon';

import styles from './header.styl';

interface Props {
  backLink: string;
  backButtonId: string;
  title: string;
  selectedIds?: string[];
}

const Header: FunctionComponent<Props> = ({
  backLink,
  title,
  backButtonId,
  selectedIds
}) => {
  const headerClasses = cx(styles.header, selectedIds && styles.showcaseHeader);

  return (
    <div className={headerClasses}>
      <Button
        className={styles.backButton}
        icon={ArrowBackIcon}
        label={backButtonId}
        link={backLink}
      />
      <h1 className={styles.title}>{title}</h1>
      {selectedIds && (
        <div className={styles.playButton}>
          <FormattedMessage
            id="storiesSelected"
            values={{numberSelected: selectedIds.length}}
          />
          <Link to={`/showcase/${selectedIds.join('&')}/0/0`}>
            <PlayIcon />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
