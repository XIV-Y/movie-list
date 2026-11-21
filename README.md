# movie-list

見た映画・ドラマ・アニメなどの映像作品を個人的に記録していく Web アプリ。

- [TanStack Start](https://tanstack.com/start)（SPA / CSR モード）+ React + Vite + Tailwind CSS
- 作品情報とポスター画像は [CATALOG](https://example.invalid) から取得
- 視聴記録はリポジトリ内の JSON（`src/data/works.json`）で管理し、GitHub Pages で静的ホスティング

## 開発

```bash
npm install
npm run dev        # http://localhost:3000/movie-list/
npm run build      # dist/client に静的ファイルを出力 (事前に validate も実行)
npm run typecheck
npm run validate   # 視聴記録 JSON の形式チェック
```

## 視聴記録の追加

### 1. CATALOG のトークンを用意する（初回のみ）

1. [CATALOG](https://example.invalid) でアカウントを作成し、Settings → API でキーを発行する
2. **API Read Access Token**（`eyJ...` で始まる長い方）を、**リポジトリの外**のファイルに保存する

```bash
mkdir -p ~/.config/movie-list
chmod 700 ~/.config/movie-list
# エディタで ~/.config/movie-list/env を作成し、次の 1 行を書く
#   CATALOG_API_TOKEN=eyJ...
chmod 600 ~/.config/movie-list/env
```

> [!WARNING]
> トークンはリポジトリ内に置かないこと（`.env` も `.gitignore` 済みだが使わない）。
> また、変数名に `VITE_` を付けるとサイトのコードに埋め込まれて公開されてしまうので付けないこと。
> CATALOG への問い合わせは手元のスクリプトだけで行い、サイトにはトークンを含めない。

### 2. 作品を追加する

```bash
# 作品名で検索し、候補から番号で選ぶ
npm run add -- "千と千尋の神隠し" --rating 5 --note "何度見ても良い" --tag ジブリ

# 見たい作品として登録
npm run add -- "トップガン マーヴェリック" --status want

# CATALOG の作品 ID を直接指定 (URL の example.org/movie/129 などから分かる)
npm run add -- --catalog-id 129 --media movie
```

| オプション | 内容 |
|---|---|
| `--status <watched\|watching\|want>` | 視聴ステータス（既定: `watched`） |
| `--rating <1-5>` | 評価 |
| `--watched-on <YYYY-MM-DD>` | 視聴日（既定: 見た・見ている なら今日） |
| `--note <text>` | 感想メモ |
| `--tag <name>` | タグ（複数指定可） |
| `--type <movie\|drama\|anime\|other>` | 種別（既定: CATALOG のジャンルから推定） |
| `--catalog-id <id> --media <movie\|tv>` | CATALOG の作品 ID を直接指定 |
| `--first` | 検索結果の 1 件目を選ぶ |

追加したら `src/data/works.json` をコミットして push する。

### 編集・削除

`src/data/works.json` を直接編集する。`npm run validate` で形式をチェックできる（ビルド時・CI でも自動で実行される）。

## デプロイ

`main` に push すると GitHub Actions (`.github/workflows/deploy.yml`) がビルドして GitHub Pages に公開する。
初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定すること。

- ベースパスは既定で `/movie-list/`（環境変数 `BASE_PATH` で変更可）
- 直接アクセスしたサブパスでも動くよう、ビルド後に `index.html` を `404.html` にコピーしている

## クレジット

This product uses the CATALOG API but is not endorsed or certified by CATALOG.
