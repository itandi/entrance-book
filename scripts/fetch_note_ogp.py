#!/usr/bin/env python3
"""
note記事のOGP画像を取得してローカルに保存し、YAMLデータを更新するスクリプト。
imageフィールドが未設定のエントリのみ処理する（手動設定済みの画像は保持）。
"""

import hashlib
import os
import re
import sys
import urllib.request
import urllib.error
from html.parser import HTMLParser
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).parent.parent
DATA_DIR = REPO_ROOT / "_data"
IMAGE_DIR = REPO_ROOT / "assets" / "images" / "note"
IMAGE_URL_PREFIX = "/assets/images/note"

TARGET_FILES = [
    DATA_DIR / "member_articles.yml",
    DATA_DIR / "blogs.yml",
]

NOTE_DOMAINS = {"note.com", "shanaiho.itandi.co.jp"}


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


def is_note_url(url: str) -> bool:
    for domain in NOTE_DOMAINS:
        if domain in url:
            return True
    return False


def fetch_ogp(url: str) -> tuple[str | None, str | None]:
    """URLからog:imageとog:titleを取得する。"""
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (compatible; entrance-book-bot/1.0; "
                    "+https://github.com/itandi/entrance-book)"
                )
            },
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            charset = resp.headers.get_content_charset() or "utf-8"
            html = resp.read().decode(charset, errors="replace")
    except (urllib.error.URLError, Exception) as e:
        print(f"  [WARN] fetch失敗 {url}: {e}", file=sys.stderr)
        return None, None

    parser = OGPParser()
    parser.feed(html)
    return parser.og_image, parser.og_title


def url_to_filename(article_url: str, image_url: str) -> str:
    """記事URLから決定論的なファイル名を生成する。"""
    slug = re.sub(r"[^a-zA-Z0-9_-]", "_", article_url.rstrip("/").split("/")[-1])
    ext = os.path.splitext(image_url.split("?")[0])[-1] or ".jpg"
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        ext = ".jpg"
    return f"{slug}{ext}"


def download_image(image_url: str, dest: Path) -> bool:
    """画像をダウンロードして保存する。"""
    try:
        req = urllib.request.Request(
            image_url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (compatible; entrance-book-bot/1.0)"
                )
            },
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"  [WARN] 画像ダウンロード失敗 {image_url}: {e}", file=sys.stderr)
        return False


def process_file(yml_path: Path) -> bool:
    """YAMLファイルを読み込み、imageなしのnote記事を処理して上書き保存する。"""
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

        filename = url_to_filename(url, og_image)
        dest = IMAGE_DIR / filename

        print(f"  [DL] {og_image} -> {dest}")
        if not download_image(og_image, dest):
            continue

        entry["image"] = f"{IMAGE_URL_PREFIX}/{filename}"
        if not entry.get("alt"):
            entry["alt"] = og_title or entry.get("title", "")
        changed = True
        print(f"  [OK] image設定: {entry['image']}")

    if changed:
        with open(yml_path, "w", encoding="utf-8") as f:
            yaml.dump(
                entries,
                f,
                allow_unicode=True,
                default_flow_style=False,
                sort_keys=False,
            )
        print(f"  [SAVED] {yml_path}")

    return changed


def main():
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    any_changed = False
    for yml_path in TARGET_FILES:
        print(f"\n処理中: {yml_path.name}")
        if process_file(yml_path):
            any_changed = True

    if any_changed:
        print("\n完了: YAMLと画像を更新しました。")
    else:
        print("\n完了: 更新対象はありませんでした。")


if __name__ == "__main__":
    main()
