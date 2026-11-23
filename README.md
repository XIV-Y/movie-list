# watch-log

見た映画・ドラマ・アニメなどの映像作品を個人的に記録していく Web アプリ。

- [TanStack Start](https://tanstack.com/start)（静的生成 / SSG）+ React + Vite + Tailwind CSS
  - ビルド時に視聴記録を描画した HTML を出力するので、JavaScript の読み込み前から一覧が表示される
- 作品情報とポスター画像は外部の作品データベース API から取得
- 視聴記録はリポジトリ内の JSON（`src/data/works.json`）で管理し、GitHub Pages で静的ホスティング

## 設定（リポジトリの外で管理する）

外部サービスの URL・トークンなどはリポジトリに一切置かない。

### ローカル: `~/.config/watch-log/.env`

```bash
mkdir -p ~/.config/watch-log
chmod 700 ~/.config/watch-log
# エディタで ~/.config/watch-log/.env を作成して下表の値を書く
chmod 600 ~/.config/watch-log/.env
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
npm run dev        # http://localhost:3000/watch-log/
npm run build      # dist/client に静的な HTML などを出力 (事前に validate も実行)
npm run typecheck
npm run validate   # 視聴記録 JSON の形式チェック
```

## 一覧の表示切り替え・並び替え

TOP ページで次の操作ができる。条件は URL の検索パラメータ（`?view=tags&sort=year-asc`）に保持されるので、リロードやリンクの共有でも条件が残る。

- **表示切り替え**: 「すべて」（既定）と「タグ別」を切り替えられる。タグ別ではタグ名を見出しにして作品をまとめて表示する（複数のタグを持つ作品はそれぞれに表示、タグのない作品は最後に「タグなし」としてまとめる）
- **並び替え**: 追加の新しい順 / 公開年の新しい順・古い順 / タイトル順（タグ別では各タグ内で並び替え）

## 視聴記録の追加

```bash
# 作品名で検索し、候補から番号で選ぶ
npm run add -- "作品名"

# シリーズなどのタグを付ける (複数指定可)
npm run add -- "作品名" --tag X-MEN

# 見たい作品として登録
npm run add -- "作品名" --status want

# 作品データベースの作品 ID を直接指定
npm run add -- --id 129 --media movie
```

| オプション | 内容 |
|---|---|
| `--status <watched\|watching\|want>` | 視聴ステータス（既定: `watched`） |
| `--type <movie\|drama\|anime\|other>` | 種別（既定: ジャンルから推定） |
| `--tag <name>` | シリーズなどのタグ（複数指定可）。タグ別表示でまとめて表示される |
| `--id <id> --media <movie\|tv>` | 作品 ID を直接指定 |
| `--first` | 検索結果の 1 件目を選ぶ |

追加したら `src/data/works.json` をコミットして push する。一覧は追加の新しい順（JSON の後ろにあるものが先）に表示される。

### 編集・削除

`src/data/works.json` を直接編集する（タグを後から付けるときは、作品に `"tags": ["X-MEN"]` を追加する）。`npm run validate` で形式をチェックできる（ビルド時・CI でも自動で実行される）。

## デプロイ

`main` に push すると GitHub Actions (`.github/workflows/deploy.yml`) がビルドして GitHub Pages に公開する。
初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定すること。

- ベースパスは既定で `/watch-log/`（環境変数 `BASE_PATH` で変更可）
- 存在しないパスでは、ビルド時に生成した `404.html`（ページが見つかりません）が表示される
- 全ページに `noindex, nofollow` を付けているので、検索エンジンの検索結果には表示されない
