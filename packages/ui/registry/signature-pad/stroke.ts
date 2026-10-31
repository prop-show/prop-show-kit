export interface SignaturePoint {
  x: number;
  y: number;
  /** 0–1. A device without pressure is stored as 0.5. */
  pressure: number;
}

export type SignatureStroke = SignaturePoint[];

export const SIGNATURE_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export type SignatureImageType = (typeof SIGNATURE_IMAGE_TYPES)[number];

export interface SignatureExport {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export type StrokeCommand =
  | { op: "dot"; x: number; y: number; radius: number }
  | { op: "move"; x: number; y: number }
  | { op: "quad"; cx: number; cy: number; x: number; y: number }
  | { op: "line"; x: number; y: number };

export interface StrokeContext {
  lineWidth: number;
  beginPath(): void;
  moveTo(x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  lineTo(x: number, y: number): void;
  stroke(): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void;
  fill(): void;
}

export function isSignatureEmpty(strokes: readonly SignatureStroke[]) {
  return strokes.every((stroke) => stroke.length === 0);
}

export function undoStroke(strokes: readonly SignatureStroke[]): SignatureStroke[] {
  return strokes.slice(0, -1);
}

export function clampPressure(pressure: number) {
  if (!Number.isFinite(pressure) || pressure <= 0) return 0.5;
  return Math.min(1, pressure);
}

export function normalizeStrokeWidth(width: number) {
  if (!Number.isFinite(width) || width <= 0) return 2;
  return Math.min(32, width);
}

export function normalizeImageType(type: string | undefined): SignatureImageType {
  if (type === "image/jpeg" || type === "image/webp" || type === "image/png") return type;
  return "image/png";
}

export function clampQuality(quality: number) {
  if (!Number.isFinite(quality)) return 0.92;
  return Math.min(1, Math.max(0, quality));
}

/** JPEG has no alpha channel, so a missing background becomes white. */
export function canvasBackground(type: SignatureImageType, background?: string) {
  if (type === "image/jpeg") return background || "#ffffff";
  return background || null;
}

export function shouldAppendPoint(
  previous: SignaturePoint | undefined,
  point: SignaturePoint,
  minDistance = 0.75,
) {
  if (!previous) return true;
  const dx = point.x - previous.x;
  const dy = point.y - previous.y;
  return dx * dx + dy * dy >= minDistance * minDistance;
}

export function pointFromClient(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  pressure: number,
): SignaturePoint | null {
  if (!(rect.width > 0) || !(rect.height > 0)) return null;
  return {
    x: Math.min(rect.width, Math.max(0, clientX - rect.left)),
    y: Math.min(rect.height, Math.max(0, clientY - rect.top)),
    pressure: clampPressure(pressure),
  };
}

/** Midpoint curves keep a stroke smooth without storing a separate path. */
export function strokeCommands(
  stroke: readonly SignaturePoint[],
  baseWidth: number,
): StrokeCommand[] {
  const width = normalizeStrokeWidth(baseWidth);
  if (stroke.length === 0) return [];
  if (stroke.length === 1) {
    const [point] = stroke;
    return [{ op: "dot", x: point.x, y: point.y, radius: width / 2 }];
  }
  const commands: StrokeCommand[] = [{ op: "move", x: stroke[0].x, y: stroke[0].y }];
  for (let index = 1; index < stroke.length - 1; index += 1) {
    const current = stroke[index];
    const next = stroke[index + 1];
    commands.push({
      op: "quad",
      cx: current.x,
      cy: current.y,
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2,
    });
  }
  const last = stroke[stroke.length - 1];
  commands.push({ op: "line", x: last.x, y: last.y });
  return commands;
}

export function paintStroke(
  ctx: StrokeContext,
  stroke: readonly SignaturePoint[],
  baseWidth: number,
) {
  const commands = strokeCommands(stroke, baseWidth);
  if (commands.length === 0) return;
  const [first] = commands;
  ctx.beginPath();
  if (first.op === "dot") {
    ctx.arc(first.x, first.y, first.radius, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.lineWidth = normalizeStrokeWidth(baseWidth);
  for (const command of commands) {
    if (command.op === "move") ctx.moveTo(command.x, command.y);
    else if (command.op === "quad")
      ctx.quadraticCurveTo(command.cx, command.cy, command.x, command.y);
    else if (command.op === "line") ctx.lineTo(command.x, command.y);
  }
  ctx.stroke();
}
