import {useState, useEffect, useRef, RefObject} from 'react';

const useIsInViewport = (ref: RefObject<HTMLElement>, threshold = 1) => {
  const [isInViewport, setIsInViewport] = useState(false);

  const observer = useRef(
    new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      {threshold}
    )
  );

  useEffect(() => {
    const currentRef = ref.current;
    const currentObserver = observer.current;

    if (currentRef) {
      currentObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        currentObserver.unobserve(currentRef);
      }
    };
  }, [ref]);

  return isInViewport;
};

export default useIsInViewport;
