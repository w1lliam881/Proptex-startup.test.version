/**
 * Liten hjälpfunktion som bygger väggar av raka segment med öppningar för dörrar och fönster.
 * Ingen CSG: varje vägg delas upp i lådor runt öppningarna. Endast axelparallella väggar.
 */
export interface Box {
  p: [number, number, number];
  s: [number, number, number];
  /** Valfri rotation (Euler, radianer) */
  r?: [number, number, number];
}

export interface Opening {
  /** Mittpunkt, meter från väggens startpunkt */
  at: number;
  w: number;
  /** Underkant och överkant över väggens fot */
  y0: number;
  y1: number;
}

export const door = (at: number, w = 0.9): Opening => ({ at, w, y0: 0, y1: 2.1 });
export const win = (at: number, w = 1.2, y0 = 0.9, y1 = 2.1): Opening => ({ at, w, y0, y1 });

export function wall(
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  opts: { y?: number; h: number; t?: number; openings?: Opening[] },
): Box[] {
  const { y = 0, h, t = 0.15, openings = [] } = opts;
  const alongX = Math.abs(z2 - z1) < 1e-6;
  const len = alongX ? Math.abs(x2 - x1) : Math.abs(z2 - z1);
  const dir = alongX ? Math.sign(x2 - x1) || 1 : Math.sign(z2 - z1) || 1;
  const sorted = [...openings].sort((a, b) => a.at - b.at);
  const out: Box[] = [];

  const push = (a: number, b: number, ya: number, yb: number) => {
    if (b - a < 0.01 || yb - ya < 0.01) return;
    const mid = (a + b) / 2;
    const cx = alongX ? x1 + dir * mid : x1;
    const cz = alongX ? z1 : z1 + dir * mid;
    out.push({
      p: [cx, y + (ya + yb) / 2, cz],
      s: alongX ? [b - a, yb - ya, t] : [t, yb - ya, b - a],
    });
  };

  let cursor = 0;
  for (const o of sorted) {
    const a = Math.max(0, o.at - o.w / 2);
    const b = Math.min(len, o.at + o.w / 2);
    push(cursor, a, 0, h);
    push(a, b, 0, o.y0);
    push(a, b, o.y1, h);
    cursor = b;
  }
  push(cursor, len, 0, h);
  return out;
}

/** Rektangulär låda från hörn till hörn (för möbler, bjälklag m.m.) */
export function block(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): Box {
  return {
    p: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2],
    s: [Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)],
  };
}
