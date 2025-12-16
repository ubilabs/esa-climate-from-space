import { FunctionComponent, useState } from "react";
import { FormattedMessage } from "react-intl";

import planeratyVisionsLogo from "~/assets/images/planetary-visions.png";

import LanguageSelector from "../language-selector/language-selector";
import Button from "../button/button";
import { PresenterIcon } from "../icons/presenter-icon";
import { LanguageIcon } from "../icons/language-icon";
import { InfoIcon } from "../icons/info-icon";
import { DownloadIcon } from "../icons/download-icon";
import { CCILogo } from "../icons/cci-logo";
import AboutProject from "../about-project/about-project";
import Overlay from "../overlay/overlay";
import { WindowsIcon } from "../icons/windows-icon";
import { LinuxIcon } from "../icons/linux-icon";
import { AppleIcon } from "../icons/apple-icon";
import { Ubilabslogo } from "../icons/ubilabs-logo";
import { PrivacyIcon } from "../icons/privacy-icon";
import Attributions from "../attributions/attributions";
import { FeedbackIcon } from "../icons/feedback-icon";
import { ShareIcon } from "../icons/share-icon";
import Share from "../share/share";

import config from "../../../config/main";

import styles from "./menu.module.css";

interface Props {
  onRestartOnboarding: () => void;
}

const Menu: FunctionComponent<Props> = ({ onRestartOnboarding }) => {
  const [overlayType, setOverlayType] = useState<string | null>(null);
  // @ts-expect-error - injected via webpack's define plugin
  const version = INFO_VERSION;

  return (
    <>
      <nav className={styles.menuContainer}>
        {overlayType ? (
          <Overlay onClose={() => setOverlayType(null)}>
            {overlayType === "about" ? <AboutProject /> : <Attributions />}
          </Overlay>
        ) : (
          <>
            <ul className={styles.menuList}>
              <li className={styles.menuItemTitle}>
                <PresenterIcon /> <FormattedMessage id={"modes"} />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={"presenterMode"}
                  link={"/present"}
                />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={"showcaseMode"}
                  link={"/showcase"}
                />
              </li>
              <li className={styles.subMenuTitle}>
                <DownloadIcon /> <FormattedMessage id={"offline"} />
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.downloadUrls.windows}
                  target={"_blank"}
                  rel="noopener noreferrer"
                  className={styles.menuButton}
                >
                  <WindowsIcon />
                  Windows
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.downloadUrls.macOS}
                  target={"_blank"}
                  rel="noopener noreferrer"
                  className={styles.menuButton}
                >
                  <AppleIcon />
                  macOS
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.downloadUrls.linux}
                  target={"_blank"}
                  rel="noopener noreferrer"
                  className={styles.menuButton}
                >
                  <LinuxIcon />
                  Linux
                </a>
              </li>
            </ul>

            <ul className={styles.menuList}>
              <li className={styles.menuItemTitle}>
                <LanguageIcon /> <FormattedMessage id={"language"} />
              </li>
              <li>
                <LanguageSelector className={styles.menuListItem} />
              </li>

              <li className={styles.menuItemTitle}>
                <ShareIcon /> <FormattedMessage id="share" />
              </li>
              <li>
                <Share className={styles.menuListItem} />
              </li>
              <li className={styles.subMenuTitle}>
                <FeedbackIcon /> <FormattedMessage id={"feedback"} />
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.feedbackUrl}
                  target={"_blank"}
                  rel="noopener noreferrer"
                  className={styles.menuButton}
                >
                  <FormattedMessage id={"provideFeedback"} />
                </a>
              </li>
            </ul>
            <ul className={styles.menuList}>
              <li className={styles.menuItemTitle}>
                <InfoIcon /> <FormattedMessage id={"info"} />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={"about"}
                  onClick={() => setOverlayType("about")}
                />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={"restartOnboarding"}
                  onClick={() => onRestartOnboarding()}
                />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={"attributions"}
                  onClick={() => setOverlayType("attributions")}
                />
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.esaWebsite}
                  target={"_blank"}
                  rel="noopener noreferrer"
                  className={styles.menuButton}
                >
                  <FormattedMessage id={"EsaWebsite"} />
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.cciWebsite}
                  target={"_blank"}
                  rel="noopener noreferrer"
                  className={styles.menuButton}
                >
                  <FormattedMessage id={"CCIWebsite"} />
                </a>
              </li>
              <li className={styles.menuListItem}>
                <a
                  href={config.githubRepo}
                  target={"_blank"}
                  rel="noopener noreferrer"
                  className={styles.menuButton}
                >
                  <FormattedMessage id={"github"} />
                </a>
              </li>
              <li className={styles.subMenuTitle}>
                <PrivacyIcon /> <FormattedMessage id={"dataPrivacy"} />
              </li>
              <li className={styles.menuListItem}>
                <Button
                  className={styles.menuButton}
                  label={"privacySettings"}
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("openPrivacySettings"))
                  }
                />
              </li>
            </ul>
          </>
        )}
      </nav>
      <div className={styles.credits}>
        <div className={styles.logo}>
          <a
            href={config.ubilabsWebsite}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <p className={styles.creditsText}>
              <FormattedMessage id={"madeBy"} />
            </p>
            <Ubilabslogo />
          </a>
        </div>
        <div className={styles.cciLogo}>
          <CCILogo />
          <div className={styles.version}>{version}</div>
        </div>
        <div className={styles.logo}>
          <a
            href={config.planetaryVisionsWebsite}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <p className={styles.creditsText}>
              <FormattedMessage id={"contentBy"} />
            </p>
            <img src={planeratyVisionsLogo} alt="Planetary Visions logo" />
          </a>
        </div>
      </div>
    </>
  );
};

export default Menu;
