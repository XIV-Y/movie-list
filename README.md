# movie-list

見た映画・ドラマ・アニメなどの映像作品を個人的に記録していく Web アプリ。

- [TanStack Start](https://tanstack.com/start)（SPA / CSR モード）+ React + Vite
- GitHub Pages で静的ホスティング

## 開発

```bash
npm install
npm run dev      # http://localhost:3000/movie-list/
npm run build    # dist/client に静的ファイルを出力
npm run typecheck
```

## デプロイ

`main` に push すると GitHub Actions (`.github/workflows/deploy.yml`) がビルドして GitHub Pages に公開する。
初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定すること。

- ベースパスは既定で `/movie-list/`（環境変数 `BASE_PATH` で変更可）
- 直接アクセスしたサブパスでも動くよう、ビルド後に `index.html` を `404.html` にコピーしている
