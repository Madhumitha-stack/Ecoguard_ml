import React, { useState, useEffect } from 'react';

export default function AnimatedCounter({ value, duration = 1200, format = (v) => v }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = parseFloat(value);
    
    if (isNaN(endValue)) {
      setCount(value);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing curve (ease-out-quad)
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * endValue;
      
      setCount(currentVal);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  // Round values appropriately
  const displayVal = Number.isInteger(parseFloat(value)) 
    ? Math.round(count) 
    : parseFloat(count.toFixed(1));

  return <span>{format(displayVal)}</span>;
}
