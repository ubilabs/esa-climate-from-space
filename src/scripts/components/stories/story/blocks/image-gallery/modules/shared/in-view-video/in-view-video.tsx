import { FunctionComponent, useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { useSelector } from "react-redux";
import { languageSelector } from "../../../../../../../../selectors/language";

interface InViewVideoProps {
  src: string;
  className?: string;
  trackSrc?: string;
}

const InViewVideo: FunctionComponent<InViewVideoProps> = ({
  src,
  className,
  trackSrc,
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    const video = ref.current;

    if (!video) {
      return;
    }

    if (isInView) {
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
  }, [isInView]);

  const selectedLanguage = useSelector(languageSelector) ?? "en";

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      autoPlay
      muted
      controls
      playsInline
    >
      {trackSrc && (
        <track
          kind="captions"
          src={trackSrc}
          srcLang={selectedLanguage}
          label={selectedLanguage}
          default
        />
      )}
    </video>
  );
};

export default InViewVideo;
