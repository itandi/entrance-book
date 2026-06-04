#!/usr/bin/env python3
"""
note/技術ブログ記事のOGP画像を取得してローカルに保存し、YAMLデータを更新するスクリプト。

処理内容:
  1. _data/member_articles.yml / _data/blogs.yml の imageなしエントリの OGP 画像を取得
  2. RSS フィードから技術ブログ・技術広報ブログの記事一覧を取得し OGP 画像付きで YAML 生成
     - _data/tech_blog_posts.yml  (ITANDI Engineer Blog)
     - _data/pr_blog_posts.yml    (技術広報ブログ)
"""

import os
import re
import sys
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).parent.parent
DATA_DIR = REPO_ROOT / "_data"
IMAGE_DIR = REPO_ROOT / "assets" / "images" / "note"
IMAGE_URL_PREFIX = "/assets/images/note"

# imageなしエントリの補完対象
YAML_TARGET_FILES = [
    DATA_DIR / "member_articles.yml",
    DATA_DIR / "blogs.yml",
]

NOTE_DOMAINS = {"note.com", "shanaiho.itandi.co.jp"}

# RSSから生成する記事データ
RSS_FEEDS = [
    {
        "rss_url": "https://tech.itandi.co.jp/rss",
        "output_file": DATA_DIR / "tech_blog_posts.yml",
        "limit": 6,
    },
    {
        "rss_url": "https://shanaiho.itandi.co.jp/m/m7e4e938c8e73/rss",
        "output_file": DATA_DIR / "pr_blog_posts.yml",
        "limit": 3,
    },
]


# ---------------------------------------------------------------------------
# HTTP / HTML ユーティリティ
# ---------------------------------------------------------------------------

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; entrance-book-bot/1.0; "
        "+https://github.com/itandi/entrance-book)"
    )
}


def http_get_bytes(url: str, timeout: int = 15) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except Exception as e:
        print(f"  [WARN] GET失敗 {url}: {e}", file=sys.stderr)
        return None


def http_get_text(url: str, timeout: int = 15) -> str | None:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            charset = resp.headers.get_content_charset() or "utf-8"
            return resp.read().decode(charset, errors="replace")
    except Exception as e:
        print(f"  [WARN] GET失敗 {url}: {e}", file=sys.stderr)
        return None


class OGPParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.og_image = None
        self.og_title = None

    def handle_starttag(self, tag, attrs):
        if tag != "meta":
            return
        attr_dict = dict(attrs)
        prop = attr_dict.get("property", "") or attr_dict.get("name", "")
        content = attr_dict.get("content", "")
        if prop == "og:image" and not self.og_image:
            self.og_image = content
        if prop == "og:title" and not self.og_title:
            self.og_title = content


def fetch_ogp(url: str) -> tuple[str | None, str | None]:
    """URLからog:imageとog:titleを取得する。"""
    html = http_get_text(url)
    if not html:
        return None, None
    parser = OGPParser()
    parser.feed(html)
    return parser.og_image, parser.og_title


def url_to_filename(article_url: str, image_url: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9_-]", "_", article_url.rstrip("/").split("/")[-1])
    ext = os.path.splitext(image_url.split("?")[0])[-1] or ".jpg"
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        ext = ".jpg"
    return f"{slug}{ext}"


def download_image(image_url: str, dest: Path) -> bool:
    data = http_get_bytes(image_url)
    if data is None:
        return False
    dest.write_bytes(data)
    return True


def save_image(article_url: str, og_image_url: str) -> str | None:
    """画像をダウンロードしてローカルパスを返す。"""
    filename = url_to_filename(article_url, og_image_url)
    dest = IMAGE_DIR / filename
    print(f"  [DL] {og_image_url} -> {dest.name}")
    if download_image(og_image_url, dest):
        return f"{IMAGE_URL_PREFIX}/{filename}"
    return None


# ---------------------------------------------------------------------------
# 1. YAMLファイルの imageなしエントリ補完
# ---------------------------------------------------------------------------

def is_note_url(url: str) -> bool:
    return any(domain in url for domain in NOTE_DOMAINS)


