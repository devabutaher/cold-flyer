import { useEffect, useState } from "react";

export function useCounter({ end, started }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        setVal(end);
        clearInterval(timer);
      } else {
        setVal(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, end]);

  return val;
}
