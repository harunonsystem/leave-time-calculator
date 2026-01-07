# Leave Time Calculator for Raycast

退勤時刻を計算する Raycast プラグインです。

## 機能

- 開始時刻を入力すると、退勤時刻を自動計算
- デフォルトで9時間の労働時間
- 休憩時間も考慮（デフォルト60分）
- 設定で労働時間と休憩時間をカスタマイズ可能
- UI は clipboard history のような ListItem 形式

## 使い方

1. Raycast を開く（⌘ + Space）
2. "Calculate Leave Time" と入力
3. 開始時刻を選択または検索
4. 退勤時刻が表示されます

### 設定のカスタマイズ

- リストの一番上の "Settings" セクションで労働時間と休憩時間を調整できます
- Raycast の設定からデフォルト値を変更できます

## 開発

```bash
# 依存関係のインストール
bun install

# 開発モードで実行（Raycast が必要）
bun run dev

# ビルド
bun run build
```

## アイコンについて

`assets/command-icon.png` に 512x512px の PNG アイコンを配置してください。

## 技術スタック

- Bun
- React
- TypeScript
- Raycast API

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
