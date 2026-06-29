import { LaunchType, launchCommand, updateCommandMetadata } from "@raycast/api";
import {
  buildLeaveStatusFromPreferences,
  formatTopSubtitle,
} from "./leave-status";
import { getWorkPreferences } from "./preferences";
import { getTodayStartTime } from "./storage";
import { getCurrentTime } from "./time-utils";

export async function refreshTopCommandSubtitle() {
  try {
    await launchCommand({
      name: "calculate-leave-time",
      type: LaunchType.Background,
    });
  } catch (error) {
    console.error("Failed to refresh command subtitle:", error);
  }
}

export async function updateCurrentCommandSubtitle() {
  const preferences = getWorkPreferences();
  const todayStart = await getTodayStartTime();

  if (!todayStart) {
    await updateCommandMetadata({ subtitle: "" });
    return;
  }

  const status = buildLeaveStatusFromPreferences(
    todayStart,
    preferences,
    getCurrentTime(),
  );
  await updateCommandMetadata({ subtitle: formatTopSubtitle(status) });
}
