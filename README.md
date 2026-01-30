# イタンジ エンジニア採用エントランスページ

イタンジ株式会社のエンジニア採用情報を、GitHub Pages で公開するためのエントランスページプロジェクトです。
Jekyll を使用したコンポーネント指向の設計により、高いメンテナンス性を実現しています。

## 🚀 クイックスタート (ローカル開発環境)

Docker Compose を使用して、ローカルでサイトをプレビューできます。

```bash
# 起動
docker-compose up

# 停止
docker-compose down
```

起動後、 [http://localhost:4000/entrance-book](http://localhost:4000/entrance-book) にアクセスしてください。ファイルを編集すると自動的にリロードされます。

## 📂 ディレクトリ構造

プロジェクトのルートディレクトリに Jekyll のリソースが配置されています。

```text
.
├── docker-compose.yml       # ローカル開発環境の定義
├── _config.yml              # Jekyll 設定（タイトル、baseurlなど）
├── _data/                   # コンテンツデータ（YAML形式）
├── _includes/               # 再利用可能なコンポーネント
│   └── components/          # 各セクションのHTML
├── _layouts/                # ベースレイアウト
├── _sass/                   # SCSS スタイル定義
├── assets/                  # 静的ファイル（コンパイル済みCSS, 画像など）
├── index.md                 # メインエントリ（コンポーネントを結合）
└── Gemfile                  # Ruby 依存関係
```

## 🛠 メンテナンスガイド

### コンテンツの更新（データ駆動）
数値やリストなどの頻繁に更新される情報は、 `_data/` 配下の YAML ファイルに集約されています。
HTMLを直接編集することなく、YAMLを書き換えるだけでサイトの内容を更新できます。

- `metrics.yml`: 実績数値
- `tech_stack.yml`: 技術スタック情報
- `benefits.yml`: 福利厚生・評価制度
- `members.yml`: メンバープロフィール
- `mission.yml`: ミッション・ビジョン・バリュー
- `products.yml`: プロダクト情報
- `business_phase.yml`: 事業フェーズ情報
- `dev_culture.yml`: 開発カルチャー
- `selection_flow.yml`: 選考フロー
- `organization.yml`: 組織図・チーム情報
- `blogs.yml`: 最新のブログ記事情報
- `product_flywheel.yml`: プロダクトの成長サイクル

### コンポーネント・セクションの更新
トップページ（`index.md`）は `_includes/components/` 配下の HTML ファイルを読み込むことで構成されています。

#### セクションの構成変更
`index.md` 内の `{% include components/xxx.html %}` の記述順を入れ替えることで、ページの並び順を変更できます。

#### デザインの変更
共通のスタイルは `_sass/` 配下の各ファイル（`_base.scss`, `_variables.scss` など）で管理されています。全体のテーマや共通パーツのスタイルを調整する場合はこちらを編集してください。

## 🌐 デプロイ

1. このリポジトリを GitHub にプッシュします。
2. リポジリの **Settings > Pages** を開きます。
3. **Build and deployment > Source** で `GitHub Actions` を選択します。
   - （または `Deploy from a branch` で `main` ブランチを指定します）

---
© 2026 ITANDI, Inc.
