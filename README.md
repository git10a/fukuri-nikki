# 複利日記（見開き日記MVP）

紙の「見開きノート」をWebで再現。左に今日のToDo、右に昨日の振り返り（悪かった/良かった＋改善/改良案）を並べ、自然に復習・改善が続く仕組みのMVPです。

## 要件対応

- 見開きレイアウト: 画面幅が `980px` 以上で左右2ペイン、それ未満は上下にスタック。
- 左ページ（今日のToDo）: 追加/削除/完了チェック。自動保存（LocalStorage）。
- 右ページ（昨日の振り返り）: 左カラム=「昨日悪かったこと＋改善案」、右カラム=「昨日良かったこと＋改良案」。
- AI候補生成: 最大3件の候補を提示し、クリックで採用。デフォルトはスタブ、`.env` に API キーがあれば OpenAI Responses API（`codex-mini-latest`）を利用。
- 注意書き: 画面下に「投資・医療・法律は一般情報にとどめます」表示。
- 保存: LocalStorage に日付キー（`YYYY-MM-DD`）で保存。右ページは「昨日」のデータを表示・編集。

## セットアップ

前提: Node.js 18+ と pnpm を推奨。

```bash
pnpm i
pnpm dev
```

ブラウザで表示されるトップに今日の日付、左に今日のToDo、右に昨日の振り返りが表示されます。

## OpenAI API（サーバ側で秘匿）

本プロジェクトは Cloudflare Pages Functions の `/api/openai` を経由して OpenAI を呼び出し、APIキーをクライアントへ露出しません。

### ローカルでFunctionsを動かす

1. `.dev.vars` を作成して以下を記載（このファイルはGit管理しない）

```
OPENAI_API_KEY=sk-...your-key...
```

2. ビルドしてFunctions開発サーバを起動

```
pnpm build
pnpm dev:cf
```

`http://localhost:8788`（または表示されたURL）で、フロントとFunctionsが同一オリジンで動作します。

補足: 通常の `pnpm dev` はViteのみを起動します（AI候補はスタブにフォールバック）。

### Cloudflare Pages での本番

- Pages > Settings > Environment variables に `OPENAI_API_KEY` を追加（Production/Preview 両方）。
- Build command: `pnpm build` / Output directory: `dist`

## 技術スタック

- Vite + React + TypeScript
- Tailwind CSS（`spread` ブレークポイントを 980px に設定）
- LocalStorage 永続化（`src/lib/storage.ts`）
- AI候補生成（`src/lib/ai.ts`）: 既定では `/api/openai` を呼び出し、失敗時はローカルスタブ

## 環境ファイル

- `.env.local`: フロント用の追加設定に使用（秘密情報は入れないでください）
- `.dev.vars`: Cloudflare Pages Functions のローカル実行用シークレット（`OPENAI_API_KEY`）

## 主要ファイル

- `src/App.tsx`: レイアウトと日付の紐付け（今日/昨日）。
- `src/components/TodoList.tsx`: 今日のToDoリスト。
- `src/components/Reflection.tsx`: 昨日の振り返りとAI候補採用UI。
- `src/lib/storage.ts`: LocalStorageの読み書き、日付キー管理。
- `src/lib/ai.ts`: OpenAI Responses API 呼び出しとスタブ生成。

## 使い方のヒント

- 改善/改良案は「最小の実行ステップ」で書くと継続しやすくなります。
- 候補はクリックすると採用欄にコピーされ、手入力で上書き可能です。

## ライセンス

MVP用途。個人利用/評価にご自由にどうぞ。
