import { getPreferenceValues } from "@raycast/api";

export type WorkPreferences = {
	workHours: number;
	breakMinutes: number;
};

// Both commands (calculate-leave-time, calculate-leave-time-view) share
// identical preference definitions in package.json. Keep them in sync.
type CommandPreferences = Preferences.CalculateLeaveTime;

export function getWorkPreferences(): WorkPreferences {
	const prefs = getPreferenceValues<CommandPreferences>();
	return {
		workHours: parseFloat(prefs.defaultWorkHours || "8"),
		breakMinutes: parseInt(prefs.defaultBreakMinutes || "60", 10),
	};
}
