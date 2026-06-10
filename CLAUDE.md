# Project Notes for Codex and Claude Code

This file must stay in sync with the companion agent instruction file. If one is updated, update the other in the same change.

## Project

Repository:

```text
https://github.com/uiharuyuki/senkyo
```

The project is a static LP for the Inage youth election project. The LP is opened from a QR code on a voting certificate.

Core concept:

```text
投票した帰りに、稲毛を少し歩きたくなる。
```

The page should not feel like a generic presentation deck. It should be a practical destination page for someone who has just scanned the QR code after voting.

Existing `index.html`, `style.css`, and `script.js` are reference material only. Do not treat them as the source for the new LP unless the user explicitly asks. The current LP draft is separated into `lp.html` and `lp.css`.

## Current Direction

The user flow should be:

1. QR opens the site
2. User sees the first view
3. User taps `特典を見る！`
4. User checks target shops or products
5. User reads how-to and Q&A to remove uncertainty
6. User opens the map in a new tab
7. User visits a nearby shop

## Required LP Sections

Build around these sections:

- First view
- Target shops or target products
- How to use
- Q&A
- CTA: `特典を見る！`
- Map link that opens in a new tab
- Visit / closing section

## First View Requirements

The first view must immediately answer:

- What is this page?
- What can the user do here?
- What should the user tap next?

Recommended copy direction:

```text
投票おつかれさまでした。
帰り道に寄れる、稲毛の地域応援スポットを見つけよう。
```

Recommended CTAs:

- Main: `特典を見る！`
- Secondary: `地図で近くのお店を探す`

Do not bury the CTA below a long concept explanation.

## Content Rules

- Keep `地域回遊` and `地域応援` as the main framing.
- Do not make discounts the main value proposition.
- Avoid wording that makes the benefit sound like direct compensation for voting.
- Before real-world use, the voting certificate wording, campaign mechanics, and benefit conditions must be checked with the relevant election administration and stakeholders.
- If stores are not confirmed, mark them clearly as samples.
- Do not imply that sample shops or benefits are real.
- Clarify that benefits and conditions may vary by participating shop.

## UX Rules

- Mobile-first.
- The user has likely scanned the QR while outside, so make the next action obvious.
- Use a sticky bottom CTA on mobile if it does not obscure content.
- Put `特典を見る！` near the top, before the user has to read details.
- Put Q&A near the conversion point, not only at the very bottom.
- Map links must open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- Store cards should show the benefit first, then the shop name, then conditions.

## Suggested Information Architecture

Use this order unless the user requests otherwise:

1. `#hero` First view
2. `#benefits` Target shops / products / benefits
3. `#how-to-use` How to use
4. `#faq` Q&A
5. `#map` Map CTA
6. `#visit` Closing / visit encouragement

## Implementation Rules

- Keep the implementation as plain HTML, CSS, and JavaScript unless the user explicitly asks for a framework.
- Keep existing `index.html`, `style.css`, and `script.js` as reference material unless the user explicitly asks to edit them.
- The new LP draft should live in `lp.html` and `lp.css` until the user decides how to publish or rename it.
- Keep the existing local images only if they support the LP. Remove presentation-only sections when building the real LP.
- Preserve accessibility basics: semantic sections, real links for navigation, useful alt text, visible focus states, and readable contrast.

## Human Planning File

`README.md` is the human-facing planning file. It contains the current critique, suggested LP flow, and implementation direction.
