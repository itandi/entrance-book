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

起動後、 [http://localhost:4000](http://localhost:4000) にアクセスしてください。ファイルを編集すると自動的にリロードされます。

## 🛠 メンテナンスガイド


## 📂 ディレクトリ構造



プロジェクトのルートディレクトリに Jekyll のリソースが配置されています。



```text

.

├── docker-compose.yml       # ローカル開発環境の定義

├── _config.yml              # Jekyll 設定（コレクション定義など）

├── _data/                   # コンテンツデータ（YAML形式）

├── _includes/               # 再利用可能なコンポーネント

├── _layouts/                # ベースレイアウト

├── _sections/               # ページの各セクション（Markdown）

├── assets/                  # 静的ファイル（CSS, JS, 画像）

├── index.md                 # メインエントリ（セクションを自動結合）

├── Gemfile                  # Ruby 依存関係

└── docs/                    # 設計資料・要件定義

```



## 🛠 メンテナンスガイド

### コンテンツの更新（データ駆動）
数値やリストなどの頻繁に更新される情報は、 `_data/` 配下の YAML ファイルに集約されています。
HTMLを編集することなく、YAMLを書き換えるだけでサイトの内容を更新できます。

- `metrics.yml`: 実績数値
- `tech_stack.yml`: 技術スタック情報
- `benefits.yml`: 福利厚生・評価制度
- `members.yml`: メンバープロフィール
- `mission.yml`: ミッション・ビジョン・バリュー
- `products.yml`: プロダクト情報
- `business_phase.yml`: 事業フェーズ情報
- `dev_culture.yml`: 開発カルチャー
- `selection_flow.yml`: 選考フロー

### セクションの並び替え・追加
`_sections/` 配下の Markdown ファイルは Jekyll の Collections 機能で管理されています。
ファイル名のプレフィックス(`10-`, `20-`, `30-`...)を変更することで、トップページでの表示順を簡単に変更できます。

#### 命名規則

**フォーマット**: `{番号}-{スラッグ}.md`

- **基本インクリメント**: 10刻み（10, 20, 30, 40...）を使用
- **中間セクション**: 5刻み（15, 25, 45...）を使用
- **さらに細かい挿入**: 必要に応じて1刻みも許容（11, 12...）

**例**:
```
_sections/
├── 10-mission.md           # ミッション・ビジョン
├── 15-business-phase.md    # 事業フェーズ（中間セクション）
├── 20-product.md           # プロダクト
├── 30-technology.md        # テクノロジー
├── 40-organization.md      # 組織
├── 45-selection-flow.md    # 選考フロー（中間セクション）
├── 50-conditions.md        # 募集要項
├── 60-closing.md           # クロージング
└── 90-cta-area.md          # CTAエリア
```
`assets/css/lp.css` にて、ブランドカラー（イタンジ・オレンジ）やヘキサゴンモチーフのスタイルを一括管理しています。

## 🌐 デプロイ

1. このリポジトリを GitHub にプッシュします。
2. リポジリの **Settings > Pages** を開きます。
3. **Build and deployment > Source** で `Deploy from a branch` を選択します。
4. **Branch** で `main`（または公開用ブランチ）を選択し、ディレクトリを `/(root)` に設定して保存します。

---
© 2026 ITANDI, Inc.
