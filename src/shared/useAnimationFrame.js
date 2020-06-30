import { useEffect, useRef} from "react";

const useAnimationFrame = (callback, cancel) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    if (cancel) {
      cancelAnimationFrame(requestRef.current);
    } else {
      const animate = (time) => {
        if (previousTimeRef.current !== undefined) {
          const deltaTime = time - previousTimeRef.current;
          callback(deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
      };

      requestRef.current = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [callback, cancel]); // Make sure the effect runs only once
};

export default useAnimationFrame;
