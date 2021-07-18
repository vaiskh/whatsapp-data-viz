import { useEffect, useState } from 'react';

/**
 * Functions reacts to size changes of an html element , preferably a div
 * @param {HTMLInputElement | null} ref Reference to the html element whose size changes we are observing
 * @return {string[]} Dimensions of the html object
 */

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      // console.log(entries);
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });

    resizeObserver.observe(observeTarget);
    // Cleanup function
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

export default useResizeObserver;
