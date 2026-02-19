# Code Review: no-view/view コマンド分離 + 時刻精度改善

## 変更概要

元の `calculate-leave-time` コマンド（`mode: "view"`）を2つに分離:
1. `calculate-leave-time` — `no-view` モードのバックグラウンドコマンド（subtitle更新 + view起動）
2. `calculate-leave-time-view` — `view` モードの詳細表示コマンド（元のUI）

加えて、ロジックの抽出・リファクタリング:
- `src/lib/leave-status.ts` — leave計算 + フォーマットのファサード
- `src/lib/preferences.ts` — preferences取得ヘルパー
- `src/lib/subtitle.ts` — subtitle更新ロジック
- `src/lib/time-utils.ts` — `getReferenceNow()` 追加（秒精度の丸め）

---

## Critical

なし。ロジック上の明確なバグは見当たりません。

---

## Suggestions

### 1. `preferences.ts` が `Preferences.CalculateLeaveTime` をハードコードしている

`src/lib/preferences.ts:9` で `getPreferenceValues<Preferences.CalculateLeaveTime>()` を使用しているが、`calculate-leave-time-view` コマンドからも呼ばれる。`package.json` で両コマンドのpreference定義は同一のため現時点では動作するが、将来片方だけ変更した場合に気づきにくいバグの元になり得る。

**対応案**: `Preferences.CalculateLeaveTimeView` を渡すジェネリック型パラメータにするか、コメントで「両コマンドのpreference定義を同一に保つこと」と注記する。

### 2. `calculate-leave-time-view.tsx` の `React` import が未使用

`src/calculate-leave-time-view.tsx:10` で `React` をimportしているが、JSXトランスフォーム設定次第では不要かもしれない。Raycastのビルド設定を確認して、不要なら削除する。

### 3. `formatTopSubtitle` の overtime 時の表示

`src/lib/leave-status.ts:31-34` — overtime時は `formatRemainingLabel` だけを返すが、通常時は `"18:00 leave - 1h 30m left"` のように leave time を含む。overtime時にも leave time が分かると有用かもしれない（例: `"18:00 leave - 0h 30m overtime"`）。ただし現状でも十分わかりやすいので、好みの問題。

### 4. `getReferenceNow` のバリデーション

`src/lib/time-utils.ts:17-24` — `typeof hours === "number"` チェックは `Number()` の結果なので常に `"number"` になる（`NaN` も `typeof` は `"number"`）。`!Number.isNaN` でカバーされているので実質問題ないが、`typeof` チェックは冗長。

### 5. `calculate-leave-time-view.tsx` の更新間隔

`src/calculate-leave-time-view.tsx:63-64` — 毎秒 `setInterval` で `currentTime` を更新しているが、表示は分単位（HH:MM）。分単位が変わるタイミングのみ更新すれば十分で、不要なre-renderを減らせる。ただしRaycastのList viewでのパフォーマンス影響は微小なので優先度は低い。

---

## Nits

### 1. preferences 重複定義

`package.json:19-35` と `package.json:43-59` — 両コマンドのpreference定義が完全に同一。Raycastのスキーマ制約で仕方ないが、将来同期が崩れるリスクがある。コメント等で「同期が必要」と明示すると良い。

### 2. `AGENTS.md` が untracked

git statusに `AGENTS.md` が表示されている。コミットに含めるか `.gitignore` に追加するか決める。

### 3. `CLAUDE.md` の diff

ローカライゼーション削除の記載更新、コマンド例追加は適切。
