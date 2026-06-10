# Project Notes for Codex and Claude Code

This file must stay in sync with the companion agent instruction file. If one is updated, update the other in the same change.

## Project

Repository:

```text
https://github.com/uiharuyuki/senkyo
```

This is a static, mobile-first LP for the Inage youth election project. The landing page is opened from a QR code on a voting certificate.

Core concept:

```text
投票した帰りに、稲毛を少し歩きたくなる。
```

## Current Architecture

Use the current production-oriented static structure:

```text
index.html    QR landing page. First view, single main CTA, site intro, how-to-use.
shops.html    Shop listing page. Card list, search, genre filters.
shop.html     Shop detail template. Reads ?id=... and renders one store.
faq.html      Q&A page for expansion.
stores.json   Store, product, condition, and map-query data.
app.js        Renders shop list and shop details.
style.css     Shared mobile-first styles. No hero image dependency.
```

Old proposal-deck files and temporary LP draft files were removed. Do not reintroduce the old presentation-style `index.html` / `script.js` / `index.md` pattern.

## User Flow

1. QR opens `index.html`
2. User sees the first view
3. User taps `特典を見る！`
4. User lands on `shops.html`
5. User selects a shop card
6. User checks target products on `shop.html?id=...`
7. User opens Google Maps from the shop card or detail page
8. User visits the shop

## UX Rules

- Mobile-first.
- The first view should have one primary CTA: `特典を見る！`.
- Do not add a secondary first-view map CTA.
- Do not embed a map.
- Do not depend on hero images unless the user explicitly asks for images.
- Map links should open Google Maps search in a new tab using `target="_blank"` and `rel="noopener noreferrer"`.
- Shop listing should be card-based.
- Shop detail should show target products, benefit content, and conditions.
- Store data should live in `stores.json`; do not hard-code 50 shops into HTML.
- Q&A can remain a separate page and be expanded later.

## Content Rules

- Keep `地域回遊` and `地域応援` as the main framing.
- Do not make discounts the main value proposition.
- Avoid wording that makes benefits sound like direct compensation for voting.
- If stores are not confirmed, mark them clearly as samples.
- Clarify that benefits and conditions may vary by participating shop.
- Before real-world use, voting certificate wording, campaign mechanics, benefit conditions, and election-administration constraints must be checked with relevant stakeholders.

## Implementation Rules

- Keep the implementation plain HTML, CSS, and JavaScript unless the user explicitly asks for a framework.
- Preserve semantic HTML, visible focus states, useful alt text, and readable contrast.
- Update `stores.json` for new shops/products.
- Update both `AGENTS.md` and `CLAUDE.md` together.
- If frontend changes are significant and browser tooling is available, verify the page visually.
