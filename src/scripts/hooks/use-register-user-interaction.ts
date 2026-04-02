import { useEffect, useState } from "react";

export const useRegisterUserInteraction = (): boolean => {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (hasInteracted) return;

    const handleInteraction = () => {
      setHasInteracted(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        handleInteraction();
      }
    };

    window.addEventListener("wheel", handleInteraction);
    window.addEventListener("touchend", handleInteraction);
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchend", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasInteracted]);

  return hasInteracted;
};
