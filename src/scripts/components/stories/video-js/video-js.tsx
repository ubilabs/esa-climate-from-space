import React, {FunctionComponent, useEffect, useRef} from 'react';
import videojs, {VideoJsPlayer, VideoJsPlayerOptions} from 'video.js';
import {getStoryAssetUrl} from '../../../libs/get-story-asset-urls';

import {Language} from '../../../types/language';
import {VideoResolution} from '../../../types/video-resolution-type';

import 'video.js/dist/video-js.css';

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
  onPlay
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef<VideoJsPlayer | null>();
  const video = videoSrc[0];
  const videoUrl = videoSrc && getStoryAssetUrl(storyId, video);
  const captionsUrl = videoCaptions && getStoryAssetUrl(storyId, videoCaptions);
  const posterUrl = videoPoster && getStoryAssetUrl(storyId, videoPoster);

  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: isStoryMode ? false : true,
    controls: true,
    responsive: true,
    fluid: true,
    aspectRatio: '4:3',
    poster: posterUrl,
    sources: [
      {
        src: videoUrl,
        type: 'video/mp4'
      }
    ],
    tracks: [
      {
        srclang: language,
        kind: 'captions',
        src: captionsUrl,
        default: true
      }
    ]
  };

  const getVideoResolution = (player: VideoJsPlayer, videoRes: string) => {
    const currentResVideo = videoSrc.find(src => src.includes(videoRes));

    if (currentResVideo) {
      const mobileVideoUrl = getStoryAssetUrl(storyId, currentResVideo);
      mobileVideoUrl && player.src(mobileVideoUrl);
    }
  };

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player;

    const mobile = window.matchMedia('(max-width: 480px)');
    const screenHD = window.matchMedia('(max-width: 1280px)');
    const screen4k = window.matchMedia('(max-width: 3840px)');

    if (mobile.matches) {
      getVideoResolution(player, VideoResolution.SD576);
    } else if (screenHD.matches) {
      getVideoResolution(player, VideoResolution.HD720);
    } else if (screen4k.matches) {
      getVideoResolution(player, VideoResolution.HD1080);
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
        () => handlePlayerReady(player)
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
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        style={{height: '100%'}}
        onPlay={event => onPlay((event.target as unknown) as VideoJsPlayer)}
      />
    </div>
  );
};

export default VideoJS;
