
## 1. 推奨ディレクトリ構造

各スライドのコンテンツを独立したMarkdownファイルとして管理することで、将来的な情報の更新を容易にします。

```text
.
├── _data/
│   ├── tech_stack.yml       # [cite: 100-108] 技術スタック一覧
│   └── members.yml          # [cite: 131-136] リーダー・メンバー情報
├── _includes/
│   ├── components/          # セクションごとの共通パーツ
│   │   ├── hero.html        # [cite: 58-61]
│   │   ├── metrics.html     # [cite: 73-80] 数字で見る実績
│   │   └── roadmap.html     # [cite: 95-97] ロードマップ
│   └── footer.html
├── _layouts/
│   └── default.html         # 全体のベースレイアウト
├── _sections/               # スライド構成案に基づく各セクションのMD
│   ├── 01-mission.md        # [cite: 58-72] ミッション・Why Now
│   ├── 02-product.md        # [cite: 81-97] プロダクト・バーティカルの面白さ
│   ├── 03-technology.md     # [cite: 98-125] 技術スタック・負債への向き合い方
│   ├── 04-organization.md   # [cite: 126-141] 組織図・働き方
│   └── 05-conditions.md     # [cite: 142-149] 評価制度・キャリア
├── assets/
│   ├── css/
│   ├── images/              # [cite: 160] 信頼感・先進性のある画像
│   └── pdf/                 # [cite: 173] 元のピッチデックPDF
├── index.md                 # 各セクションを結合して表示するメインページ
└── _config.yml              # サイト全体の共通設定

```

---

## 2. コンテンツの実装ポイント

### データ駆動（YAML）での管理

頻繁に更新される「数値」や「技術スタック」は Markdown に直接書かず、`_data` フォルダの YAML ファイルで管理します。

* **数字で見る実績 (`_data/metrics.yml`):**
* 年間入居申込数：87万件 


* 導入管理会社数：約1,600社 


* 紙削減枚数：700万枚 




* **技術スタック (`_data/tech_stack.yml`):**
* 言語・フレームワーク：Ruby on Rails, TypeScript, React/Next.js 


* インフラ：AWS (ECS Fargate, Aurora, Kinesis, Lambda), Terraform 





### 負債と誠実に向き合う（Markdown）

 で強調されている「技術的負債を逆手に取るストーリー」は、`_sections/03-technology.md` 内に詳細に記述します。

> 
> **誠実なエンジニアリング:** 「歴史がある分、負債もある」と正直に認め 、Railsのアップデートやリファクタリングを「資産」として楽しむ文化を言語化します 。
> 
> 

### 視覚的なトーン＆マナー

 の指針に基づき、CSSには以下の要素を取り入れます。

* 
**カラー:** イタンジのコーポレートカラーを基調に、コードハイライト風のアクセントカラーを配置 。


* 
**デザイン:** 「紙・ハンコ」のイメージを払拭する洗練されたSaaS企業のイメージを構築 。



---

## 3. GitHub Pagesならではの運用

Jekyll を使用することで、以下の運用が可能になります。

1. **Pull Request ベースの修正:** 募集要項や年収レンジに変更があった際、人事や広報からのPRをエンジニアがレビューして反映。
2. 
**GitHub Actions による自動ビルド:** * Tech Blog (RSS) の自動取得スクリプトを Actions で回し、`_data/blog_posts.yml` を自動更新してトップページに表示。 


3. **PDFとの二段構え:**
* サイト内には Speaker Deck を埋め込みつつ、じっくり読みたい人向けにPDFダウンロードリンクを設置 。





### index.md の構成案

