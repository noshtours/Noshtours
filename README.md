# Nosh Tours — Drop-in Replacement Pack
**Generated:** 26 May 2026 · **For:** Aditya TG · **Target:** push to `staged` branch

---

## ⚠️ READ THIS BEFORE YOU COMMIT

### 1. The `staged` branch is EMPTY right now

I probed every common file on raw.githubusercontent.com/noshtours/Noshtours/staged/ — all returned 404. Before committing these files to staged, you need to refresh the branch from main:

```bash
git fetch origin
git checkout main && git pull
git checkout staged
git reset --hard main
git push --force-with-lease origin staged
```

Then drop these 10 files into the repo root and commit.

### 2. I did NOT include `vercel.json` in this ZIP

Your existing production `vercel.json` on main is significantly more comprehensive than my earlier proposal. It has the image-proxy rewrite (which is HOW images even serve on your site), all 6 blog URL rewrites, HSTS, and per-content cache headers. Do NOT replace it. The existing one stays as-is on main and will carry over when you refresh staged from main.

### 3. After committing these 10 HTML files

You still need to upload **31 missing images** to `/images/` in your repo before the staged site looks correct. See `_audit/noshtours_PARANOID_AUDIT_FINAL.md` for the full list with paths.

---

## File-by-file mapping

| Filename in ZIP                            | Replaces / Creates | Live URL after deploy                      |
|--------------------------------------------|--------------------|--------------------------------------------|
| `index.html`                               | REPLACES existing  | `/`                                        |
| `about.html`                               | REPLACES existing  | `/about`                                   |
| `india.html`                               | REPLACES existing  | `/india`                                   |
| `international.html`                       | REPLACES existing  | `/international`                           |
| `destinations.html`                        | REPLACES existing  | `/destinations`                            |
| `wellness.html`                            | REPLACES existing  | `/wellness`                                |
| `nosh-block-builder.html`                  | REPLACES existing  | `/nosh-block-builder` (Indian form)        |
| `nosh-block-builder-international.html`    | **NEW FILE**       | `/nosh-block-builder-international`        |
| `blog-listing.html`                        | **NEW FILE**       | `/blog` (existing vercel.json rewrites)    |
| `journal.html`                             | **NEW FILE**       | `/journal`                                 |

## What's inside every file

- Fraunces (display) + Manrope (body) — only two fonts loaded
- Identical canonical Google Fonts link across all 10 files
- Consistent CSS variable system: `--ff-display` / `--ff-body`
- Cream + sage + Nosh orange + deep forest palette
- Mobile-first layouts
- Sticky WhatsApp CTA bar
- Brand wordmark uses lowercase `nosh.tours` + orange dot
- Footer one-liner: "Made with ☮︎ at Mumbai, Maharashtra · © 2026 Nosh Tours LLP"

## ⚠️ Known P0/P1 issues these files still contain

These are documented in `_audit/noshtours_PARANOID_AUDIT_FINAL.md`. I can fix them all in 30 minutes if you say go on Tier 0 — just send a confirmation message.

1. Forms have no `action=` attribute → bare submit goes nowhere
2. Inputs lack `autocomplete=` and `inputmode=` hints (mobile UX hurt)
3. Zero favicons, zero PWA manifest, zero theme-color
4. Zero analytics (GA4, Pixel, Clarity) — install via Google Tag Manager
5. Zero Schema.org JSON-LD markup
6. Zero `og:image` meta tags
7. Duplicate `id="modalHints"` on india.html
8. 6 H1/H2 headings have whitespace-collapse from `<br>` (text reads "youactually" to crawlers)
9. blog-listing.html has no `<h1>` tag
10. Zero `loading="lazy"` on `<img>` tags

---

## Quick commit recipe (works on mobile GitHub)

1. Open `https://github.com/noshtours/Noshtours` on phone
2. Branch dropdown → select `staged` (or refresh from main first using desktop)
3. Tap "Add file" → "Upload files"
4. Drag all 10 .html files from this ZIP
5. Commit message: `replace: 10 pages unified to Fraunces+Manrope, add intl form + journal`
6. Vercel auto-deploys to `noshtours-git-staged-noshtours-8674s-projects.vercel.app`
7. Share preview URL with designer
8. Designer leaves toolbar comments → next batch fixes them

---

## Filename decision rationale

- **`blog-listing.html`** instead of `blog.html` because your existing vercel.json has `{ "source": "/blog", "destination": "/blog-listing" }`. Naming it `blog-listing.html` means /blog still works without any vercel.json edits.
- **`nosh-block-builder.html`** keeps your existing URL pattern. All inbound links and the 9 toolbar bug threads referencing this URL stay valid.
- **`nosh-block-builder-international.html`** is new — the international canvas form was a separate file I created for clarity. With cleanUrls enabled it's accessible at `/nosh-block-builder-international` automatically.
- **`journal.html`** is new — your existing setup uses /blog for articles; /journal is the new long-form editorial section.

## What's in _audit/

Three audit documents from this session:
- `noshtours_PARANOID_AUDIT_FINAL.md` — the verified ground-truth audit (tonight)
- `noshtours_4BOT_AUDIT_TONIGHT.md` — the original 4-bot synthesis (earlier tonight)
- `noshtours_360_tech_audit_2026-05-26.md` — the prior tech audit document

You can commit these to a /docs folder in the repo or keep them locally.
