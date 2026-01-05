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

起動後、 [http://localhost:4000](http://localhost:4000) にアクセスしてください。`public` 内のファイルを編集すると自動的にリロードされます。

## 📂 ディレクトリ構造

プロジェクトは `public` ディレクトリを Jekyll のルートとして構成しています。

```text
.
├── docker-compose.yml       # ローカル開発環境の定義
├── public/                  # Jekyll プロジェクトルート
│   ├── _config.yml          # Jekyll 設定（コレクション定義など）
│   ├── _data/               # コンテンツデータ（YAML形式）
│   ├── _includes/           # 再利用可能なコンポーネント
│   ├── _layouts/            # ベースレイアウト
│   ├── _sections/           # ページの各セクション（Markdown）
│   ├── assets/              # 静的ファイル（CSS, JS, 画像）
│   ├── index.md             # メインエントリ（セクションを自動結合）
│   └── Gemfile              # Ruby 依存関係
└── docs/                    # 設計資料・要件定義
```

## 🛠 メンテナンスガイド

### コンテンツの更新（データ駆動）
数値やリストなどの頻繁に更新される情報は、 `public/_data/` 配下の YAML ファイルに集約されています。
HTMLを編集することなく、YAMLを書き換えるだけでサイトの内容を更新できます。

- `metrics.yml`: 実績数値
- `tech_stack.yml`: 技術スタック情報
- `benefits.yml`: 福利厚生・評価制度
- `members.yml`: メンバープロフィール

### セクションの並び替え・追加
`public/_sections/` 配下の Markdown ファイルは Jekyll の Collections 機能で管理されています。
ファイル名のプレフィックス（`01-`, `02-`...）を変更することで、トップページでの表示順を簡単に変更できます。

### デザインの変更
`public/assets/css/style.css` にて、ブランドカラー（イタンジ・オレンジ）やヘキサゴンモチーフのスタイルを一括管理しています。

## 🌐 デプロイ

1. このリポジトリを GitHub にプッシュします。
2. リポジトリの **Settings > Pages** を開きます。
3. **Build and deployment > Source** で `Deploy from a branch` を選択します。
4. **Branch** で `main`（または公開用ブランチ）を選択し、ディレクトリを `/public` に設定して保存します。
   - ※ `/public` をルートとして公開するように設定してください。

---
© 2026 ITANDI, Inc.
