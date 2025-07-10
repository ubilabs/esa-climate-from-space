import { useEffect } from "react";
import { useParallaxController } from "react-scroll-parallax";
import { useLocation } from "react-router-dom";

export function useUpdateControllerOnRouteChange() {
  const location = useLocation();
  const parallaxController = useParallaxController();

  useEffect(() => {
    parallaxController?.update();
  }, [location.pathname, parallaxController]);

  useEffect(() => {
    return () => {
      parallaxController?.destroy();
    };
  }, [parallaxController]);
}