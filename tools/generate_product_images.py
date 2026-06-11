#!/usr/bin/env python3
"""Generate flat product illustrations for stores.json products.

Style matches the storefront illustrations: flat shapes, site palette.
Output: assets/product-<name>.svg (200x150).
"""


def base(bg, inner):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" aria-hidden="true">
  <rect width="200" height="150" fill="{bg}"/>
  <circle cx="100" cy="78" r="52" fill="#ffffff" opacity=".75"/>
  {inner}
</svg>
"""


products = {}

# --- cafe: blend coffee ---
products["coffee"] = base(
    "#fdeede",
    '<ellipse cx="100" cy="104" rx="40" ry="7" fill="#e9d7c3"/>'
    '<path d="M76 70h44v14a20 20 0 0 1-20 20h-4a20 20 0 0 1-20-20z" fill="#ffffff" stroke="#d96f59" stroke-width="4"/>'
    '<path d="M120 75h6a9 9 0 0 1 0 18h-7" fill="none" stroke="#d96f59" stroke-width="4"/>'
    '<ellipse cx="98" cy="74" rx="17" ry="4.5" fill="#8a5430"/>'
    '<path d="M88 60c0-5 4-4 4-9M100 60c0-5 4-4 4-9" fill="none" stroke="#d96f59" stroke-width="3.5" stroke-linecap="round"/>',
)

# --- cafe: seasonal soda ---
products["soda"] = base(
    "#eef6f3",
    '<ellipse cx="100" cy="112" rx="34" ry="6" fill="#dcebe2"/>'
    '<path d="M84 56h32l-4 54h-24z" fill="#dff0f9" stroke="#1f6db2" stroke-width="4" stroke-linejoin="round"/>'
    '<path d="M87 70h26l-3 36h-20z" fill="#9fd0e8"/>'
    '<circle cx="95" cy="88" r="3.5" fill="#ffffff"/>'
    '<circle cx="104" cy="78" r="3" fill="#ffffff"/>'
    '<circle cx="98" cy="99" r="2.5" fill="#ffffff"/>'
    '<path d="M108 58 120 38" stroke="#d96f59" stroke-width="4" stroke-linecap="round"/>'
    '<circle cx="86" cy="54" r="9" fill="#f3bb4f"/>'
    '<path d="M81 54h10M86 49v10" stroke="#ffffff" stroke-width="2"/>',
)

# --- bakery: salt bread ---
products["shiopan"] = base(
    "#eef6e9",
    '<ellipse cx="100" cy="102" rx="42" ry="7" fill="#e3d6bd"/>'
    '<path d="M58 88c0-12 18-24 42-24s42 12 42 24c0 7-5 11-12 11H70c-7 0-12-4-12-11z" fill="#d8a05e"/>'
    '<path d="M82 70c-4 6-4 18-1 26M100 67c-4 7-4 22-1 30M118 70c-4 6-4 18-1 26" fill="none" stroke="#b97c3c" stroke-width="3.5" stroke-linecap="round"/>'
    '<g fill="#ffffff"><circle cx="92" cy="75" r="1.8"/><circle cx="104" cy="72" r="1.8"/><circle cx="111" cy="80" r="1.8"/><circle cx="97" cy="84" r="1.8"/></g>',
)

# --- bakery: baked sweets set ---
products["baked-set"] = base(
    "#fdf3e0",
    '<rect x="56" y="62" width="88" height="52" rx="6" fill="#f2e3cb" stroke="#c98d4b" stroke-width="3.5"/>'
    '<path d="M100 62v52M56 88h88" stroke="#c98d4b" stroke-width="2.5" opacity=".55"/>'
    '<circle cx="78" cy="75" r="8.5" fill="#d8a05e"/>'
    '<g fill="#8a5430"><circle cx="75" cy="73" r="1.5"/><circle cx="81" cy="76" r="1.5"/><circle cx="78" cy="79" r="1.5"/></g>'
    '<circle cx="122" cy="75" r="8.5" fill="#e0b070"/>'
    '<path d="M116 75h12M122 69v12" stroke="#ffffff" stroke-width="2" opacity=".7"/>'
    '<rect x="69" y="96" width="18" height="11" rx="3" fill="#c98d4b"/>'
    '<circle cx="122" cy="101" r="8.5" fill="#d8a05e"/>'
    '<path d="M122 95v12" stroke="#8a5430" stroke-width="2"/>'
    '<path d="M88 50c8-8 16-8 24 0" fill="none" stroke="#d96f59" stroke-width="3.5" stroke-linecap="round"/>',
)

# --- books: bunko stack ---
products["books"] = base(
    "#e8f1fa",
    '<ellipse cx="100" cy="110" rx="42" ry="6" fill="#d4e3ef"/>'
    '<g stroke-linejoin="round">'
    '<rect x="64" y="92" width="72" height="14" rx="3" fill="#1f6db2"/>'
    '<rect x="70" y="78" width="66" height="14" rx="3" fill="#43865b"/>'
    '<rect x="66" y="64" width="68" height="14" rx="3" fill="#d96f59"/>'
    '</g>'
    '<g fill="#ffffff" opacity=".8">'
    '<rect x="72" y="97" width="34" height="4" rx="2"/>'
    '<rect x="78" y="83" width="30" height="4" rx="2"/>'
    '<rect x="74" y="69" width="32" height="4" rx="2"/>'
    '</g>'
    '<path d="M118 56c4-8 12-10 18-8-1 7-7 12-15 12" fill="#85bd97"/>',
)

# --- books: reading goods ---
products["book-goods"] = base(
    "#fdf3e0",
    '<path d="M100 64c-5-4.5-13-6-22-6v40c9 0 17 1.5 22 6 5-4.5 13-6 22-6V58c-9 0-17 1.5-22 6z" '
    'fill="#ffffff" stroke="#1f6db2" stroke-width="4" stroke-linejoin="round"/>'
    '<path d="M100 64v40" stroke="#1f6db2" stroke-width="3"/>'
    '<path d="M112 60v26l5-5 5 5V61" fill="#d96f59"/>'
    '<g fill="none" stroke="#546577" stroke-width="3" stroke-linecap="round">'
    '<circle cx="76" cy="116" r="8"/><circle cx="98" cy="116" r="8"/><path d="M84 116h6M68 112l-6-3M106 112l6-3"/>'
    '</g>',
)

# --- zakka: mini gift ---
products["mini-gift"] = base(
    "#fdeede",
    '<ellipse cx="100" cy="112" rx="40" ry="6" fill="#f0dccd"/>'
    '<rect x="64" y="68" width="72" height="44" rx="5" fill="#d96f59"/>'
    '<rect x="60" y="58" width="80" height="16" rx="4" fill="#e58a73"/>'
    '<path d="M100 58v54M60 66h80" stroke="#fff2df" stroke-width="6"/>'
    '<path d="M100 58c-10 0-15-4-15-9s8-6.5 15 9c7-15.5 15-14 15-9s-5 9-15 9z" '
    'fill="none" stroke="#fff2df" stroke-width="4" stroke-linejoin="round"/>',
)

# --- zakka: stationery ---
products["stationery"] = base(
    "#eef6f3",
    '<rect x="58" y="56" width="60" height="62" rx="5" fill="#ffffff" stroke="#43865b" stroke-width="4"/>'
    '<path d="M70 56v62" stroke="#43865b" stroke-width="3" opacity=".5"/>'
    '<g stroke="#a9c6b4" stroke-width="3" stroke-linecap="round">'
    '<path d="M80 72h28M80 84h28M80 96h20"/>'
    '</g>'
    '<g transform="rotate(18 134 88)">'
    '<rect x="128" y="58" width="13" height="48" rx="2" fill="#f3bb4f"/>'
    '<path d="M128 106h13l-6.5 14z" fill="#f2c6a0"/>'
    '<path d="M132 112l2.5 6 2.5-6z" fill="#3b4a5a"/>'
    '<rect x="128" y="58" width="13" height="8" rx="2" fill="#d96f59"/>'
    '</g>',
)

# --- diner: daily teishoku ---
products["teishoku"] = base(
    "#fdf3e0",
    '<rect x="48" y="70" width="104" height="52" rx="8" fill="#a3653a"/>'
    '<rect x="54" y="76" width="92" height="40" rx="5" fill="#b97c52"/>'
    '<ellipse cx="76" cy="92" rx="15" ry="10" fill="#ffffff"/>'
    '<ellipse cx="76" cy="88" rx="12" ry="6" fill="#f5f1e6"/>'
    '<ellipse cx="124" cy="92" rx="15" ry="10" fill="#8a3b2c"/>'
    '<ellipse cx="124" cy="89" rx="11" ry="5" fill="#c46a4f"/>'
    '<ellipse cx="100" cy="108" rx="22" ry="7" fill="#dff0f9"/>'
    '<path d="M88 106c6-5 18-5 24 0" stroke="#d8884f" stroke-width="5" stroke-linecap="round" fill="none"/>'
    '<path d="M62 64l30-8M66 68l30-8" stroke="#8a5430" stroke-width="3" stroke-linecap="round"/>',
)

# --- diner: local vegetable kobachi ---
products["kobachi"] = base(
    "#eef6e9",
    '<ellipse cx="100" cy="110" rx="36" ry="6" fill="#dcebe2"/>'
    '<path d="M68 82h64a32 32 0 0 1-17 26H85a32 32 0 0 1-17-26z" fill="#ffffff" stroke="#144f83" stroke-width="4"/>'
    '<path d="M74 86h52" stroke="#144f83" stroke-width="2.5" opacity=".4"/>'
    '<circle cx="86" cy="74" r="9" fill="#d96f59"/>'
    '<path d="M86 65c2-3 5-4 8-3" stroke="#43865b" stroke-width="3" fill="none" stroke-linecap="round"/>'
    '<ellipse cx="106" cy="73" rx="11" ry="7" fill="#85bd97"/>'
    '<rect x="116" y="68" width="14" height="9" rx="4" fill="#f3bb4f"/>',
)

# --- used: vintage tops ---
products["tops"] = base(
    "#eef1f5",
    '<path d="M100 46h0" stroke="none"/>'
    '<path d="M84 52a16 5 0 0 0 32 0" fill="none" stroke="#8a5430" stroke-width="4"/>'
    '<path d="M100 40v8" stroke="#8a5430" stroke-width="4" stroke-linecap="round"/>'
    '<path d="M86 58 100 64l14-6 16 12-7 10-5-3v36H82V81l-5 3-7-10z" '
    'fill="#43865b" stroke="#2f7048" stroke-width="3" stroke-linejoin="round"/>'
    '<path d="M92 90h16M92 98h12" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".7"/>',
)

# --- used: accessories ---
products["accessory"] = base(
    "#fdeede",
    '<path d="M70 88c0 18 14 26 30 26s30-8 30-26" fill="none" stroke="#f3bb4f" stroke-width="4" stroke-linecap="round"/>'
    '<g fill="#d96f59"><circle cx="72" cy="94" r="5"/><circle cx="82" cy="105" r="5"/><circle cx="128" cy="94" r="5"/><circle cx="118" cy="105" r="5"/></g>'
    '<circle cx="100" cy="116" r="7" fill="#1f6db2"/>'
    '<rect x="78" y="48" width="44" height="30" rx="6" fill="#fff7ea" stroke="#a3653a" stroke-width="3.5"/>'
    '<path d="M88 48c0-9 5-13 12-13s12 4 12 13" fill="none" stroke="#a3653a" stroke-width="3.5"/>'
    '<circle cx="100" cy="62" r="4" fill="#a3653a"/>',
)


if __name__ == "__main__":
    import pathlib

    out = pathlib.Path(__file__).resolve().parent.parent / "assets"
    for name, svg in products.items():
        path = out / f"product-{name}.svg"
        path.write_text(svg, encoding="utf-8")
        print(f"wrote {path.name} ({len(svg)} bytes)")
