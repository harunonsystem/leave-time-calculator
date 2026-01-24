# プランファイル統合計画

## 概要

### 1. トップレベルサブタイトル更新問題（✅ 完了）

**問題**: Raycast検索結果一覧で表示されるサブタイトルが更新されない。

**原因**: バックグラウンド実行時、非同期の `getTodayStartTime()` 完了前に `updateSubtitle()` が実行される。

**修正**: 既存の2つの `useEffect` を1つに統合し、非同期処理完了を待ってからサブタイトル更新。

### 2. Greptile指摘事項の対応（✅ 完了）

- CHANGELOG.md フォーマット修正（`[1.0.0]` + `{PR_MERGE_DATE}`）
- types.ts の手動 Preferences 定義削除（Raycast自動生成型を使用）
- `media/` → `metadata/` へリネーム
- tsconfig.json に `raycast-env.d.ts` 追加

### 3. 「今すぐ出勤」オプション追加（✅ 完了）

- `currentTime` state を追加（1分ごとに更新）
- 「今すぐ出勤」セクションを「今日の予定」の下に追加
- 翻訳を追加（`nowSection`, `startNow`）

### 4. CHANGELOG.md 更新（✅ 完了）

v1.0.0 は初回リリースのため "Initial release" としてシンプルに記載。

---

## 検証結果

```bash
bun run check && bun run test && bun run build
```

- ✅ Lint チェック: パス
- ✅ テスト: 52件すべてパス
- ✅ ビルド: 成功

---

## 変更ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `CHANGELOG.md` | 新規作成（Initial release） |
| `src/lib/types.ts` | Preferences定義削除 |
| `src/lib/translations.ts` | 今すぐ出勤の翻訳追加 |
| `src/calculate-leave-time.tsx` | 今すぐ出勤セクション追加、useEffect統合 |
| `tsconfig.json` | raycast-env.d.ts追加 |
| `README.md` / `README.ja.md` | パス参照更新 |
| `metadata/` | media/からリネーム |

---
