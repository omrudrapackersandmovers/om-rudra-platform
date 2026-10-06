# Logo exports

Approved red parcel-and-route symbol, with Sora name and Inter descriptor. The descriptor keeps the larger hierarchy approved on the website. This pack replaces the earlier raster concept for app use.

- SVG masters: red/white/charcoal symbols, horizontal and reverse lockups. SVGs scale to any size.
- Transparent symbol PNGs in each color: 16, 24, 32, 48, 64, 128, 180, 192, 256, 512 and 1024 px square.
- Transparent horizontal PNGs in each color: 320 x 85, 640 x 171, 1080 x 288 and 2160 x 576 px. Red version uses a red symbol with charcoal lettering; white and charcoal versions are monochrome.
- Browser icon: multi-size ICO with native 16/32/48 px images, SVG, and 32 px PNG fallback.
- Apple touch icon: opaque white 180 x 180 px.
- App icons: 192/512 px transparent icons and separate opaque maskable icons, with the complete symbol inside the central safe area.
- Social avatars: white symbol on red at 192, 512 and 1080 px. Use the 1080 px master for profile uploads.
- Link sharing image: opaque PNG at 1200 x 630 px, used by website Open Graph and Twitter metadata.

Use the horizontal lockup on white, the reverse lockup on dark/photo backgrounds, and symbol-only icons in compact UI. Keep a clear margin around the symbol and never stretch the aspect ratio. Keep a white reverse mark on dark backgrounds. Do not put white transparent exports on white.

App references are centralized in the two company configuration files. Invoice, quotation and bilty views use the 1080 px PNG for dependable printing. Production social profile uploads are not performed by this export task.

To regenerate, run `node docs/brand/export-logos.cjs` with `@napi-rs/canvas` installed or accessible through `NODE_PATH`. The script uses the approved horizontal SVG geometry and the bundled licensed fonts, exports the pack and syncs app assets.
