import React, {FunctionComponent, useEffect, useRef} from 'react';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import {getStoryAssetUrl} from '../../../libs/get-story-asset-urls';

import {Language} from '../../../types/language';

import 'video.js/dist/video-js.css';

interface Props {
  storyId: string;
  videoSrc: string;
  language: Language;
  isStoryMode: boolean;
  videoCaptions?: string;
  videoPoster?: string;
}

const VideoJS: FunctionComponent<Props> = ({
  storyId,
  videoSrc,
  language,
  isStoryMode,
  videoCaptions,
  videoPoster
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef<videojs.Player | null>();
  const videoUrl = videoSrc && getStoryAssetUrl(storyId, videoSrc);
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

  const handlePlayerReady = (player: videojs.Player) => {
    playerRef.current = player;
  };

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) {
        return;
      }

      const player: videojs.Player = (playerRef.current = videojs(
        videoElement,
        videoJsOptions,
        () => handlePlayerReady(player)
      ));
    }
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
      />
    </div>
  );
};

export default VideoJS;
