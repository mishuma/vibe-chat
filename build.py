#!/usr/bin/env python3
"""Builds vibe-chat.html (the single file students open) from src/app-template.html and the vendored QR decoder."""
import pathlib
root = pathlib.Path(__file__).parent
tpl = (root / "src/app-template.html").read_text(encoding="utf-8")
qr = (root / "vendor/jsQR.lite.min.js").read_text(encoding="utf-8").strip()
block = ('<!-- QR decoder: jsQR 1.4.0 (https://github.com/cozmo/jsQR), Apache-2.0 license, minified; the Shift-JIS (Japanese Kanji) '
         'table is removed because API-key QR codes never use it. Inlined so this page works offline from a single file. -->\n'
         '<script>' + qr + '</script>')
assert tpl.count("<!--JSQR-->") == 1
(root / "vibe-chat.html").write_text(tpl.replace("<!--JSQR-->", block), encoding="utf-8")
print("wrote vibe-chat.html")
