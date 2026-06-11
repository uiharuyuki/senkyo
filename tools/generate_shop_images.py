#!/usr/bin/env python3
"""Generate flat storefront illustrations for each sample store.

Style matches the site palette: flat shapes, no outlines
except soft borders. Output: assets/shop-<id>.svg (400x250).
"""

PALETTE = {
    "blue": "#1f6db2",
    "blue_deep": "#144f83",
    "green": "#43865b",
    "coral": "#d96f59",
    "amber": "#f3bb4f",
    "ink_soft": "#546577",
    "cream": "#fff7ea",
    "paper": "#fffdf8",
    "line": "#dfe8ef",
    "glass": "#cfe6f5",
    "wood": "#a3653a",
    "wood_dark": "#8a5430",
}


def awning(x, y, w, h, color, stripes=6):
    parts = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="7" fill="{color}"/>']
    step = w / stripes
    for i in range(stripes):
        if i % 2 == 0:
            sx = x + i * step + step * 0.18
            parts.append(
                f'<rect x="{sx:.1f}" y="{y}" width="{step * 0.64:.1f}" height="{h}" fill="#ffffff" opacity=".38"/>'
            )
    # scalloped bottom edge
    sc = []
    n = stripes
    sw = w / n
    for i in range(n):
        cx = x + sw * i + sw / 2
        sc.append(f'<circle cx="{cx:.1f}" cy="{y + h}" r="{sw / 2:.1f}" fill="{color}"/>')
        if i % 2 == 0:
            sc.append(
                f'<circle cx="{cx:.1f}" cy="{y + h}" r="{sw / 2:.1f}" fill="#ffffff" opacity=".38"/>'
            )
    return "\n  ".join(parts + sc)


def window_frame(x, y, w, h):
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{PALETTE["glass"]}"/>'
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="none" stroke="#ffffff" stroke-width="4"/>'
    )


def door(x, y, w, h, color):
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="{color}"/>'
        f'<circle cx="{x + w - 9}" cy="{y + h / 2}" r="3.5" fill="{PALETTE["cream"]}"/>'
        f'<rect x="{x + 7}" y="{y + 9}" width="{w - 14}" height="{h * 0.32:.0f}" rx="4" fill="#ffffff" opacity=".25"/>'
    )


def plant(x, y, scale=1.0):
    s = scale
    return (
        f'<rect x="{x - 9 * s:.1f}" y="{y - 14 * s:.1f}" width="{18 * s:.1f}" height="{14 * s:.1f}" rx="3" fill="{PALETTE["wood"]}"/>'
        f'<circle cx="{x:.1f}" cy="{y - 24 * s:.1f}" r="{12 * s:.1f}" fill="#6fae85"/>'
        f'<circle cx="{x - 9 * s:.1f}" cy="{y - 17 * s:.1f}" r="{8 * s:.1f}" fill="#85bd97"/>'
        f'<circle cx="{x + 9 * s:.1f}" cy="{y - 17 * s:.1f}" r="{8 * s:.1f}" fill="#85bd97"/>'
    )


def hanging_sign(x, y, glyph):
    return (
        f'<path d="M{x} {y - 12} v12" stroke="{PALETTE["wood_dark"]}" stroke-width="3"/>'
        f'<circle cx="{x}" cy="{y + 16}" r="17" fill="#ffffff" stroke="{PALETTE["line"]}" stroke-width="2.5"/>'
        f"{glyph}"
    )


def base(sky, facade_inner):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" aria-hidden="true">
  <rect width="400" height="250" fill="{sky}"/>
  <g fill="#ffffff" opacity=".85">
    <ellipse cx="62" cy="36" rx="30" ry="11"/>
    <ellipse cx="88" cy="28" rx="20" ry="9"/>
    <ellipse cx="330" cy="30" rx="26" ry="10"/>
  </g>
  <rect x="0" y="216" width="400" height="34" fill="#e9f3ec"/>
  <path d="M0 216h400" stroke="#cfe3d3" stroke-width="3"/>
  {facade_inner}
