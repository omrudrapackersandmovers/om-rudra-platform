# Service image set

Eight images generated with the built-in image tool on 6 October 2026. Each illustrates its service using neutral Indian settings, plain charcoal workwear and unprinted packaging. Images have no company-name overlays. The bike manufacturer's cowl emblem was removed using the built-in editing tool.

The PNG files here are 1536 x 1024 source masters. Exact generation prompts are in `manifest.json`. These are illustrative scenes, not photographs of actual staff, fleet, customer jobs or owned storage premises.

Website exports use versioned `-v2.webp` names with 320, 640, 960 and 1536 px responsive variants. The homepage also has a 768 x 960 mobile crop. Service cards and detail-page images use the same source set. Existing images are preserved for rollback.

Regenerate optimized exports with `node docs/brand/service-images/export-services.cjs` using `sharp` installed locally or available through `NODE_PATH`. Resize and format conversion preserve the generated scenes; do not add names, watermarks or logos to the photographs.
