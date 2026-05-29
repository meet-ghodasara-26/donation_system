import { useState, useEffect, useRef } from 'react';

/**
 * Hook that animates a number from 0 to a target value
 * @param {number} target - The target number to animate to
 * @param {number} duration - Animation duration in ms (default: 1500)
 */
export function useAnimatedCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (target === prevTarget.current) return;

    const startValue = prevTarget.current;
    const endValue = target;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * eased);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevTarget.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}
