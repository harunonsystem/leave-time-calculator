import { Color, Icon, List, Toast, showToast } from "@raycast/api";
import React, { useState } from "react";
import { SelectStartTimeActions, TodayActions } from "./lib/leave-action-panel";
import {
  buildLeaveStatusFromPreferences,
  formatRemainingLabel,
  leavePreviewAccessory,
  leavePreviewFromStatus,
} from "./lib/leave-status";
import { getWorkPreferences, type WorkPreferences } from "./lib/preferences";
import { refreshTopCommandSubtitle } from "./lib/subtitle";
import { buildDefaultStartTimes, parseCustomTime } from "./lib/time-utils";
import { useCurrentTime } from "./lib/use-current-time";
import { useTodayStartTime } from "./lib/use-today-start-time";

const START_TIMES = buildDefaultStartTimes();

type StartNowSectionProps = {
  currentTime: string;
  preferences: WorkPreferences;
  onSelect: (startTime: string) => void;
};

function StartNowSection(props: StartNowSectionProps) {
  const nowStatus = buildLeaveStatusFromPreferences(
    props.currentTime,
    props.preferences,
    props.currentTime,
  );

  return (
    <List.Section title="🚀 Start Now">
      <List.Item
        title={`Now (${props.currentTime})`}
        icon={{ source: Icon.Clock, tintColor: Color.Green }}
        accessories={[leavePreviewFromStatus(nowStatus)]}
        actions={
          <SelectStartTimeActions
            leaveTime={nowStatus.leaveTime}
            onSelect={() => props.onSelect(props.currentTime)}
          />
        }
      />
    </List.Section>
  );
}

export default function Command() {
  const preferences = getWorkPreferences();
  const { todayStart, isLoading, selectStartTime, clearStartTime } =
    useTodayStartTime();
  const [searchText, setSearchText] = useState("");
  const currentTime = useCurrentTime();

  const handleSelect = async (startTime: string) => {
    try {
      await selectStartTime(startTime);
      await refreshTopCommandSubtitle();
    } catch (error) {
      console.error("Failed to save start time:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to save start time",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const handleClear = async () => {
    try {
      await clearStartTime();
      await refreshTopCommandSubtitle();
    } catch (error) {
      console.error("Failed to clear start time:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to clear start time",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const parsedCustomTime = parseCustomTime(searchText);
  const customStartTime =
    parsedCustomTime && !START_TIMES.includes(parsedCustomTime)
      ? parsedCustomTime
      : null;
  const customStatus = customStartTime
    ? buildLeaveStatusFromPreferences(customStartTime, preferences, currentTime)
    : null;
  const todayStatus = todayStart
    ? buildLeaveStatusFromPreferences(todayStart, preferences, currentTime)
    : null;

  const filteredTimes = searchText
    ? START_TIMES.filter((time) => time.includes(searchText))
    : START_TIMES;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Enter time (e.g., 9:21)"
      onSearchTextChange={setSearchText}
    >
      {todayStatus && todayStart && (
        <List.Section title="📅 Today">
          <List.Item
            key="today"
            title={`🏠 Leave at ${todayStatus.leaveTime}`}
            subtitle={formatRemainingLabel(todayStatus.remaining)}
            icon={{
              source: Icon.Clock,
              tintColor: todayStatus.remaining.isPast
                ? Color.Orange
                : Color.Blue,
            }}
            accessories={[
              { tag: { value: todayStart, color: Color.SecondaryText } },
              {
                tag: {
                  value: `Work ${preferences.workHours}h Break ${preferences.breakMinutes}m`,
                  color: Color.SecondaryText,
                },
              },
            ]}
            actions={
              <TodayActions
                leaveTime={todayStatus.leaveTime}
                onClear={handleClear}
              />
            }
          />
        </List.Section>
      )}

      {!searchText && (
        <StartNowSection
          currentTime={currentTime}
          preferences={preferences}
          onSelect={handleSelect}
        />
      )}

      {customStatus && customStartTime && (
        <List.Section title="✏️ Custom Time">
          <List.Item
            title={customStartTime}
            icon={{ source: Icon.Plus, tintColor: Color.Orange }}
            accessories={[leavePreviewAccessory(customStartTime, preferences)]}
            actions={
              <SelectStartTimeActions
                leaveTime={customStatus.leaveTime}
                onSelect={() => handleSelect(customStartTime)}
                showCopy={false}
              />
            }
          />
        </List.Section>
      )}

      <List.Section title="⏰ Select Start Time">
        {filteredTimes.map((time) => {
          const status = buildLeaveStatusFromPreferences(
            time,
            preferences,
            currentTime,
          );
          const isSelected = time === todayStart;

          return (
            <List.Item
              key={time}
              title={time}
              icon={
                isSelected
                  ? { source: Icon.CheckCircle, tintColor: Color.Green }
                  : Icon.Circle
              }
              accessories={[
                leavePreviewFromStatus(status),
                {
                  tag: status.remaining.isPast
                    ? "✓"
                    : formatRemainingLabel(status.remaining),
                },
              ]}
              actions={
                <SelectStartTimeActions
                  leaveTime={status.leaveTime}
                  onSelect={() => handleSelect(time)}
                />
              }
            />
          );
        })}
      </List.Section>
    </List>
  );
}
