import type { WorkPreferences } from "./preferences";
import type { LeaveStatus } from "./types";
import { calculateLeaveTime, calculateRemainingTime } from "./time-utils";

export type { LeaveStatus, RemainingTime } from "./types";

export function buildLeaveStatus(
  startTime: string,
  workHours: number,
  breakMinutes: number,
  currentTime?: string,
): LeaveStatus {
  const leaveTime = calculateLeaveTime(startTime, workHours, breakMinutes);
  const remaining = calculateRemainingTime(leaveTime, startTime, currentTime);
  return { leaveTime, remaining };
}

export function buildLeaveStatusFromPreferences(
  startTime: string,
  preferences: WorkPreferences,
  currentTime?: string,
): LeaveStatus {
  return buildLeaveStatus(
    startTime,
    preferences.workHours,
    preferences.breakMinutes,
    currentTime,
  );
}

export function leavePreviewFromStatus(status: LeaveStatus): { text: string } {
  return { text: `→ ${status.leaveTime}` };
}

export function leavePreviewAccessory(
  startTime: string,
  preferences: WorkPreferences,
): { text: string } {
  return leavePreviewFromStatus(
    buildLeaveStatusFromPreferences(startTime, preferences),
  );
}

export function formatRemainingLabel(
  remaining: LeaveStatus["remaining"],
): string {
  return remaining.isPast
    ? `${remaining.hours}h ${remaining.minutes}m overtime`
    : `${remaining.hours}h ${remaining.minutes}m left`;
}

export function formatTopSubtitle(status: LeaveStatus): string {
  return `${status.leaveTime} leave - ${formatRemainingLabel(status.remaining)}`;
}
