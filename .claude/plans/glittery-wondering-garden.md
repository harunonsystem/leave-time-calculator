# CLAUDE.md 改善プラン

## 現状分析

現在のCLAUDE.mdは基本的な情報を網羅しており、良くまとまっています。以下の改善点を提案します。

## 改善内容

### 1. 単一テスト実行コマンドの追加
現在は`bun run test`のみ記載されていますが、特定のテストファイルやテストケースを実行する方法が記載されていません。

```bash
bun run test -- tests/time-utils.test.ts           # 特定ファイル
bun run test -- -t "calculateLeaveTime"            # 特定テスト名
```

### 2. CI/lint情報の追加
`bun run lint`（ray lint）がCI workflowで実行されていますが、CLAUDE.mdに記載がありません。

### 3. 翻訳ファイルの削除に関する情報
`translations.ts`が削除されているようですが、Architectureセクションに残っています。

## 最終CLAUDE.md案

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Raycast extension for calculating leave time based on arrival time. Supports night shift (cross-midnight) calculations.

## Commands

```bash
bun run dev        # Development mode (Raycast extension)
bun run build      # Build for production
bun run test       # Run tests with vitest
bun run test -- tests/time-utils.test.ts  # Run specific test file
bun run test -- -t "calculateLeaveTime"   # Run tests matching pattern
bun run lint       # Raycast lint (ray lint)
bun run check      # Lint & format check (Biome)
bun run format     # Auto-format with Biome
```

## Architecture

- `src/calculate-leave-time.tsx` - Main command component (Raycast List view)
- `src/lib/time-utils.ts` - Time calculation logic (leave time, remaining time, night shift handling)
- `src/lib/storage.ts` - Raycast LocalStorage wrapper for persisting today's start time
- `src/lib/types.ts` - TypeScript type definitions
- `tests/` - vitest tests

## Key Dependencies

- `@raycast/api` - Raycast extension framework
- `vitest` - Test runner (not bun test)
- `@biomejs/biome` - Linting and formatting

## Development Guidelines

- Use `bun install` instead of npm/yarn/pnpm
- Use `bun run <script>` instead of npm run
- Use `bunx <package>` instead of npx

## Notes

- Preferences are defined in package.json under `commands[].preferences`
- Time calculations handle cross-midnight shifts (e.g., 22:00 start -> 07:00 leave next day)
- Tests use `vi.useFakeTimers()` for time-dependent logic
```

## 変更箇所サマリー

| 項目 | 変更内容 |
| --- | --- |
| 単一テスト実行 | `bun run test -- <file>` と `-t` オプションを追加 |
| lint コマンド | `bun run lint` を追加 |
| translations.ts | Architecture から削除（ファイルが存在しないため） |
| i18n サポート | Overview から削除（現在は未使用） |