```markdown
---
layout: default
title: "エンジニア採用エントランスページ | イタンジ株式会社"
---

{% include components/hero.html %}

<section id="metrics" class="section">
  <div class="container">
    <h2>Impact & Traction</h2>
    <div class="metrics-grid">
      {% for metric in site.data.metrics %}
      <div class="metric-item">
        <span class="number">{{ metric.value }}</span>
        <span class="label">{{ metric.label }}</span>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

{% assign sections = site.sections | sort: 'order' %}
{% for section in sections %}
  <section id="{{ section.slug }}" class="section-content {{ section.class }}">
    <div class="container">
      {% if section.title %}
        <h2 class="section-title">{{ section.title }}</h2>
      {% endif %}
      
      {{ section.content }}
      
      {% if section.slug == 'technology' %}
        {% include components/tech-stack-list.html %}
      {% endif %}
    </div>
  </section>
{% endfor %}

{% include components/cta.html %}

```

---

### この作りのポイント

1. **Liquidによる動的結合**:
* 
`_sections/` フォルダ内のMarkdownファイルを順番に読み込んで展開します。これにより、30ページ近いボリュームの内容も、`index.md` 1ファイルをいじることなく、個別のファイル修正だけで更新が完結します 。




2. **データとの分離**:
* 「年間申込数87万件」 や「導入管理会社1,600社」  といった具体的な数字は、`_data/metrics.yml` から読み込むようにしています。将来、実績値が更新された際も、データファイルを1行書き換えるだけでサイト全体に反映されます。




3. **セクションごとの柔軟なレイアウト**:
* 
`_sections/*.md` の各ファイルに `order: 1` などの優先順位や、`class: bg-gray` といったデザイン用の変数をフロントマター（ファイル冒頭）に持たせることで、スライドの構成順序を自由に入れ替えられます 。




4. **コンポーネントの再利用**:
* ヒーローエリア やCTA（応募ボタン・選考フロー）  など、デザインが特殊な部分は `_includes/` に切り出すことで、HTMLの構造をスッキリ保ちます。





### 補足：各Markdownファイル（_sections/内）の書き方

例えば「技術スタックと負債への向き合い方」のページなら、以下のように記述します。

```markdown
---
title: "Technology & Engineering"
slug: "technology"
order: 3
---
### [cite_start]不動産実務の複雑怪奇さを、技術でハックする [cite: 29]
[cite_start]イタンジのエンジニアリングの醍醐味は、複雑なドメインロジックをシンプルで美しいアーキテクチャに落とし込むことにあります [cite: 93-104]。

[cite_start]**技術的負債へのスタンス** [cite: 109-112]:
[cite_start]歴史あるコードを「負債」として放置せず、「資産」としてリファクタリングするプロセスを重視しています。Railsの継続的なアップデートやテスト自動化への投資を惜しみません [cite: 169-171]。

```


---

## 1. データ管理ファイル (`_data/metrics.yml`)

数値実績は一箇所で管理し、スライドの説得力をWebでも再現します。

```yaml
[cite_start]# [cite: 73-80, 189] スライド5「数字で見る実績」に対応
key_metrics:
  - label: "年間WEB入居申込数"
    value: "約87万件"
    [cite_start]description: "賃貸入居申込全体の約25%に相当 [cite: 44, 195]"
  - label: "導入管理会社数"
    value: "約1,600社"
    [cite_start]description: "業界標準のプラットフォーム [cite: 77, 189]"
  - label: "年間紙削減枚数"
    value: "700万枚"
    [cite_start]description: "エンジニアリングが直接的な資源保護に貢献 [cite: 45, 79]"

```

---

## 2. セクション用Markdown (`_sections/03-technology.md`)

「負債への向き合い方」など、エンジニアが最も注目するナラティブを記述します。

```markdown
---
title: "Technology & Engineering"
slug: "technology"
order: 3
---
### 複雑なドメインを技術でハックする
[cite_start][cite: 91-94] 不動産業界特有の商習慣や複雑なステークホルダー関係を、シンプルで美しいアーキテクチャに落とし込むことがイタンジの醍醐味です。

#### 技術的負債への誠実なスタンス
[cite_start][cite: 109-112, 170] 私たちは歴史あるコードを「負債」として放置せず、走行中の列車のエンジンを換装するように、リファクタリングのプロセス自体を高度なエンジニアリング・チャレンジとして楽しんでいます。

* [cite_start]**Railsアップデート**: 新卒1年目からバージョンアップに挑戦する文化 [cite: 212]
* [cite_start]**コミュニティ貢献**: Kaigi on Rails等へのスポンサー協賛を通じたRubyエコシステムへの還元 [cite: 50, 123]

```

