import { FunctionComponent, useState, useRef, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import { TwitterIcon } from "../icons/twitter-icon";
import { FacebookIcon } from "../icons/facebook-icon";
import { CopyIcon } from "../icons/copy-icon";
import { ShareIcon } from "../icons/share-icon";
import config from "../../../config/main";
import Button from "../button/button";
import { CloseIcon } from "../icons/close-icon";
import { EmbedIcon } from "../icons/embed-icon";
import { CheckIcon } from "../icons/check-icon";
import Overlay from "../overlay/overlay";
import { replaceUrlPlaceholders } from "../../../libs/replace-url-placeholders";
import EmbedWizard from "../embed-wizard/embed-wizard";

import styles from "./share.module.css";

interface Props {
  className?: string;
}

const Share: FunctionComponent<Props> = ({ className }) => {
  const classes = `${styles.shareItem} ${className}`;

  const [showEmbedWizard, setShowEmbedWizard] = useState<boolean>(false);
  const { trackEvent } = useMatomo();
  const currentUrl = window.location.href;

  const facebookUrl = replaceUrlPlaceholders(config.share.facebook, {
    currentUrl: encodeURIComponent(currentUrl),
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer = -1;

    if (copied) {
      timer = window.setTimeout(() => {
        setCopied(false);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [copied]);

  const ref = useRef<HTMLInputElement>(null);
  const copyUrl = () => {
    if (ref.current) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(currentUrl);
      } else {
        ref.current.value = currentUrl;
        ref.current.focus();
        ref.current.select();
        document.execCommand("copy");
      }
    }
  };

  const trackShareClick = (name: string) => {
    trackEvent({
      category: "share",
      action: "click",
      name,
      href: currentUrl,
    });
  };

  return (
    <>
      <ul className={styles.share}>
        <li className={classes}>
          <a
            href={facebookUrl}
            target={"_blank"}
            rel="noopener noreferrer"
            className={styles.link}
            onClick={() => trackShareClick("facebook")}
          >
            <span>Facebook</span>
          </a>
        </li>
        <li
        >
          <Button
            className={classes}
            label="copyLink"
            onClick={() => {
              setCopied(true);
              copyUrl();
              trackShareClick("link-copy");
            }}
          >
          </Button>
        </li>
        <li>
          <Button
            onClick={() => setShowEmbedWizard(true)}
            className={classes}
            label={"embed"}
          />
        </li>
      </ul>
      {showEmbedWizard && (
        <Overlay
          className={styles.embedOverlay}
          onClose={() => setShowEmbedWizard(false)}
        >
          <EmbedWizard />
        </Overlay>
      )}
    </>
  );
};

export default Share;
