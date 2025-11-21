#archive/utils.py
import requests
from bs4 import BeautifulSoup


def fetch_article_metadata(url: str) -> dict:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0 Safari/537.36"
        )
    }
    resp = requests.get(url, headers=headers, timeout=5)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    def get_meta(property=None, name=None):
        if property:
            tag = soup.find("meta", property=property)
        elif name:
            tag = soup.find("meta", attrs={"name": name})
        else:
            return None
        return tag.get("content") if tag and tag.get("content") else None

    title = (
        get_meta(property="og:title")
        or (soup.title.string.strip() if soup.title else "")
    )
    description = (
        get_meta(property="og:description")
        or get_meta(name="description")
        or ""
    )
    image = get_meta(property="og:image") or ""

    press = get_meta(property="og:article:author") or ""

    return {
        "title": title,
        "summary": description,
        "image": image,
        "press": press,
    }
