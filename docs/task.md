---

# イタンジ エンジニア採用エントランスページ 構築マニュアル

## 1. 準備フェーズ：基盤のセットアップ

Jekyllを使用した静的サイト生成と、GitHubによる自動デプロイ環境を構築します。

* [ ] **GitHub リポジトリ作成**: `itandi-engineer-recruiting` 等の名前でパブリックリポジトリを作成。
* [ ] **Jekyll プロジェクト初期化**: ローカルで `jekyll new .` を実行し、基本フォルダ構成を生成。
* [ ] **ディレクトリ構造の整備**:
* `_sections/`: 各章のMarkdownファイル
* `_data/`: 実績数値や技術スタックのYAML
* `assets/js/`: RSS取得用JavaScript
* `assets/css/`: カスタムSCSS


* [ ] **GitHub Actions 設定**: `.github/workflows/deploy.yml` を作成し、Pagesへの自動デプロイを設定。

## 2. データ定義フェーズ：実績と構成の言語化

サイト全体で使い回す「生きた数字」と「技術要素」を `_data/` フォルダに定義します。

* [ ] **実績値 (`metrics.yml`)**:
* 年間申込数：100万件超
* 業者間サイト利用率：40%（仲介会社）
* 紙削減枚数：700万枚


* [ ] **技術スタック (`tech_stack.yml`)**:
* Ruby on Rails, React, TypeScript, MySQL
* Akka, OpenSearch, AWS DMS
* Apache Airflow, Google BigQuery
* ※ Node.js は除外


* [ ] **メンバープロフィール (`members.yml`)**:
* CTO大原：野村證券〜エンジニア転身〜SRE責任者〜CTOの経歴


* [ ] **福利厚生 (`benefits.yml`)**:
* テックチャージ（スキルアップ全額サポート）、フルフレックス、在宅勤務、ミッショングレード制



## 3. コンテンツ制作フェーズ：ナラティブの構築

各セクションをMarkdownで記述します。単なる事実の羅列ではなく、イタンジの「意志」を込めます。

* [ ] **Mission (Section 1)**: 「不動産取引をなめらかにする」ビジョンと、社会的意義の提示。
* [ ] **Product (Section 2)**: 賃貸管理・仲介・売買・BBの4領域の垂直統合（Vertical SaaS）の強み。
* [ ] **Technology (Section 3)**:
* システム構成図の掲載
* 「負債を資産に変える」リファクタリング文化


* [ ] **Organization (Section 4)**: 100名体制への拡大と、ビジネス/技術を越境するリーダーシップ。
* [ ] **Conditions (Section 5)**: OKRによる評価サイクルと、スペシャリスト/マネジメントの選択肢。
* [ ] **Closing (Section 6)**:
* CTOインタビューから引用した「質の深化」「GRIT & WILL」のメッセージ。
* [HERPへのエントリーリンク](https://herp.careers/careers/companies/itandi/jobs?parent-job-role-ids=engineer) の配置。



## 4. 動的機能実装フェーズ：テックブログ連携

JavaScriptを用いて、最新の技術発信をリアルタイムに表示します。

* [ ] **RSS取得スクリプト (`assets/js/fetch-rss.js`)**:
* `https://tech.itandi.co.jp/rss` をフェッチ。
* `rss2json` 等のプロキシを通じ、CORSを回避してJSで取得。
* 最新3記事のタイトル、日付、リンクを自動生成してHTMLへ挿入。


* [ ] **UI実装**: 読み込み中のスケルトンスクリーンや、エラー時のフォールバック表示を実装。

## 5. デザイン・演出フェーズ：イタンジ・アイデンティティ

CSS(SCSS)を用いて、スライドの洗練されたトーンをWeb上で再現します。

* [ ] **配色設定**: 背景にダークグレー（#222222）、アクセントにイタンジ・オレンジのグラデーションを使用。
* [ ] **タイポグラフィ**: 信頼感のあるサンセリフ体。実績数値は大きく太く強調。
* [ ] **ビジュアル要素**:
* Missionセクション等に「ヘキサゴン（六角形）」モチーフをCSSの `clip-path` で実装。
* スクロールに応じたフェードイン・アニメーションで「なめらかさ」を演出。



## 6. 公開・レビューフェーズ

* [ ] **ローカル確認**: `bundle exec jekyll serve` で全リンクとJSの動作を確認。
* [ ] **GitHubデプロイ**: `main` ブランチへプッシュ。
* [ ] **表示確認**: 各種ブラウザ（Chrome, Safari）およびスマートフォンでのレスポンシブ表示を確認。

---