def process_yaml_file(yml_path: Path) -> bool:
    with open(yml_path, encoding="utf-8") as f:
        entries = yaml.safe_load(f) or []

    changed = False
    for entry in entries:
        url = entry.get("url", "")
        if not is_note_url(url):
            continue
        if entry.get("image"):
            print(f"  [SKIP] image設定済み: {url}")
            continue

        print(f"  [FETCH] OGP取得: {url}")
        og_image, og_title = fetch_ogp(url)
        if not og_image:
            print(f"  [WARN] OGP画像が見つかりません: {url}")
            continue

        local_path = save_image(url, og_image)
        if not local_path:
            continue

        entry["image"] = local_path
        if not entry.get("alt"):
            entry["alt"] = og_title or entry.get("title", "")
        changed = True
        print(f"  [OK] image設定: {local_path}")

    if changed:
        with open(yml_path, "w", encoding="utf-8") as f:
            yaml.dump(entries, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
        print(f"  [SAVED] {yml_path.name}")

    return changed


# ---------------------------------------------------------------------------
# 2. RSSフィードから記事一覧を生成
# ---------------------------------------------------------------------------

NS = {
    "dc": "http://purl.org/dc/elements/1.1/",
    "content": "http://purl.org/rss/1.0/modules/content/",
}


def parse_rss(xml_bytes: bytes) -> list[dict]:
    """RSS XMLをパースして記事リストを返す。"""
    root = ET.fromstring(xml_bytes)
    channel = root.find("channel")
    if channel is None:
        return []

    items = []
    for item in channel.findall("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub_date = (item.findtext("pubDate") or "").strip()
        if not link:
            continue
        # 日付を YYYY-MM-DD に正規化
        date_str = pub_date[:16] if pub_date else ""
        items.append({"title": title, "url": link, "pub_date": date_str})
    return items


def fetch_rss_feed(feed_config: dict) -> bool:
    rss_url = feed_config["rss_url"]
    output_file: Path = feed_config["output_file"]
    limit: int = feed_config["limit"]

    print(f"\nRSSフェッチ: {rss_url}")
    xml_bytes = http_get_bytes(rss_url)
    if not xml_bytes:
        print(f"  [WARN] RSSの取得に失敗しました。")
        return False

    items = parse_rss(xml_bytes)[:limit]
    if not items:
        print(f"  [WARN] 記事が見つかりませんでした。")
        return False

    # 既存データを読み込んでURLをキーにしたマップを作成
    existing: dict[str, dict] = {}
    if output_file.exists():
        with open(output_file, encoding="utf-8") as f:
            existing_list = yaml.safe_load(f) or []
        existing = {e["url"]: e for e in existing_list if "url" in e}

    result = []
    for item in items:
        url = item["url"]
        entry = existing.get(url, {}).copy()
        entry.setdefault("title", item["title"])
        entry.setdefault("url", url)
        entry.setdefault("pub_date", item["pub_date"])

        # 画像が未取得の場合のみ OGP フェッチ
        if not entry.get("image"):
            print(f"  [FETCH] OGP取得: {url}")
            og_image, og_title = fetch_ogp(url)
            if og_image:
                local_path = save_image(url, og_image)
                if local_path:
                    entry["image"] = local_path
                    entry.setdefault("alt", og_title or item["title"])
                    print(f"  [OK] image設定: {local_path}")
            else:
                print(f"  [WARN] OGP画像なし: {url}")
        else:
            print(f"  [SKIP] image設定済み: {url}")

        result.append(entry)

    with open(output_file, "w", encoding="utf-8") as f:
        yaml.dump(result, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    print(f"  [SAVED] {output_file.name} ({len(result)}件)")
    return True


# ---------------------------------------------------------------------------
# メイン
# ---------------------------------------------------------------------------

def main():
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    # 1. YAMLファイルの imageなしエントリ補完
    print("=== YAMLエントリのOGP画像補完 ===")
    for yml_path in YAML_TARGET_FILES:
        print(f"\n処理中: {yml_path.name}")
        process_yaml_file(yml_path)

    # 2. RSSフィードから記事一覧を生成
    print("\n=== RSSフィードから記事データを生成 ===")
    for feed_config in RSS_FEEDS:
        fetch_rss_feed(feed_config)

    print("\n完了")


if __name__ == "__main__":
    main()
