import type { Language, TimeOption } from "./types";

function parseTime(timeStr: string): Date {
  const parts = timeStr.split(":").map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function formatTime(date: Date, lang: Language): string {
  const locale = lang === "ja" ? "ja-JP" : "en-US";
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function getCurrentTime(lang: Language): string {
  return formatTime(new Date(), lang);
}

export function calculateLeaveTime(
  startTime: string,
  workHours: number,
  breakMinutes: number,
  lang: Language
): string {
  const start = parseTime(startTime);
  const totalMinutes = workHours * 60 + breakMinutes;
  const leave = new Date(start.getTime() + totalMinutes * 60000);
  return formatTime(leave, lang);
}

export function calculateRemainingTime(
  leaveTime: string,
  startTime: string | null,
  lang: Language
): { hours: number; minutes: number; isPast: boolean; formatted: string } {
  const now = new Date();
  let leave = parseTime(leaveTime);

  // 出勤時間がある場合、退勤が出勤より前なら翌日と判断
  if (startTime) {
    const start = parseTime(startTime);
    if (leave < start) {
      // 退勤時刻が出勤時刻より前 = 日をまたぐシフト
      // ただし、今が出勤時刻より前（深夜帯）なら、すでに翌日にいるので+24時間は不要
      if (now >= start) {
        // まだ出勤日の日中〜夜 → 退勤は明日
        leave = new Date(leave.getTime() + 24 * 60 * 60 * 1000);
      }
      // now < start の場合: 深夜帯にいる → leaveはそのまま今日
    }
  }

  const diffMs = leave.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);
  const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
  const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));

  let formatted: string;
  if (lang === "ja") {
    formatted = isPast ? `${hours}時間${minutes}分 残業中` : `あと ${hours}時間${minutes}分`;
  } else {
    formatted = isPast ? `${hours}h ${minutes}m overtime` : `${hours}h ${minutes}m left`;
  }

  return { hours, minutes, isPast, formatted };
}

const START_HOURS = [7, 8, 9, 10, 11, 12, 13] as const;
const MINUTE_OPTIONS = [0, 15, 30, 45] as const;

export function generateTimeOptions(
  workHours: number,
  breakMinutes: number,
  lang: Language
): TimeOption[] {
  return START_HOURS.flatMap((hour) =>
    MINUTE_OPTIONS.map((minute) => {
      const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      return {
        startTime,
        leaveTime: calculateLeaveTime(startTime, workHours, breakMinutes, lang),
        workHours,
        breakMinutes,
      };
    })
  );
}
