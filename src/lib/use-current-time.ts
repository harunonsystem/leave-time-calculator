import { useEffect, useState } from "react";
import { getCurrentTime } from "./time-utils";

export function useCurrentTime(intervalMs = 60000): string {
  const [currentTime, setCurrentTime] = useState(getCurrentTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return currentTime;
}