---

## 3. 選考フローとクロージング (`_sections/06-closing.md`)

最後に応募のハードルを下げ、次のアクションへ繋げます。

```markdown
---
title: "Next Action"
slug: "closing"
order: 6
---
### カジュアルに話してみませんか？
[cite_start][cite: 153-154] 選考プロセスは透明性を重視しています。

1. [cite_start]**カジュアル面談**: まずはお互いのミッションを共有しましょう [cite: 176]
2. [cite_start]**書類選考・面接（2回）**: 現場のエンジニアやリーダーと深く語り合います [cite: 154]
3. [cite_start]**オファー**: 期待値や評価基準を明確に提示します [cite: 36, 145]

> [cite_start]**CTO大原からのメッセージ** [cite: 151-152, 213]:
> 伝統的な産業をテクノロジーで再定義する、このエキサイティングな挑戦に加わってくれる仲間を探しています。

```

---

## 4. 運用のコツ：GitHub Actionsの活用

Jekyllの利点を活かして、以下の自動化を設定することをお勧めします。

* 
**Tech Blogの自動同期**: GitHub Actionsでイタンジの技術ブログ（`tech.itandi.co.jp`）のRSSを取得し、最新の3記事を自動で `_data/blog.yml` に書き込んでデプロイする仕組みを作ると、ページが常に「生きている」状態を保てます 。


* **プルリクエストによる更新**: 現場エンジニアが「今の技術スタック」や「チームの課題」をMarkdownで直接修正し、PRを出す。これがそのまま「開発文化の紹介」になります。

---


### _sections/01-mission.md
---
title: "Mission & Vision"
slug: "mission"
order: 1
---

## テクノロジーで不動産取引をなめらかにする

多くの方にとって、住まいは生活の基盤となる重要な存在です。
しかし、不動産取引には不透明でわかりづらい部分があったり、手続きに手間がかかったりするのが現状です。

[cite_start]イタンジは、テクノロジーの力でこの課題を解決し、不動産取引をなめらかにすることを、創業時から変わらないミッションとして掲げています [cite: 60, 65-69]。

### 3つの問い、1つの答え
[cite_start][cite: 65] スライドで定義されている「何をするか・なぜするか・どこに向かうか」を構造化して伝えます。

* [cite_start]**MISSION (What)**: テクノロジーで不動産取引をなめらかにする [cite: 60]
* [cite_start]**PURPOSE (Why)**: 生活の基盤である住まいの課題をテクノロジーで解決するため [cite: 66, 68]
* [cite_start]**VISION (Where)**: 不動産取引の「不」を解消し、なめらかな体験が当たり前になる世界へ [cite: 65, 69]

---

### 社会のインフラとしての圧倒的な実績
[cite_start][cite: 73, 80] イタンジのプラットフォームは、すでに日本の不動産取引において欠かせない存在となっています。

### _data/products.yml
product_categories:
  - title: "賃貸管理の業務支援"
    service_name: "ITANDI 賃貸管理"
    scope: ["入居時業務（物件・精算・家主管理）", "入居者管理", "空室時業務（原状回復・物件出稿・内見受付）"]
  - title: "賃貸仲介の業務支援"
    service_name: "ITANDI 賃貸仲介"
    scope: ["接客業務（物件出稿・反響対応・内見調整）", "申込・契約対応", "店舗運営業務（データ分析）"]
  - title: "不動産売買の業務支援"
    service_name: "ITANDI 売買"
    scope: ["売主仲介業務（査定・追客・営業報告）", "買主仲介業務（物件出稿・内見調整・契約対応）"]
  - title: "リアルタイム不動産業者間サイト"
    service_name: "ITANDI BB"
    description: "入居申込と空室情報を即座に同期。「おとり物件」を削減し、リーシング業務をオンラインで完結させるインフラ。"

### _sections/02-product.md
---
title: "Product"
slug: "product"
order: 2
---

