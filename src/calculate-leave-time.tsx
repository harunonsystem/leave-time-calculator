import React, { useState, useEffect } from "react";
import { Action, ActionPanel, Icon, List, getPreferenceValues, Color } from "@raycast/api";
import type { Preferences } from "./lib/types";
import { getLanguage } from "./lib/translations";
import { calculateLeaveTime, calculateRemainingTime } from "./lib/time-utils";
import { getTodayStartTime, setTodayStartTime, clearTodayStartTime } from "./lib/storage";

const t = {
  ja: {
    today: "📅 今日の予定",
    selectStart: "⏰ 出勤時間を選択",
    remaining: (h: number, m: number) => `あと ${h}時間${m}分`,
    finished: "お疲れ様でした！",
    leave: (time: string) => `🏠 ${time} 退勤`,
    start: (time: string) => `${time}`,
    clear: "リセット",
    settings: "⚙️ 設定",
    workBreak: (w: number, b: number) => `勤務${w}h 休憩${b}m`,
    searchBarPlaceholder: "時間を入力 (例: 9:21)",
  },
  en: {
    today: "📅 Today",
    selectStart: "⏰ Select Start Time",
    remaining: (h: number, m: number) => `${h}h ${m}m left`,
    finished: "Done for today!",
    leave: (time: string) => `🏠 Leave at ${time}`,
    start: (time: string) => `${time}`,
    clear: "Reset",
    settings: "⚙️ Settings",
    workBreak: (w: number, b: number) => `Work ${w}h Break ${b}m`,
    searchBarPlaceholder: "Enter time (e.g., 9:21)",
  },
};

function generateStartTimes(): string[] {
  const times: string[] = [];
  for (let h = 7; h <= 13; h++) {
    for (const m of [0, 15, 30, 45]) {
      times.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
  }
  return times;
}

export default function Command() {
  const prefs = getPreferenceValues<Preferences>();
  const workHours = parseFloat(prefs.defaultWorkHours || "8");
  const breakMins = parseInt(prefs.defaultBreakMinutes || "60");
  const lang = getLanguage(prefs.language || "system");
  const labels = t[lang];

  const [todayStart, setTodayStart] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getTodayStartTime().then((time) => {
      setTodayStart(time);
      setIsLoading(false);
    });
  }, []);

  const handleSelect = async (startTime: string) => {
    await setTodayStartTime(startTime);
    setTodayStart(startTime);
  };

  const handleClear = async () => {
    await clearTodayStartTime();
    setTodayStart(null);
  };

  // カスタム時間のパース（9:21 や 09:21 形式）
  const parseCustomTime = (input: string): string | null => {
    const match = input.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const h = parseInt(match[1]);
    const m = parseInt(match[2]);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const customTime = parseCustomTime(searchText);

  // 今日の退勤時間と残り時間を計算
  const leaveTime = todayStart ? calculateLeaveTime(todayStart, workHours, breakMins, lang) : null;
  const remaining = leaveTime ? calculateRemainingTime(leaveTime, todayStart, lang) : null;

  const startTimes = generateStartTimes();
  const filteredTimes = searchText
    ? startTimes.filter((t) => t.includes(searchText))
    : startTimes;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={labels.searchBarPlaceholder}
      onSearchTextChange={setSearchText}
    >
      {/* 今日の予定（設定済みの場合） */}
      {todayStart && leaveTime && remaining && (
        <List.Section title={labels.today}>
          <List.Item
            title={labels.leave(leaveTime)}
            subtitle={remaining.isPast ? labels.finished : labels.remaining(remaining.hours, remaining.minutes)}
            icon={{ source: Icon.Clock, tintColor: remaining.isPast ? Color.Green : Color.Blue }}
            accessories={[
              { tag: { value: todayStart, color: Color.SecondaryText } },
              { tag: { value: labels.workBreak(workHours, breakMins), color: Color.SecondaryText } },
            ]}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard title="Copy" content={leaveTime} />
                <Action title={labels.clear} icon={Icon.Trash} style={Action.Style.Destructive} onAction={handleClear} />
              </ActionPanel>
            }
          />
        </List.Section>
      )}

      {/* カスタム時間（入力が有効な場合） */}
      {customTime && !startTimes.includes(customTime) && (
        <List.Section title={lang === "ja" ? "✏️ カスタム時間" : "✏️ Custom Time"}>
          <List.Item
            title={customTime}
            icon={{ source: Icon.Plus, tintColor: Color.Orange }}
            accessories={[
              { text: `→ ${calculateLeaveTime(customTime, workHours, breakMins, lang)}` },
            ]}
            actions={
              <ActionPanel>
                <Action title="Select" icon={Icon.Check} onAction={() => handleSelect(customTime)} />
              </ActionPanel>
            }
          />
        </List.Section>
      )}

      {/* 出勤時間選択 */}
      <List.Section title={labels.selectStart}>
        {filteredTimes.map((time) => {
          const leave = calculateLeaveTime(time, workHours, breakMins, lang);
          const rem = calculateRemainingTime(leave, time, lang);
          const isSelected = time === todayStart;

          return (
            <List.Item
              key={time}
              title={labels.start(time)}
              icon={isSelected ? { source: Icon.CheckCircle, tintColor: Color.Green } : Icon.Circle}
              accessories={[
                { text: `→ ${leave}` },
                { tag: rem.isPast ? "✓" : labels.remaining(rem.hours, rem.minutes) },
              ]}
              actions={
                <ActionPanel>
                  <Action title="Select" icon={Icon.Check} onAction={() => handleSelect(time)} />
                  <Action.CopyToClipboard title="Copy Leave Time" content={leave} />
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>
    </List>
  );
}
