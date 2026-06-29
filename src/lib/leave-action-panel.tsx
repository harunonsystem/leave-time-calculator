import { Action, ActionPanel, Icon } from "@raycast/api";
import React from "react";

type SelectStartTimeActionsProps = {
  leaveTime: string;
  onSelect: () => void;
  showCopy?: boolean;
};

export function SelectStartTimeActions(props: SelectStartTimeActionsProps) {
  return (
    <ActionPanel>
      <Action title="Select" icon={Icon.Check} onAction={props.onSelect} />
      {props.showCopy !== false && (
        <Action.CopyToClipboard
          title="Copy Leave Time"
          content={props.leaveTime}
        />
      )}
    </ActionPanel>
  );
}

type TodayActionsProps = {
  leaveTime: string;
  onClear: () => void;
};

export function TodayActions(props: TodayActionsProps) {
  return (
    <ActionPanel>
      <Action.CopyToClipboard title="Copy" content={props.leaveTime} />
      <Action
        title="Reset"
        icon={Icon.Trash}
        style={Action.Style.Destructive}
        onAction={props.onClear}
      />
    </ActionPanel>
  );
}
