import { FunctionComponent, useEffect, useRef } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";

import { getStoryAssetUrl } from "../../../libs/get-story-asset-urls";
import { Language } from "../../../types/language";
import { VideoResolution } from "../../../types/video-resolution-type";

import "video.js/dist/video-js.css";
import styles from "./video-js.module.css";

interface Props {
  storyId: string;
  videoSrc: string[];
  language: Language;
  isStoryMode: boolean;
  videoCaptions?: string;
  videoPoster?: string;
  onPlay: (player: VideoJsPlayer) => void;
}

const VideoJS: FunctionComponent<Props> = ({
  storyId,
  videoSrc,
  language,
  isStoryMode,
  videoCaptions,
  videoPoster,
  onPlay,
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef<VideoJsPlayer | null>();
  const video = videoSrc[0];
  const videoUrl = videoSrc && getStoryAssetUrl(storyId, video);
  const posterUrl = videoPoster && getStoryAssetUrl(storyId, videoPoster);

  const getCaptionUrl = () => {
    const captions = videoCaptions?.split(".");
    const captionLanguagePath =
      captions && `${captions[0]}-${language}.${captions[1]}`;
    return (
      captionLanguagePath && getStoryAssetUrl(storyId, captionLanguagePath)
    );
  };

  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: isStoryMode ? false : true,
    controls: true,
    // Make sure subtitles are handled by video.js and displayed consistently across browsers
    html5: {
      nativeTextTracks: false,
    },
    responsive: true,
    aspectRatio: "4:3",
    poster: posterUrl,
    sources: [
      {
        src: videoUrl,
        type: "video/mp4",
      },
    ],
  };

  const getVideoResolution = (player: VideoJsPlayer, videoRes: string) => {
    const webVideo = video.split("web");
    const currentResVideo = webVideo[0] + videoRes + webVideo[1];

    if (currentResVideo) {
      const mobileVideoUrl = getStoryAssetUrl(storyId, currentResVideo);
      if (mobileVideoUrl) {
        player.src(mobileVideoUrl);
      }
    }
  };

  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attr-media
  // takes the provided video file name and selects a resolution based on media queries
  const handlePlayerReady = (player: VideoJsPlayer) => {
    // Caption needs to be added after player is ready
    const textTrack = player?.addRemoteTextTrack(
      {
        kind: "captions",
        src: getCaptionUrl(),
        srclang: language,
        label: language,
      },
      true,
    );

    // Show subtitles by default but only if the language is not English
    if (textTrack && textTrack.track && language !== "en") {
      textTrack.track.mode = "showing";
    }

    playerRef.current = player;

    const mobile = window.matchMedia("(max-width: 480px)");
    const screenHD = window.matchMedia("(max-width: 1280px)");
    const screen4k = window.matchMedia("(max-width: 3840px)");

    if (mobile.matches) {
      getVideoResolution(player, VideoResolution.SD576);
    } else if (screenHD.matches) {
      getVideoResolution(player, VideoResolution.HD720);
    } else if (screen4k.matches) {
      getVideoResolution(player, VideoResolution.HD1080);
    } else {
      getVideoResolution(player, VideoResolution.web);
    }
  };

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) {
        return;
      }

      const player: VideoJsPlayer = (playerRef.current = videojs(
        videoElement,
        videoJsOptions,
        () => handlePlayerReady(player),
      ));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoJsOptions, videoRef]);

  // Dispose the Video.js player when component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className={styles.vjsContainer}>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        style={{ height: "100%" }}
        onPlay={(event) => onPlay(event.target as unknown as VideoJsPlayer)}
      >
        <track kind="captions" src={getCaptionUrl()} srclang={language} label={language} />
      </video>
    </div>
  );
};

export default VideoJS;
