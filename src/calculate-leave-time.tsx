import React, { useState } from "react";
import { Action, ActionPanel, Icon, List, getPreferenceValues } from "@raycast/api";

interface Preferences {
  defaultWorkHours: string;
  defaultBreakMinutes: string;
}

interface TimeOption {
  startTime: string;
  leaveTime: string;
  workHours: number;
  breakMinutes: number;
}

function parseTime(timeStr: string): Date {
  const parts = timeStr.split(":").map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function calculateLeaveTime(startTime: string, workHours: number, breakMinutes: number): string {
  const start = parseTime(startTime);
  const totalMinutes = workHours * 60 + breakMinutes;
  const leave = new Date(start.getTime() + totalMinutes * 60000);
  return formatTime(leave);
}

function generateTimeOptions(workHours: number, breakMinutes: number): TimeOption[] {
  const options: TimeOption[] = [];
  const startHours = [7, 8, 9, 10, 11, 12, 13];

  startHours.forEach((hour) => {
    [0, 30].forEach((minute) => {
      const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const leaveTime = calculateLeaveTime(startTime, workHours, breakMinutes);
      options.push({
        startTime,
        leaveTime,
        workHours,
        breakMinutes,
      });
    });
  });

  return options;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const defaultWorkHours = parseFloat(preferences.defaultWorkHours || "9");
  const defaultBreakMinutes = parseInt(preferences.defaultBreakMinutes || "60");

  const [workHours, setWorkHours] = useState(defaultWorkHours);
  const [breakMinutes, setBreakMinutes] = useState(defaultBreakMinutes);
  const [searchText, setSearchText] = useState("");

  const timeOptions = generateTimeOptions(workHours, breakMinutes);

  const filteredOptions = timeOptions.filter(
    (option) =>
      option.startTime.includes(searchText) ||
      option.leaveTime.includes(searchText)
  );

  return (
    <List
      searchBarPlaceholder="Search start time... (e.g., 09:00)"
      onSearchTextChange={setSearchText}
      searchText={searchText}
      throttle
    >
      <List.Section title="Settings">
        <List.Item
          title={`Work Hours: ${workHours}h | Break: ${breakMinutes}min`}
          subtitle="Click to adjust"
          icon={Icon.Gear}
          actions={
            <ActionPanel>
              <ActionPanel.Section title="Adjust Work Hours">
                <Action
                  title="Set 8 Hours"
                  onAction={() => setWorkHours(8)}
                  icon={Icon.Clock}
                />
                <Action
                  title="Set 9 Hours (Default)"
                  onAction={() => setWorkHours(9)}
                  icon={Icon.Clock}
                />
                <Action
                  title="Set 10 Hours"
                  onAction={() => setWorkHours(10)}
                  icon={Icon.Clock}
                />
              </ActionPanel.Section>
              <ActionPanel.Section title="Adjust Break Time">
                <Action
                  title="No Break"
                  onAction={() => setBreakMinutes(0)}
                  icon={Icon.Circle}
                />
                <Action
                  title="30 Minutes"
                  onAction={() => setBreakMinutes(30)}
                  icon={Icon.Circle}
                />
                <Action
                  title="60 Minutes (Default)"
                  onAction={() => setBreakMinutes(60)}
                  icon={Icon.Circle}
                />
                <Action
                  title="90 Minutes"
                  onAction={() => setBreakMinutes(90)}
                  icon={Icon.Circle}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      </List.Section>
      <List.Section title="Leave Time Calculator">
        {filteredOptions.map((option, index) => (
          <List.Item
            key={index}
            title={option.startTime}
            subtitle={`→ Leave at ${option.leaveTime}`}
            icon={Icon.Clock}
            accessories={[
              {
                text: `${option.workHours}h + ${option.breakMinutes}m`,
              },
            ]}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard
                  title="Copy Leave Time"
                  content={option.leaveTime}
                />
                <Action.CopyToClipboard
                  title="Copy Full Info"
                  content={`Start: ${option.startTime} → Leave: ${option.leaveTime} (${option.workHours}h work + ${option.breakMinutes}m break)`}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