## 巨大な不動産市場を、4つの垂直統合でハックする

 イタンジは、不動産取引の全工程をカバーするプロダクトラインナップを展開することで、**不動産取引をなめらかにしています**。

単一のSaaSを提供するのではなく、管理・仲介・売買、そして業者間流通のすべてを繋ぐことで、業界全体の体験を再定義しています。

### ITANDIのサービスラインナップ
各領域に特化したプロダクトが強固なデータ基盤によって連携し、シームレスな体験を実現します。

#### 1. 賃貸管理・仲介の業務支援
 物件管理から入居者管理、接客、契約対応まで。10秒に1件の内見予約が発生する巨大な流動性を支える業務システムです。

#### 2. 不動産売買の業務支援
 売主・買主双方の仲介業務をデジタル化し、透明性の高い取引を実現します。

#### 3. リアルタイム業者間サイト「ITANDI BB」
 業者間の空室情報を即座に同期。「おとり物件」を削減し、内見予約から契約までをオンラインでワンストップに行える、なめらかなリーシング業務を支えるインフラです。

### Vertical SaaSとしての開発の醍醐味
 
これら広範な業務ドメインを1つのプラットフォームとして統合するには、高度なモデリング能力と、複雑なステークホルダー間の整合性を保つアーキテクチャ設計が求められます。
私たちが扱うのは、単なる「便利なツール」ではなく、日本の住まいのインフラそのものです。

### _data/tech_stack.yml
tech_layers:
  - layer: "Application & Frontend"
    items: ["Ruby on Rails", "React", "TypeScript", "MySQL"]
  - layer: "ETL & Data Processing"
    items: ["digdag", "embulk", "Akka", "OpenSearch", "AWS DMS"]
  - layer: "Infrastructure & Platform"
    items: ["AWS", "Terraform"]
  - layer: "Data Analysis Foundation"
    items: ["Apache Airflow", "Google BigQuery"]

### _sections/03-technology.md
---
title: "Technology & Engineering"
slug: "technology"
order: 3
---

## サービスを支える技術スタック

### 大規模な不動産データをなめらかに循環させる
 イタンジのプロダクトは、お預かりした膨大な物件データを高速かつ正確に処理する堅牢なアーキテクチャで構成されています。

#### 1. データパイプラインと同期技術
 
digdagやembulkを用いたETL処理により、多様な形式のデータを物件データベースへと統合。
さらにAWS DMSやAkka、OpenSearchを活用することで、高度な検索体験とデータのリアルタイム同期を実現しています。

#### 2. アプリケーション開発
 
バックエンドにはRuby on Rails、フロントエンドにはReact/TypeScriptを採用。
複雑なドメインロジックをシンプルに保ちながら、10秒に1件の内見予約や年間100万件以上の申込を支えるスケーラブルなシステムを構築しています。

#### 3. データ解析基盤
 
各プロダクトから生まれる膨大なトランザクションデータは、Apache Airflowを通じてGoogle BigQueryへと集約されます。
私たちは、蓄積されたデータを活用して「不動産取引をなめらかにする」ための次なる一手（AI審査や自動レコメンド等）を模索し続けています。

---

### 負債を「資産」としてリファクタリングする
[cite_start][cite: 109-112, 170] 
この広大なシステム構成を維持・進化させるため、私たちは「Railsの定期アップグレード」や「リファクタリング」を技術的挑戦として楽しむ文化を大切にしています。

### _data/members.yml
[cite_start]# [cite: 213, 214] CTO大原さんの経歴を詳細に反映
leaders:
  - name: "大原 将真"
    role: "執行役員 CTO"
    image: "/assets/images/members/ohara.webp" # 写真素材がある場合
    profile: >
      中央大学商学部卒。卒業後、野村證券に総合職で入社し、リテール業務に従事。
      その後エンジニアに転業し、ECサイトの開発責任者やB2B向けシステムの新規立ち上げの開発・運用に携わる。
      2020年3月にイタンジに入社し、主に基盤プロダクトの開発、SREの責任者を担当。
      2023年11月1日、執行役員CTOに就任。エンジニア組織の責任者として、開発、マネジメント、採用や技術広報も担う。

