import { FunctionComponent } from "react";
import YouTube, { Options } from "react-youtube";
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
    return null;
  }

  const options: Options = {
    height: "100%",
    width: "100%",
    playerVars: {
      rel: 0,
      cc_load_policy: 1,
      hl: language,
      // @ts-expect-error - injected via webpack's define plugin
      cc_lang_pref: language,
      color: "red",
      controls: 2,
      iv_load_policy: 3,
      modestbranding: 1,
      showinfo: 0,
      allow:
        "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
    },
  };

  return (
    <YouTube
      containerClassName={styles.videoPlayer}
      videoId={videoId}
      opts={options}
      onReady={(event) => !isStoryMode && event.target.playVideo()}
      onPlay={(event) => onPlay(event.target)}
    />
  );
};

export default YoutubePlayer;
