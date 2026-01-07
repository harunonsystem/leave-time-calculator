import type { Language } from "./types";

export const translations = {
  ja: {
    searchPlaceholder: "出勤時間を検索... (例: 09:00)",
    settings: "設定",
    currentTime: "現在時刻",
    today: "今日",
    todaySchedule: (start: string, leave: string) => `${start} 出勤 → ${leave} 退勤`,
    setAsToday: "今日の出勤時間に設定",
    clearToday: "今日の記録をクリア",
    notSet: "未設定（出勤時間を選択してください）",
    workHoursBreak: (workHours: number, breakMinutes: number) =>
      `勤務${workHours}時間 + 休憩${breakMinutes}分`,
    clickToAdjust: "クリックして調整",
    adjustWorkHours: "勤務時間を調整",
    setHours: (hours: number) => `${hours}時間`,
    setHoursDefault: (hours: number) => `${hours}時間 (デフォルト)`,
    adjustBreakTime: "休憩時間を調整",
    noBreak: "休憩なし",
    minutes: (mins: number) => `${mins}分`,
    minutesDefault: (mins: number) => `${mins}分 (デフォルト)`,
    leaveTimeCalculator: "退勤時間一覧",
    startAt: (time: string) => `${time} 出勤`,
    leaveAt: (time: string) => `${time} 退勤`,
    copyLeaveTime: "退勤時間をコピー",
    copyFullInfo: "詳細をコピー",
    fullInfoFormat: (start: string, leave: string, workHours: number, breakMinutes: number) =>
      `出勤: ${start} → 退勤: ${leave} (勤務${workHours}時間 + 休憩${breakMinutes}分)`,
  },
  en: {
    searchPlaceholder: "Search start time... (e.g., 09:00)",
    settings: "Settings",
    currentTime: "Current Time",
    today: "Today",
    todaySchedule: (start: string, leave: string) => `${start} → Leave at ${leave}`,
    setAsToday: "Set as Today's Start Time",
    clearToday: "Clear Today's Record",
    notSet: "Not set (select your start time)",
    workHoursBreak: (workHours: number, breakMinutes: number) =>
      `${workHours}h work + ${breakMinutes}m break`,
    clickToAdjust: "Click to adjust",
    adjustWorkHours: "Adjust Work Hours",
    setHours: (hours: number) => `${hours} Hours`,
    setHoursDefault: (hours: number) => `${hours} Hours (Default)`,
    adjustBreakTime: "Adjust Break Time",
    noBreak: "No Break",
    minutes: (mins: number) => `${mins} Minutes`,
    minutesDefault: (mins: number) => `${mins} Minutes (Default)`,
    leaveTimeCalculator: "Leave Time List",
    startAt: (time: string) => `Start ${time}`,
    leaveAt: (time: string) => `Leave ${time}`,
    copyLeaveTime: "Copy Leave Time",
    copyFullInfo: "Copy Full Info",
    fullInfoFormat: (start: string, leave: string, workHours: number, breakMinutes: number) =>
      `Start: ${start} → Leave: ${leave} (${workHours}h work + ${breakMinutes}m break)`,
  },
} as const;

export type Translations = typeof translations.ja;

export function getSystemLanguage(): Language {
  const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  return systemLocale.startsWith("ja") ? "ja" : "en";
}

export function getLanguage(preference: "system" | "ja" | "en"): Language {
  return preference === "system" ? getSystemLanguage() : preference;
}

export function useTranslations(lang: Language) {
  return translations[lang];
}