### _sections/04-organization.md
---
title: "Organization & Team"
slug: "organization"
order: 4
---

## 開発組織とリーダーシップ

### 100名体制を目指す、エンジニアリング組織
[cite_start][cite: 8, 128-130] イタンジは現在、さらなる事業拡大に向けてエンジニア組織を100名体制へと拡大するフェーズにあります。各プロダクトを独立したユニットとして構成し、意思決定のスピードとドメインへの深いコミットを両立しています。

### リーダーシップ：ビジネスと技術の融合
[cite_start][cite: 53-55, 133, 213, 214] 
執行役員CTOの大原は、野村證券でのリテール業務からキャリアをスタートし、エンジニア転業後はB2Bシステムの立ち上げやSRE責任者を歴任してきました。

この「ビジネスの現場」と「高度な技術基盤」の両方を知るリーダーシップこそが、イタンジの「技術のための技術に陥らない、本質的な課題解決」を重視するエンジニアリング文化の源泉です。

### 柔軟でプロフェッショナルな働き方
[cite_start][cite: 138-141, 190] 
私たちは、個々のエンジニアがアウトプットを最大化できるよう、環境整備にも注力しています。

* **ハイブリッドワーク**: リモートワークと出社を組み合わせた柔軟な運用
* **フレックスタイム制**: コアタイムを設けた自律的な勤務体系
* **オフィス環境**: 六本木グランドタワー内に、円滑なコミュニケーションを支えるスペースを完備

### 成長と発信を支援する
[cite_start][cite: 121-125] 
カンファレンスへのスポンサー活動や技術ブログでの発信を通じ、個人の研鑽が組織の成長、ひいては業界全体のDXに繋がるサイクルを大切にしています。

### _data/benefits.yml
#
benefit_categories:
  - name: "社員の成長をサポート"
    items: ["自己研鑽制度", "エンジニア資格取得支援制度", "エンジニア向けスキルアップ全額サポート「テックチャージ」", "GALILEO（人財開発プログラム）", "オンライン英会話割引"]
  - name: "柔軟な働き方をサポート"
    items: ["フルフレックス制度", "時短勤務制度", "在宅勤務制度"]
  - name: "ライフステージの変化をサポート"
    items: ["家族手当 / 保育手当", "ベビーシッター手当", "出産準備休暇 / ベビーケア休暇", "ジョブリターン制度"]
  - name: "心身の健康をサポート"
    items: ["GA ALIVE（療養支援制度）", "健康診断 / インフルエンザワクチン接種", "スポーツジム・ホットヨガ法人会員", "ヘルスケアアプリ「HELPO」"]
  - name: "資産形成・その他"
    items: ["社員持株会", "確定拠出年金 / 確定給付年金", "住宅手当 / 通勤手当", "ふるさと納税給与天引「まん福」"]

### _sections/05-conditions.md
---
title: "HR & Conditions"
slug: "conditions"
order: 5
---

## 人事評価制度と福利厚生

### ミッショングレード制による評価

イタンジでは、期待されている役割（ミッション）の大きさとその成果によって等級や報酬を決定する「ミッショングレード制」を導入しています。

- **等級制度**: 求められる役割・能力・成果を1〜12段階のグレードで定義。
- **スペシャリスト・マネジメント双方の道**: グレード7（Senior）以上では、組織マネジメントを担う「MANAGEMENT」と、技術を極める「SPECIALIST（Fellowなど）」の2つのコースを選択可能です。

### 納得感を醸成する評価サイクル

OKRを用いた目標設定と、1on1を通じた継続的なフィードバックにより、成果だけでなくプロセスや姿勢も含めて適切に評価します。

1. **目標設定**: 組織・個人のOKRを設定し、期待値をすり合わせる。
2. **OJT / 1on1**: 定期的な対話による内省と成長支援。
3. **振り返り**: 成果と課題のすり合わせ。
4. **評価**: 年に一度、評価フィードバックを行い、等級や報酬を決定する。

