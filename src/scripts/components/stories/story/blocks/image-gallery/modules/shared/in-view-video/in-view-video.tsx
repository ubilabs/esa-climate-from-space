import { FunctionComponent, useEffect, useState, useRef } from "react";
import { useInView } from "motion/react";
import { useSelector } from "react-redux";
import { PlayIcon } from "../../../../../../../main/icons/play-icon";
import { languageSelector } from "../../../../../../../../selectors/language";

import styles from "./in-view-video.module.css";

interface InViewVideoProps {
  src: string;
  className?: string;
}

const getLocalizedTrackSrc = (src: string, language: string) => {
  const [srcWithoutHash, hash = ""] = src.split("#");
  const [srcWithoutQuery, query = ""] = srcWithoutHash.split("?");
  const extensionIndex = srcWithoutQuery.lastIndexOf(".");

  if (extensionIndex === -1) {
    return undefined;
  }

  const sourceName = srcWithoutQuery.slice(0, extensionIndex);
  const querySuffix = query ? `?${query}` : "";
  const hashSuffix = hash ? `#${hash}` : "";

  return `${sourceName}-${language}.vtt${querySuffix}${hashSuffix}`;
};

const InViewVideo: FunctionComponent<InViewVideoProps> = ({
  src,
  className,
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref);
  const [isPaused, setIsPaused] = useState(true);

  // automatically pause when leaving the viewport
  useEffect(() => {
    const video = ref.current;

    if (!video) {
      return;
    }

    if (!isInView) {
      video.pause();
    }
  }, [isInView]);

  // control video via custom button
  useEffect(() => {
    const video = ref.current;

    if (!video) {
      return;
    }

    const updatePauseState = () => {
      setIsPaused(video.paused);
    };

    updatePauseState();

    video.addEventListener("play", updatePauseState);
    video.addEventListener("pause", updatePauseState);
    video.addEventListener("ended", updatePauseState);

    return () => {
      video.removeEventListener("play", updatePauseState);
      video.removeEventListener("pause", updatePauseState);
      video.removeEventListener("ended", updatePauseState);
    };
  }, []);

  const selectedLanguage = useSelector(languageSelector) ?? "en";
  const localizedTrackSrc = getLocalizedTrackSrc(src, selectedLanguage);

  const handlePlay = () => {
    const video = ref.current;

    if (!video) {
      return;
    }

    void video.play().catch(() => undefined);
  };

  return (
    <div className={styles.container}>
      <video
        ref={ref}
        className={className}
        src={src}
        muted
        controls
        playsInline
      >
        {localizedTrackSrc && (
          <track
            kind="captions"
            src={localizedTrackSrc}
            srcLang={selectedLanguage}
            label={selectedLanguage}
            default
          />
        )}
      </video>
      {isPaused && (
        <button
          type="button"
          className={styles.playButton}
          onClick={handlePlay}
          aria-label="Play video"
        >
          <PlayIcon />
        </button>
      )}
    </div>
  );
};

export default InViewVideo;
