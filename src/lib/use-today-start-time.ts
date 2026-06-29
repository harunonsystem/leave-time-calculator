import { useEffect, useState } from "react";
import {
  clearTodayStartTime,
  getTodayStartTime,
  setTodayStartTime,
} from "./storage";

export function useTodayStartTime() {
  const [todayStart, setTodayStart] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTodayStartTime()
      .then((time) => {
        setTodayStart(time);
      })
      .catch((error) => {
        console.error("Failed to load today's start time:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const selectStartTime = async (startTime: string) => {
    await setTodayStartTime(startTime);
    setTodayStart(startTime);
  };

  const clearStartTime = async () => {
    await clearTodayStartTime();
    setTodayStart(null);
  };

  return { todayStart, isLoading, selectStartTime, clearStartTime };
}
