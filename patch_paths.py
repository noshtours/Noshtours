#!/usr/bin/env python3
"""
Nosh Tours — GitHub Image Path Patcher v1.0

Converts root-relative asset paths (/images/, /logo.png, /mobile.css)
to absolute raw.githubusercontent.com URLs so assets load correctly on
GitHub Pages, custom domain (noshtours.com), localhost, or any preview env.

Usage:
    python3 patch_paths.py file.html              # outputs file.patched.html
    python3 patch_paths.py *.html --inplace       # overwrites originals
    python3 patch_paths.py file.html -o out.html  # writes to out.html

Conversion rules (Option A — raw GitHub URLs):
    /images/X.jpg      →  https://raw.githubusercontent.com/noshtours/Noshtours/main/images/X.jpg
    /logo.png          →  https://raw.githubusercontent.com/noshtours/Noshtours/main/logo.png
    /mobile.css        →  https://raw.githubusercontent.com/noshtours/Noshtours/main/mobile.css

Navigation routes (/about, /destinations, /experience, /blog, /) are NEVER touched.
Absolute http(s) URLs and external CDN links are NEVER touched.
"""

import argparse
import glob
import re
import sys
from pathlib import Path

# ─── CONFIG ──────────────────────────────────────────────────────────────
GH_USER   = "noshtours"
GH_REPO   = "Noshtours"
GH_BRANCH = "main"
RAW_BASE  = f"https://raw.githubusercontent.com/{GH_USER}/{GH_REPO}/{GH_BRANCH}"

# Asset extensions that should be converted
ASSET_EXT = r"(?:jpg|jpeg|png|gif|svg|webp|ico|css|js|woff2?|ttf|otf|mp4|webm|pdf|xml)"

# Specific root-level files to convert (not under /images/)
ROOT_ASSETS = {"logo.png", "mobile.css", "favicon.ico", "robots.txt"}

# ─── PATTERNS ────────────────────────────────────────────────────────────
# Match /images/anything.ext   (in src="...", href="...", or url(...))
RE_IMAGES = re.compile(
    rf"""(?P<prefix>(?:src|href)\s*=\s*["']|url\(\s*["']?)(?P<path>/images/[^"')\s]+\.{ASSET_EXT})(?P<suffix>["']?\s*\)?|["'])""",
    re.IGNORECASE
)

# Match /logo.png, /mobile.css, /favicon.ico — single root-level assets
RE_ROOT_ASSET = re.compile(
    rf"""(?P<prefix>(?:src|href)\s*=\s*["']|url\(\s*["']?)(?P<path>/(?:logo\.png|mobile\.css|favicon\.ico))(?P<suffix>["']?\s*\)?|["'])""",
    re.IGNORECASE
)

def patch_html(html: str) -> tuple[str, dict]:
    """Apply patches. Returns (patched_html, stats_dict)."""
    stats = {"images": 0, "logo": 0, "mobile_css": 0, "favicon": 0}

    def sub_images(m):
        stats["images"] += 1
        return f"{m.group('prefix')}{RAW_BASE}{m.group('path')}{m.group('suffix')}"

    def sub_root(m):
        path = m.group('path').lower()
        if "logo" in path: stats["logo"] += 1
        elif "mobile" in path: stats["mobile_css"] += 1
        elif "favicon" in path: stats["favicon"] += 1
        return f"{m.group('prefix')}{RAW_BASE}{m.group('path')}{m.group('suffix')}"

    out = RE_IMAGES.sub(sub_images, html)
    out = RE_ROOT_ASSET.sub(sub_root, out)
    return out, stats


def process_file(path: Path, output: Path | None, inplace: bool) -> dict:
    html = path.read_text(encoding="utf-8")
    patched, stats = patch_html(html)
    total = sum(stats.values())

    if inplace:
        out_path = path
    elif output:
        out_path = output
    else:
        out_path = path.with_suffix(".patched.html")

    out_path.write_text(patched, encoding="utf-8")
    return {"file": str(path.name), "out": str(out_path), "total": total, **stats}


def main():
    ap = argparse.ArgumentParser(description="Patch Nosh Tours asset paths → raw GitHub URLs")
    ap.add_argument("files", nargs="+", help="HTML file(s) or glob(s)")
    ap.add_argument("--inplace", action="store_true", help="Overwrite originals")
    ap.add_argument("-o", "--output", help="Output file (single input only)")
    args = ap.parse_args()

    # Expand globs
    targets = []
    for pat in args.files:
        matched = glob.glob(pat)
        targets.extend(matched if matched else [pat])
    targets = [Path(t) for t in sorted(set(targets)) if Path(t).is_file()]

    if not targets:
        print("No files matched.", file=sys.stderr)
        sys.exit(1)

    if args.output and len(targets) > 1:
        print("--output only works with a single input file.", file=sys.stderr)
        sys.exit(1)

    print(f"{'File':<30} {'Images':>8} {'Logo':>6} {'Mobile':>8} {'Total':>7}  →  Output")
    print("─" * 90)
    grand_total = 0
    for p in targets:
        out_arg = Path(args.output) if args.output else None
        r = process_file(p, out_arg, args.inplace)
        grand_total += r["total"]
        print(f"{r['file']:<30} {r['images']:>8} {r['logo']:>6} {r['mobile_css']:>8} {r['total']:>7}  →  {Path(r['out']).name}")
    print("─" * 90)
    print(f"{'TOTAL':<30} {'':<8} {'':<6} {'':<8} {grand_total:>7}")


if __name__ == "__main__":
    main()
