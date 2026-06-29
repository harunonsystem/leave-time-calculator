import type { RemainingTime } from "./types";

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

type TimeParts = { hours: number; minutes: number };

function parseTimeParts(timeStr: string): TimeParts | null {
  const parts = timeStr.split(":").map(Number);
  const hours = parts[0];
  const minutes = parts[1];
  if (
    hours === undefined ||
    minutes === undefined ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }
  return { hours, minutes };
}

function applyTimeParts(date: Date, { hours, minutes }: TimeParts): Date {
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function parseTime(timeStr: string): Date {
  const parts = parseTimeParts(timeStr);
  if (!parts) {
    return applyTimeParts(new Date(), { hours: 0, minutes: 0 });
  }
  return applyTimeParts(new Date(), parts);
}

function getReferenceNow(currentTime?: string): Date {
  if (currentTime) {
    const parts = parseTimeParts(currentTime);
    if (parts) {
      return applyTimeParts(new Date(), parts);
    }
  }

  const now = new Date();
  now.setSeconds(0, 0);
  return now;
}

export function formatTime(date: Date): string {
  return formatTimeString(date.getHours(), date.getMinutes());
}

export function getCurrentTime(): string {
  return formatTime(new Date());
}

export function calculateLeaveTime(
  startTime: string,
  workHours: number,
  breakMinutes: number,
): string {
  const start = parseTime(startTime);
  const totalMinutes = workHours * 60 + breakMinutes;
  const leave = new Date(start.getTime() + totalMinutes * MS_PER_MINUTE);
  return formatTime(leave);
}

export function calculateRemainingTime(
  leaveTime: string,
  startTime: string | null,
  currentTime?: string,
): RemainingTime {
  const now = getReferenceNow(currentTime);
  let leave = parseTime(leaveTime);

  if (startTime) {
    const start = parseTime(startTime);
    if (leave < start && now >= start) {
      leave = new Date(leave.getTime() + MS_PER_DAY);
    }
  }

  const diffMs = leave.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);
  const hours = Math.floor(absDiffMs / MS_PER_HOUR);
  const minutes = Math.floor((absDiffMs % MS_PER_HOUR) / MS_PER_MINUTE);

  return { hours, minutes, isPast };
}

export function formatTimeString(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function parseCustomTime(input: string): string | null {
  const match = input.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = Number.parseInt(match[1], 10);
  const m = Number.parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return formatTimeString(h, m);
}

export function buildDefaultStartTimes(): string[] {
  const times: string[] = [];
  for (let h = 7; h <= 13; h++) {
    for (const m of [0, 15, 30, 45]) {
      times.push(formatTimeString(h, m));
    }
  }
  return times;
}