### 多様な活躍を支援する福利厚生

「テックチャージ」によるスキルアップ支援や、フルフレックス・在宅勤務制度など、エンジニアが最高のパフォーマンスを発揮できる環境を整えています。

### _sections/06-closing.md
---
title: "Message & Next Action"
slug: "closing"
order: 6
---

## 不動産取引の未来を、共に創る

### CTO Message：ユーザーにとって価値のある開発を

イタンジが目指しているのは、単なる業務効率化ではありません。私たちはオープンプラットフォーム戦略を掲げ、不動産会社、オーナー、そして入居者がなめらかに繋がる「ITANDI経済圏」を創り上げようとしています。

#### AI時代の「質の深化」
AIによって開発スピードが上がる現代だからこそ、私たちは「質の深化」を求めています。単にコードを書くのではなく、AIを壁打ち相手にしながら、人間ひとりでは見落としていたエッジケースに気づき、新しい視点を得る。一人ひとりの知見をチームのナレッジへ昇華させ、最終的に「本当に価値のあるもの」を届けるのが私たちの開発哲学です。

#### 必要なのは、技術力以上の「情熱」
最初から不動産業界に強い関心があるエンジニアは多くないかもしれません。しかし、私たちは「GRIT（やり抜く力）」と「WILL（意志）」を持ち、プロダクトに夢中になれる集団でありたいと考えています。

トップを筆頭に、高い熱意をもって事業に取り組む文化に共感し、自らが誇りを持てるプロダクトをつくり続ける。その達成感を分かち合える100名体制の組織を、共に創っていきませんか。

---

### 選考フロー
1. **カジュアル面談**
   - まずはお互いのビジョンや「WILL」についてお話ししましょう。
2. **書類選考**
3. **面接（2回）**
   - 現場のエンジニアやリーダーと、開発哲学やチームへのフィット感を確認します。
4. **オファー**

---

### エントリー
イタンジの挑戦に興味を持ってくださった方は、募集要項をご確認の上、ぜひエントリーをお願いします。

[募集要項一覧・エントリーはこちら](https://herp.careers/careers/companies/itandi/jobs?parent-job-role-ids=engineer){: .btn .btn--primary }

[ITANDI Engineer Blog](https://tech.itandi.co.jp/){: .btn .btn--outline }

### assets/css/main.scss
:root {
  --primary-orange: #F06A33;
  --secondary-orange: #F49221;
  --dark-bg: #222222;
  --card-bg: #2D2D2D;
  --text-main: #FFFFFF;
  --text-muted: #CCCCCC;
  --accent-gradient: linear-gradient(135deg, #F06A33 0%, #F49221 100%);
}

body {
  background-color: var(--dark-bg);
  color: var(--text-main);
  font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
  line-height: 1.6;
}

/* ヒーローセクション [cite: 60-61] */
.hero {
  padding: 100px 0;
  text-align: center;
  background: radial-gradient(circle at center, #333333 0%, #222222 100%);
  
  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
  }
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin: 50px 0;
}

.metric-item {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 8px;
  border-left: 4px solid var(--primary-orange);
  
  .number {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--primary-orange);
  }
  
  .label {
    font-size: 0.9rem;
    color: var(--text-muted);
  }
}
.hexagon-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 60px 0;
}

.hexagon {
  width: 180px;
  height: 200px;
  background: var(--accent-gradient);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  
  .label-en { font-size: 0.8rem; font-weight: bold; opacity: 0.8; }
  .label-jp { font-size: 1.2rem; font-weight: bold; margin: 5px 0; }
  .q-text { font-size: 0.7rem; }
}
.btn {
  display: inline-block;
  padding: 15px 40px;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.btn--primary {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 4px 15px rgba(240, 106, 51, 0.3);
}

.btn--outline {
  border: 2px solid var(--primary-orange);
  color: var(--primary-orange);
}

.btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}
/* スクロール時のなめらかな表示 */
.section-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease-out;
}

.section-content.is-visible {
  opacity: 1;
  transform: translateY(0);
}