# movie-list

見た映画・ドラマ・アニメなどの映像作品を個人的に記録していく Web アプリ。

- [TanStack Start](https://tanstack.com/start)（SPA / CSR モード）+ React + Vite + Tailwind CSS
- 作品情報とポスター画像は外部の作品データベース API から取得
- 視聴記録はリポジトリ内の JSON（`src/data/works.json`）で管理し、GitHub Pages で静的ホスティング

## 設定（リポジトリの外で管理する）

外部サービスの URL・トークンなどはリポジトリに一切置かない。

### ローカル: `~/.config/movie-list/.env`

```bash
mkdir -p ~/.config/movie-list
chmod 700 ~/.config/movie-list
# エディタで ~/.config/movie-list/.env を作成して下表の値を書く
chmod 600 ~/.config/movie-list/.env
```

| 変数 | 用途 | 使う場所 |
|---|---|---|
| `CATALOG_API_BASE_URL` | 作品データベース API のベース URL | `npm run add` |
| `CATALOG_API_TOKEN` | 作品データベース API の Read Access Token（**秘密情報**） | `npm run add` |
| `VITE_POSTER_BASE_URL` | ポスター画像 CDN のベース URL | サイト |
| `VITE_CREDIT_NAME` | フッターに表示するデータ提供元の名前 | サイト |
| `VITE_CREDIT_URL` | フッターに表示するデータ提供元の URL | サイト |

> [!WARNING]
> `VITE_` で始まる変数はサイトのコードに埋め込まれて公開される。トークンには絶対に `VITE_` を付けないこと。
> API への問い合わせは手元のスクリプトだけで行い、サイトにはトークンを含めない。

### GitHub Actions: Repository variables

**Settings → Secrets and variables → Actions → Variables** に `VITE_POSTER_BASE_URL` / `VITE_CREDIT_NAME` / `VITE_CREDIT_URL` を設定する。
未設定だとデプロイのビルドが失敗する（ポスターやクレジット表記が欠けた状態で公開しないため）。

## 開発

```bash
npm install
npm run dev        # http://localhost:3000/movie-list/
npm run build      # dist/client に静的ファイルを出力 (事前に validate も実行)
npm run typecheck
npm run validate   # 視聴記録 JSON の形式チェック
```

## 視聴記録の追加

```bash
# 作品名で検索し、候補から番号で選ぶ
npm run add -- "作品名"

# 視聴日を指定 (省略時は今日)
npm run add -- "作品名" --watched-on 2026-11-01

# 見たい作品として登録
npm run add -- "作品名" --status want

# 作品データベースの作品 ID を直接指定
npm run add -- --id 129 --media movie
```

| オプション | 内容 |
|---|---|
| `--status <watched\|watching\|want>` | 視聴ステータス（既定: `watched`） |
| `--watched-on <YYYY-MM-DD>` | 視聴日（既定: 見た・見ている なら今日） |
| `--type <movie\|drama\|anime\|other>` | 種別（既定: ジャンルから推定） |
| `--id <id> --media <movie\|tv>` | 作品 ID を直接指定 |
| `--first` | 検索結果の 1 件目を選ぶ |

追加したら `src/data/works.json` をコミットして push する。

### 編集・削除

`src/data/works.json` を直接編集する。`npm run validate` で形式をチェックできる（ビルド時・CI でも自動で実行される）。

## デプロイ

`main` に push すると GitHub Actions (`.github/workflows/deploy.yml`) がビルドして GitHub Pages に公開する。
初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定すること。

- ベースパスは既定で `/movie-list/`（環境変数 `BASE_PATH` で変更可）
- 直接アクセスしたサブパスでも動くよう、ビルド後に `index.html` を `404.html` にコピーしている
