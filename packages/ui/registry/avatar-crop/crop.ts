// Original crop geometry for a square viewport. The image always covers the
// window: zoom is a multiple of the cover scale, and pan is clamped to that cover.

export interface ImageSize {
  width: number;
  height: number;
}

export interface CropFrame {
  /** Left edge of the source image, in viewport pixels. */
  x: number;
  /** Top edge of the source image, in viewport pixels. */
  y: number;
  /** Viewport pixels per source pixel. */
  scale: number;
}

export interface SourceRect {
  x: number;
  y: number;
  size: number;
}

export interface AvatarCropResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

export function coverScale(image: ImageSize, viewport: number): number {
  if (image.width <= 0 || image.height <= 0 || viewport <= 0) return 1;
  return Math.max(viewport / image.width, viewport / image.height);
}

export function normalizeOutputSize(size: number): number {
  if (!Number.isFinite(size)) return 256;
  return Math.min(4096, Math.max(16, Math.round(size)));
}

export function clampScale(
  scale: number,
  image: ImageSize,
  viewport: number,
  maxZoom: number,
): number {
  const min = coverScale(image, viewport);
  const max = min * Math.max(1, maxZoom);
  if (!Number.isFinite(scale)) return min;
  return Math.min(max, Math.max(min, scale));
}

function clampOffset(offset: number, displayed: number, viewport: number): number {
  if (displayed <= viewport) return (viewport - displayed) / 2;
  return Math.min(0, Math.max(viewport - displayed, offset));
}

export function clampFrame(
  frame: CropFrame,
  image: ImageSize,
  viewport: number,
  maxZoom = 4,
): CropFrame {
  const scale = clampScale(frame.scale, image, viewport, maxZoom);
  return {
    scale,
    x: clampOffset(frame.x, image.width * scale, viewport),
    y: clampOffset(frame.y, image.height * scale, viewport),
  };
}

export function initialFrame(image: ImageSize, viewport: number, zoom = 1, maxZoom = 4): CropFrame {
  const scale = coverScale(image, viewport) * zoom;
  return clampFrame(
    {
      scale,
      x: (viewport - image.width * scale) / 2,
      y: (viewport - image.height * scale) / 2,
    },
    image,
    viewport,
    maxZoom,
  );
}

export function panBy(
  frame: CropFrame,
  dx: number,
  dy: number,
  image: ImageSize,
  viewport: number,
  maxZoom = 4,
): CropFrame {
  return clampFrame({ ...frame, x: frame.x + dx, y: frame.y + dy }, image, viewport, maxZoom);
}

/** Keep the source pixel under (originX, originY) fixed while changing scale. */
export function zoomAt(
  frame: CropFrame,
  image: ImageSize,
  viewport: number,
  nextScale: number,
  originX: number,
  originY: number,
  maxZoom = 4,
): CropFrame {
  const current = frame.scale > 0 ? frame.scale : coverScale(image, viewport);
  const scale = clampScale(nextScale, image, viewport, maxZoom);
  return clampFrame(
    {
      scale,
      x: originX - ((originX - frame.x) / current) * scale,
      y: originY - ((originY - frame.y) / current) * scale,
    },
    image,
    viewport,
    maxZoom,
  );
}

export function zoomFactor(frame: CropFrame, image: ImageSize, viewport: number): number {
  const min = coverScale(image, viewport);
  if (min <= 0 || frame.scale <= 0) return 1;
  return frame.scale / min;
}

export function sourceRect(frame: CropFrame, viewport: number): SourceRect {
  const scale = frame.scale > 0 ? frame.scale : 1;
  return {
    x: -frame.x / scale,
    y: -frame.y / scale,
    size: viewport / scale,
  };
}

/** Preserve the source point under the viewport center when the viewport size changes. */
export function resizeFrame(
  frame: CropFrame,
  image: ImageSize,
  previousViewport: number,
  nextViewport: number,
  maxZoom = 4,
): CropFrame {
  if (previousViewport <= 0 || nextViewport <= 0 || frame.scale <= 0) {
    return initialFrame(image, Math.max(nextViewport, previousViewport, 0), 1, maxZoom);
  }
  const factor = zoomFactor(frame, image, previousViewport);
  const sourceX = (previousViewport / 2 - frame.x) / frame.scale;
  const sourceY = (previousViewport / 2 - frame.y) / frame.scale;
  const scale = coverScale(image, nextViewport) * factor;
  return clampFrame(
    {
      scale,
      x: nextViewport / 2 - sourceX * scale,
      y: nextViewport / 2 - sourceY * scale,
    },
    image,
    nextViewport,
    maxZoom,
  );
}