</svg>
"""


def facade(wall, awning_color, window_inner, sign_glyph, extra="", door_color=None, board=None):
    door_color = door_color or awning_color
    parts = []
    # building
    parts.append(f'<rect x="56" y="70" width="288" height="146" fill="{wall}" stroke="{PALETTE["line"]}" stroke-width="2.5"/>')
    # roofline
    parts.append(f'<rect x="48" y="58" width="304" height="14" rx="4" fill="{PALETTE["ink_soft"]}" opacity=".25"/>')
    # awning
    parts.append(awning(48, 76, 304, 26, awning_color))
    # display window + contents
    parts.append(window_frame(84, 126, 140, 64))
    parts.append(window_inner)
    # door
    parts.append(door(252, 124, 56, 92, door_color))
    # hanging sign
    parts.append(hanging_sign(330, 96, sign_glyph))
    # plant by the door
    parts.append(plant(236, 216, 0.9))
    if board:
        parts.append(board)
    parts.append(extra)
    return "\n  ".join(parts)


def sandwich_board(x, y, color):
    return (
        f'<path d="M{x - 16} {y} l10 -34 h12 l10 34 z" fill="#ffffff" stroke="{PALETTE["line"]}" stroke-width="2.5"/>'
        f'<rect x="{x - 9}" y="{y - 26}" width="18" height="4" rx="2" fill="{color}"/>'
        f'<rect x="{x - 7}" y="{y - 18}" width="14" height="3" rx="1.5" fill="{PALETTE["line"]}"/>'
        f'<rect x="{x - 6}" y="{y - 12}" width="12" height="3" rx="1.5" fill="{PALETTE["line"]}"/>'
    )


stores = {}

# --- cafe: coral awning, cup in window, steam ---
cup = (
    '<g>'
    '<rect x="118" y="166" width="74" height="8" rx="4" fill="#e9d7c3"/>'
    '<path d="M138 146h26v10a12 12 0 0 1-12 12h-2a12 12 0 0 1-12-12z" fill="#ffffff" stroke="#d96f59" stroke-width="3"/>'
    '<path d="M164 149h4a5.5 5.5 0 0 1 0 11h-4" fill="none" stroke="#d96f59" stroke-width="3"/>'
    '<path d="M144 140c0-3 2.5-2.5 2.5-5.5M153 140c0-3 2.5-2.5 2.5-5.5" fill="none" stroke="#d96f59" stroke-width="2.5" stroke-linecap="round"/>'
    '</g>'
)
cup_glyph = (
    '<g fill="none" stroke="#d96f59" stroke-width="2.8" stroke-linecap="round">'
    '<path d="M322 110h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6z"/>'
    '<path d="M334 112h2.5a3 3 0 0 1 0 6h-2.5"/>'
    '</g>'
)
stores["hinata-cafe"] = base(
    "#fdeede",
    facade(PALETTE["paper"], PALETTE["coral"], cup, cup_glyph, board=sandwich_board(80, 216, PALETTE["coral"])),
)

# --- bakery: green awning, bread on shelves ---
breads = (
    '<g>'
    '<rect x="100" y="150" width="108" height="5" rx="2.5" fill="#e9d7c3"/>'
    '<rect x="100" y="176" width="108" height="5" rx="2.5" fill="#e9d7c3"/>'
    '<ellipse cx="122" cy="143" rx="14" ry="9" fill="#d8a05e"/>'
    '<path d="M114 141c2 1.5 14 1.5 16 0" stroke="#b97c3c" stroke-width="2" fill="none" stroke-linecap="round"/>'
    '<ellipse cx="156" cy="143" rx="14" ry="9" fill="#c98d4b"/>'
    '<ellipse cx="188" cy="143" rx="12" ry="9" fill="#e0b070"/>'
    '<ellipse cx="138" cy="169" rx="14" ry="9" fill="#e0b070"/>'
    '<ellipse cx="172" cy="169" rx="14" ry="9" fill="#d8a05e"/>'
    '</g>'
)
bread_glyph = (
    '<path d="M321 117c0-4.5 5-7.5 9-7.5s9 3 9 7.5c0 2.3-1.6 3.8-3.8 3.8h-10.4c-2.2 0-3.8-1.5-3.8-3.8z" '
    'fill="none" stroke="#43865b" stroke-width="2.8" stroke-linecap="round"/>'
)
stores["mugi-bakery"] = base(
    "#eef6e9",
    facade(PALETTE["cream"], PALETTE["green"], breads, bread_glyph, board=sandwich_board(80, 216, PALETTE["green"])),
)

# --- books: blue awning, book spines ---
spines = (
    '<g stroke-linecap="round">'
    '<rect x="100" y="158" width="108" height="6" rx="3" fill="#e9d7c3"/>'
    '<path d="M114 154v-26" stroke="#d96f59" stroke-width="9"/>'
    '<path d="M129 154v-32" stroke="#43865b" stroke-width="9"/>'
    '<path d="M144 154v-22" stroke="#f3bb4f" stroke-width="9"/>'
    '<path d="M159 154v-29" stroke="#1f6db2" stroke-width="9"/>'
    '<path d="M174 154v-24" stroke="#d96f59" stroke-width="9"/>'
    '<path d="M192 154l8-26" stroke="#546577" stroke-width="9"/>'
    '</g>'
)
book_glyph = (
    '<g fill="none" stroke="#1f6db2" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">'
    '<path d="M330 109c-1.8-1.6-4.5-2.2-7.5-2.2v13.4c3 0 5.7.6 7.5 2.2 1.8-1.6 4.5-2.2 7.5-2.2v-13.4c-3 0-5.7.6-7.5 2.2z"/>'
    '<path d="M330 109v13.4"/>'
    '</g>'
)
stores["komichi-books"] = base(
    "#e8f1fa",
    facade(PALETTE["paper"], PALETTE["blue"], spines, book_glyph),
)

# --- zakka: amber awning, shelf with boxes and plant ---
shelf = (
    '<g>'
    '<rect x="100" y="150" width="108" height="5" rx="2.5" fill="#e9d7c3"/>'
    '<rect x="100" y="176" width="108" height="5" rx="2.5" fill="#e9d7c3"/>'
    '<rect x="108" y="132" width="20" height="16" rx="3" fill="#d96f59"/>'
    '<rect x="134" y="136" width="16" height="12" rx="3" fill="#1f6db2"/>'
    '<circle cx="166" cy="141" r="8" fill="#43865b"/>'
    '<rect x="184" y="132" width="14" height="16" rx="3" fill="#f3bb4f"/>'
    '<rect x="112" y="160" width="16" height="14" rx="3" fill="#85bd97"/>'
    '<rect x="138" y="162" width="22" height="12" rx="3" fill="#f2c6a0"/>'
    '<circle cx="180" cy="167" r="7" fill="#d96f59"/>'
    '</g>'
)
gift_glyph = (
    '<g fill="none" stroke="#b8860b" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">'
    '<rect x="323" y="110" width="14" height="11" rx="2"/>'
    '<path d="M323 114h14M330 110v11M330 110c-3 0-4.5-1.2-4.5-2.7s2.5-2 4.5 2.7c2-4.7 4.5-4.2 4.5-2.7s-1.5 2.7-4.5 2.7z"/>'
    '</g>'
)
stores["aoi-zakka"] = base(
    "#fdf3e0",
    facade(PALETTE["paper"], PALETTE["amber"], shelf, gift_glyph),
)

# --- diner: deep blue awning + noren, bowl in window ---
bowl = (
    '<g>'
    '<rect x="116" y="172" width="78" height="7" rx="3.5" fill="#e9d7c3"/>'
    '<path d="M132 152h46a23 23 0 0 1-12 18h-22a23 23 0 0 1-12-18z" fill="#ffffff" stroke="#144f83" stroke-width="3"/>'
    '<path d="M143 146c0-3.5 3-3 3-6.5M155 146c0-3.5 3-3 3-6.5M167 146c0-3.5 3-3 3-6.5" '
    'fill="none" stroke="#144f83" stroke-width="2.5" stroke-linecap="round"/>'
    '</g>'
)
noren = (
    '<g fill="#144f83" opacity=".88">'
    '<rect x="256" y="124" width="14" height="34" rx="2"/>'
    '<rect x="273" y="124" width="14" height="34" rx="2"/>'
    '<rect x="290" y="124" width="14" height="34" rx="2"/>'
    '</g>'
    '<circle cx="280" cy="142" r="5" fill="#ffffff" opacity=".9"/>'
)
bowl_glyph = (
    '<g fill="none" stroke="#144f83" stroke-width="2.8" stroke-linecap="round">'
    '<path d="M321 113h18a9.5 9.5 0 0 1-5 7.5h-8a9.5 9.5 0 0 1-5-7.5z"/>'
    '<path d="M327 109c0-2 1.5-1.5 1.5-3.5M333 109c0-2 1.5-1.5 1.5-3.5"/>'
    '</g>'
)
stores["michikusa-diner"] = base(
    "#eef6f3",
    facade(PALETTE["cream"], PALETTE["blue_deep"], bowl, bowl_glyph, extra=noren, board=sandwich_board(80, 216, PALETTE["blue_deep"])),
)

# --- used clothes: slate awning, hanging shirts on a rail ---
rail = (
    '<g>'
    '<path d="M100 136h108" stroke="#8a5430" stroke-width="4" stroke-linecap="round"/>'
    '<g stroke-linecap="round" stroke-linejoin="round">'
    '<path d="M118 136v6l-7 5 4 6 3-2v17h16v-17l3 2 4-6-7-5v-6" fill="#d96f59" stroke="#d96f59" stroke-width="2"/>'
    '<path d="M152 136v6l-7 5 4 6 3-2v17h16v-17l3 2 4-6-7-5v-6" fill="#43865b" stroke="#43865b" stroke-width="2"/>'
    '<path d="M186 136v6l-7 5 4 6 3-2v17h16v-17l3 2 4-6-7-5v-6" fill="#1f6db2" stroke="#1f6db2" stroke-width="2"/>'
    '</g>'
    '</g>'
)
shirt_glyph = (
    '<path d="M326 107.5 330 110l4-2.5 5 3.5-2.5 3.5-2-1.2V124h-9v-10.7l-2 1.2-2.5-3.5z" '
    'fill="none" stroke="#546577" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'
)
stores["stroll-used"] = base(
    "#eef1f5",
    facade(PALETTE["paper"], PALETTE["ink_soft"], rail, shirt_glyph),
)


if __name__ == "__main__":
    import pathlib

    out = pathlib.Path(__file__).resolve().parent.parent / "assets"
    for store_id, svg in stores.items():
        path = out / f"shop-{store_id}.svg"
        path.write_text(svg, encoding="utf-8")
        print(f"wrote {path.name} ({len(svg)} bytes)")
