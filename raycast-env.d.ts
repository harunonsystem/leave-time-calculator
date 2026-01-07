/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `calculate-leave-time` command */
  export type CalculateLeaveTime = ExtensionPreferences & {
  /** Default Work Hours - Default work hours per day (e.g., 8, 9) */
  "defaultWorkHours": string,
  /** Default Break Minutes - Default break time in minutes (e.g., 60) */
  "defaultBreakMinutes": string,
  /** Language / 言語 - Display language (System: auto-detect from macOS) */
  "language": "system" | "en" | "ja"
}
}

declare namespace Arguments {
  /** Arguments passed to the `calculate-leave-time` command */
  export type CalculateLeaveTime = {}
}

