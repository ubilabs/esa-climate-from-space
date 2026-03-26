import { useEffect, useState } from "react";

export const useRegisterUserInteraction = (): boolean => {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (hasInteracted) return;

    const handleInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener("wheel", handleInteraction);
    window.addEventListener("pointermove", handleInteraction);

    return () => {
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("pointermove", handleInteraction);
    };
  }, [hasInteracted]);

  return hasInteracted;
};
