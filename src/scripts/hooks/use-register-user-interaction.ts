import { useEffect, useState } from "react";

export const useRegisterUserInteraction = (): boolean => {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (hasInteracted) return;

    const handleInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener("wheel", handleInteraction);
    window.addEventListener("click", handleInteraction);

    return () => {
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("click", handleInteraction);
    };
  }, [hasInteracted]);

  return hasInteracted;
};
