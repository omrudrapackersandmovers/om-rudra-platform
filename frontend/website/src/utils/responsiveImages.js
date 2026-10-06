export function responsiveImageSet(src) {
  if (!src.endsWith(".webp")) return undefined;
  const isNewPhoto = src.endsWith("-v2.webp") && (src.includes("/services/") || src.includes("/process-for-home-service/") || src.includes("/places/"));
  const widths = isNewPhoto ? [320, 640, 960, 1536] : [320, 640, 960];
  return widths.map(width => `${src.replace(/\.webp$/, `-${width}w.webp`)} ${width}w`).join(", ");
}
