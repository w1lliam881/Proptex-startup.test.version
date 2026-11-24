// Kontrastkontroll (WCAG 2.1 AA) för sidans färgpar. Kör: npm run check:contrast
const hex = (h) =>
  h
    .replace("#", "")
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (h) => {
  const [r, g, b] = hex(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [L(a), L(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const C = {
  marin: "#071426",
  marin800: "#0E2238",
  marin700: "#17324F",
  paper: "#F6F2EA",
  paperDeep: "#ECE5D8",
  ink: "#14202E",
  ink2: "#4C5560",
  copper: "#A3481F",
  copperLight: "#E58A5B",
  ok: "#2A7050",
  warn: "#8A5A0C",
  bad: "#B3362A",
  okLight: "#6FC79C",
  warnLight: "#E8B04A",
  badLight: "#F08A7E",
  paperMuted: "#B9C0C8",
};
// [förgrund, bakgrund, minsta kvot (4.5 text, 3 stor text/UI)]
const pairs = [
  ["ink", "paper", 4.5],
  ["ink2", "paper", 4.5],
  ["ink", "paperDeep", 4.5],
  ["ink2", "paperDeep", 4.5],
  ["copper", "paper", 4.5],
  ["copper", "paperDeep", 4.5],
  ["paper", "copper", 4.5],
  ["ok", "paper", 4.5],
  ["warn", "paper", 4.5],
  ["bad", "paper", 4.5],
  ["ok", "paperDeep", 4.5],
  ["warn", "paperDeep", 4.5],
  ["bad", "paperDeep", 4.5],
  ["paper", "marin", 4.5],
  ["paper", "marin800", 4.5],
  ["paper", "marin700", 4.5],
  ["paperMuted", "marin", 4.5],
  ["paperMuted", "marin800", 4.5],
  ["paperMuted", "marin700", 4.5],
  ["copperLight", "marin", 4.5],
  ["copperLight", "marin800", 4.5],
  ["marin", "copperLight", 4.5],
  ["okLight", "marin800", 4.5],
  ["warnLight", "marin800", 4.5],
  ["badLight", "marin800", 4.5],
];
let fail = 0;
for (const [f, b, min] of pairs) {
  const r = ratio(C[f], C[b]);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(
    `${ok ? "OK  " : "FAIL"} ${f.padEnd(12)} på ${b.padEnd(10)} ${r.toFixed(2)}:1 (krav ${min})`,
  );
}
console.log(fail ? `\n${fail} par klarar inte AA.` : "\nAlla par klarar WCAG AA.");
process.exit(fail ? 1 : 0);
