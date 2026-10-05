export function responsiveImageSet(src) {
  return [320, 640, 960].map(width => `${src.replace(/\.webp$/, `-${width}w.webp`)} ${width}w`).join(", ");
}
