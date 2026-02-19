# Bug Fix: コマンドリストのsubtitleが更新されない問題

## 問題
時間を設定後、Raycastを久々に開くとコマンドリスト上のsubtitle（「8h 59m left」など）が更新されない。コマンドを開くと正しい時間が表示される。

## 原因

`package.json` に `"interval": "1m"` が設定されているが、コードが**バックグラウンド実行**を考慮していない。

Raycastの `interval` 機能：
- 指定間隔でコマンドをバックグラウンド実行する
- `environment.launchType === "background"` で判定可能
- バックグラウンド時はUIをレンダリングせず、`updateCommandMetadata` だけ呼ぶべき

現在のコードは `launchType` をチェックしていないため、バックグラウンド実行時もUIコンポーネント全体をレンダリングしようとしている。

## 修正内容

### ファイル: `src/calculate-leave-time.tsx`

1. `environment` をインポート
2. バックグラウンド実行時は subtitle を更新して早期リターン

```tsx
import {
    Action,
    ActionPanel,
    Color,
    environment,  // 追加
    getPreferenceValues,
    Icon,
    List,
    updateCommandMetadata,
} from "@raycast/api";

// ...

export default function Command() {
    const prefs = getPreferenceValues<Preferences.CalculateLeaveTime>();
    const workHours = parseFloat(prefs.defaultWorkHours || "8");
    const breakMins = parseInt(prefs.defaultBreakMinutes || "60", 10);

    // Background execution: update subtitle only, no UI
    if (environment.launchType === "background") {
        getTodayStartTime().then(async (todayStart) => {
            if (todayStart) {
                const leave = calculateLeaveTime(todayStart, workHours, breakMins);
                const rem = calculateRemainingTime(leave, todayStart);
                const subtitle = rem.isPast
                    ? `${rem.hours}h ${rem.minutes}m overtime`
                    : `${leave} leave - ${rem.hours}h ${rem.minutes}m left`;
                await updateCommandMetadata({ subtitle });
            } else {
                await updateCommandMetadata({ subtitle: "" });
            }
        });
        return null;  // No UI for background execution
    }

    // 以下、既存のUI実装...
```

## 検証方法

1. `bun run dev` で開発モードを起動
2. Raycast で時刻を設定
3. Raycast を閉じて1分以上待つ
4. Raycast を再度開く（コマンドは選択しない）
5. コマンドリスト上のsubtitleが正しい残り時間に更新されていることを確認
