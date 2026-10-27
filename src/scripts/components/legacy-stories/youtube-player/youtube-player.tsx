import { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";
import YouTube, { YouTubeProps } from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";
import { Language } from "../../../types/language";

import { loadConsent } from "../../../libs/load-consent";

import styles from "./youtube-player.module.css";

interface Props {
  videoId?: string;
  language: Language;
  isStoryMode: boolean;
  onPlay: (player: YouTubePlayer) => void;
}

const YoutubePlayer: FunctionComponent<Props> = ({
  videoId,
  language,
  isStoryMode,
  onPlay,
}) => {
  if (!loadConsent()?.youTube) {
    return (
      <div className={styles.consentMessage}>
        <FormattedMessage id="youTube.consentRequired" />
      </div>
    );
  }

  const options: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      rel: 0,
      cc_load_policy: 1,
      hl: language,
      cc_lang_pref: language,
      color: "red",
      controls: 1,
      iv_load_policy: 3,
      modestbranding: 1,
    },
  };

  return (
    <YouTube
      className={styles.videoPlayer}
      videoId={videoId}
      opts={options}
      onReady={(event) => !isStoryMode && event.target.playVideo()}
      onPlay={(event) => onPlay(event.target)}
    />
  );
};

export default YoutubePlayer;
