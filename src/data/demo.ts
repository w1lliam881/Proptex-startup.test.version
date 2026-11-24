/**
 * All demodata. Allt här är påhittat och visas märkt som simulerad data.
 * Mått i meter. Villans origo ligger mitt i huset, +z är framsidan (mot betraktaren).
 */

export type Status = "ok" | "warn" | "bad";
export type Vec3 = [number, number, number];

/* ---------------------------------- Villa --------------------------------- */

export interface VillaRoom {
  id: string;
  name: string;
  floor: 0 | 1;
  /** [xMin, zMin, xMax, zMax] */
  rect: [number, number, number, number];
  /** Önskad temperatur i grader */
  temp: number;
  hasLamp: boolean;
}

export type VillaDeviceType =
  "lamp" | "thermostat" | "heatpump" | "charger" | "solar" | "leak" | "meter";

export interface VillaDevice {
  id: string;
  type: VillaDeviceType;
  name: string;
  roomId?: string;
  /** Position i modellen (y relativt marken, utan tak-/planförskjutning) */
  position: Vec3;
  floor: 0 | 1 | "roof" | "outside";
  status: Status;
  statusText: string;
  detail: string;
}

export const villa = {
  name: "Villa Lerdalen",
  summary: "Två plan, ca 150 m², byggd 2012. Värmepump, solceller och laddbox.",
  footprint: { w: 12, d: 9 },
  storeyHeight: 2.5,
  roofPitchDeg: 27,
  rooms: [
    {
      id: "vardagsrum",
      name: "Vardagsrum",
      floor: 0,
      rect: [-6, -4.5, -0.5, 1],
      temp: 21,
      hasLamp: true,
    },
    {
      id: "matplats",
      name: "Matplats",
      floor: 0,
      rect: [-6, 1, -0.5, 4.5],
      temp: 21,
      hasLamp: true,
    },
    { id: "kok", name: "Kök", floor: 0, rect: [-0.5, -4.5, 6, 0], temp: 21, hasLamp: true },
    { id: "hall", name: "Hall", floor: 0, rect: [-0.5, 0, 2.5, 4.5], temp: 20, hasLamp: true },
    { id: "tvatt", name: "Tvättstuga", floor: 0, rect: [2.5, 0, 6, 2.2], temp: 19, hasLamp: false },
    {
      id: "bad1",
      name: "Badrum, entréplan",
      floor: 0,
      rect: [2.5, 2.2, 6, 4.5],
      temp: 23,
      hasLamp: false,
    },
    { id: "sovrum1", name: "Sovrum 1", floor: 1, rect: [-6, -4.5, -1, 0], temp: 18, hasLamp: true },
    { id: "sovrum2", name: "Sovrum 2", floor: 1, rect: [-6, 0, -1, 4.5], temp: 19, hasLamp: true },
    { id: "allrum", name: "Allrum", floor: 1, rect: [-1, -4.5, 2.5, 4.5], temp: 20, hasLamp: true },
    {
      id: "bad2",
      name: "Badrum, övre plan",
      floor: 1,
      rect: [2.5, -4.5, 6, -1.5],
      temp: 23,
      hasLamp: false,
    },
    {
      id: "sovrum3",
      name: "Sovrum 3",
      floor: 1,
      rect: [2.5, -1.5, 6, 4.5],
      temp: 19,
      hasLamp: true,
    },
  ] satisfies VillaRoom[],
  devices: [
    {
      id: "heatpump",
      type: "heatpump",
      name: "Värmepump (luft/vatten)",
      position: [6.62, 0.9, -3.2],
      floor: "outside",
      status: "ok",
      statusText: "Går jämnt",
      detail:
        "Utedelen sitter på gaveln bakom carporten. Värmer huset och varmvattnet. Senaste service: maj 2026.",
    },
    {
      id: "solar",
      type: "solar",
      name: "Solceller",
      position: [-1.5, 6.1, 2.2],
      floor: "roof",
      status: "ok",
      statusText: "Producerar",
      detail:
        "16 paneler, ca 32 m², på takets södersida. Överskottet går till bilen först, sedan till nätet.",
    },
    {
      id: "charger",
      type: "charger",
      name: "Laddbox",
      position: [6.12, 1.2, 3.6],
      floor: "outside",
      status: "ok",
      statusText: "Laddar med solel",
      detail: "11 kW, sitter i carporten. Laddar helst när solen räcker eller elen är billig.",
    },
    {
      id: "meter",
      type: "meter",
      name: "Elmätare",
      roomId: "hall",
      position: [0.6, 1.5, 4.4],
      floor: 0,
      status: "ok",
      statusText: "Normal förbrukning",
      detail: "Sitter i elcentralen i hallen, bakom spegeln. Huvudsäkring 20 A.",
    },
    {
      id: "leak-tvatt",
      type: "leak",
      name: "Läckagesensor, tvättstuga",
      roomId: "tvatt",
      position: [5.4, 0.15, 0.6],
      floor: 0,
      status: "ok",
      statusText: "Torrt",
      detail: "Ligger på golvet under diskhon, bredvid tvättmaskinen.",
    },
    {
      id: "leak-bad1",
      type: "leak",
      name: "Läckagesensor, badrum",
      roomId: "bad1",
      position: [5.3, 0.15, 3.9],
      floor: 0,
      status: "ok",
      statusText: "Torrt",
      detail: "Sitter vid golvbrunnen.",
    },
    {
      id: "leak-bad2",
      type: "leak",
      name: "Läckagesensor, badrum uppe",
      roomId: "bad2",
      position: [5.3, 0.15, -4.0],
      floor: 1,
      status: "ok",
      statusText: "Torrt",
      detail: "Sitter vid golvbrunnen.",
    },
    {
      id: "thermo-vardagsrum",
      type: "thermostat",
      name: "Termostat, vardagsrum",
      roomId: "vardagsrum",
      position: [-0.65, 1.4, -2.5],
      floor: 0,
      status: "ok",
      statusText: "21 °C",
      detail: "Styr golvvärmen i vardagsrum och matplats.",
    },
    {
      id: "thermo-sovrum1",
      type: "thermostat",
      name: "Termostat, sovrum 1",
      roomId: "sovrum1",
      position: [-1.15, 1.4, -3.5],
      floor: 1,
      status: "ok",
      statusText: "18 °C",
      detail: "Svalt att sova i. Sänks automatiskt dagtid på vardagar.",
    },
  ] satisfies VillaDevice[],
  /** Baslast i kW för förbrukningsgrafen */
  usage: { baseKw: 0.45, lampKw: 0.06, perDegreeKw: 0.11, chargerKw: 2.4, solarPeakKw: 3.8 },
};

/* ------------------------------ Flerbostadshus ---------------------------- */

export interface AptType {
  id: "1rok" | "2rok" | "3rok";
  name: string;
  area: number;
  /** Bredd (x) och djup (z) i meter */
  w: number;
  d: number;
  /** Innerväggar i typens lokala koordinater: [x1, z1, x2, z2, dörröppning (m från start) | null] */
  walls: [number, number, number, number, number | null][];
}

export interface Apartment {
  id: string;
  typeId: AptType["id"];
  floor: number;
  /** Hörnets position (minsta x, minsta z) */
  x: number;
  z: number;
  mirrorZ: boolean;
  /** Förbrukning jämfört med typens snitt, 1 = snitt */
  energyIndex: number;
  status: Status;
  note: string;
}

export const aptTypes: AptType[] = [
  {
    id: "1rok",
    name: "1 rok",
    area: 42,
    w: 6,
    d: 7,
    walls: [
      [0, 3, 2.6, 3, 1.4],
      [2.6, 0, 2.6, 3, 0.6],
    ],
  },
  {
    id: "2rok",
    name: "2 rok",
    area: 63,
    w: 9,
    d: 7,
    walls: [
      [4.5, 0, 4.5, 7, 3.6],
      [0, 3, 4.5, 3, 2.2],
      [6.8, 0, 6.8, 2.6, 0.5],
      [4.5, 2.6, 9, 2.6, null],
    ],
  },
  {
    id: "3rok",
    name: "3 rok",
    area: 70,
    w: 10,
    d: 7,
    walls: [
      [3.6, 0, 3.6, 7, 3.2],
      [3.6, 3.4, 10, 3.4, 4.0],
      [7, 3.4, 7, 7, 1.0],
      [0, 3.6, 3.6, 3.6, 2.4],
    ],
  },
];

const bldW = 40;
const bldD = 14;
const floors = 5;

function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function buildApartments(): Apartment[] {
  const list: Apartment[] = [];
  // Per sektion (20 m): [3 rok fram, 2 rok bak] [trapphus 4 m] [1 rok fram, 1 rok bak]. Sektion B speglad.
  const slots: { typeId: AptType["id"]; x: number; z: number; mirrorZ: boolean }[] = [
    { typeId: "3rok", x: -20, z: 0, mirrorZ: false },
    { typeId: "2rok", x: -20, z: -7, mirrorZ: true },
    { typeId: "1rok", x: -6, z: 0, mirrorZ: false },
    { typeId: "1rok", x: -6, z: -7, mirrorZ: true },
    { typeId: "1rok", x: 0, z: 0, mirrorZ: false },
    { typeId: "1rok", x: 0, z: -7, mirrorZ: true },
    { typeId: "3rok", x: 10, z: 0, mirrorZ: false },
    { typeId: "2rok", x: 11, z: -7, mirrorZ: true },
  ];
  for (let f = 1; f <= floors; f++) {
    slots.forEach((s, i) => {
      const id = `1${f - 1}0${i + 1}`;
      let energyIndex = 0.82 + seeded(f * 10 + i) * 0.32;
      let status: Status = "ok";
      let note = "Inget att anmärka.";
      if (id === "1203") {
        energyIndex = 1.42;
        status = "warn";
        note =
          "Drar ca 40 % mer värme än liknande lägenheter. Kan vara ett fönster som står på glänt.";
      }
      if (id === "1304") {
        status = "warn";
        note = "Öppen felanmälan: droppande kran i badrummet.";
      }
      list.push({ id, ...s, floor: f, energyIndex, status, note });
    });
  }
  return list;
}

export const building = {
  name: "Brf Lergöken",
  summary:
    "Fem våningar, källare och tak. 40 lägenheter i två trapphus, byggt 1968, stambytt 2015.",
  w: bldW,
  d: bldD,
  floors,
  storeyHeight: 2.9,
  stairs: [
    { id: "A", x: -10, w: 4 },
    { id: "B", x: 6, w: 4 },
  ],
  apartments: buildApartments(),
  floorNames: ["Källare", "Plan 1", "Plan 2", "Plan 3", "Plan 4", "Plan 5"],
  basement: [
    {
      id: "teknik",
      name: "Teknikrum",
      rect: [-20, -7, -10, 0],
      note: "Fjärrvärmecentral, elcentral och undercentral.",
    },
    {
      id: "tvattstuga",
      name: "Tvättstuga",
      rect: [10, -7, 20, 0],
      note: "Tre maskiner och torkrum. Bokas i appen eller på tavlan.",
    },
    { id: "forrad", name: "Förråd", rect: [-6, -7, 6, 7], note: "Ett förråd per lägenhet." },
  ],
  ventilation: {
    id: "ftx",
    name: "Ventilationsaggregat (FTX) på taket",
    position: [-14, 0, -2] as Vec3,
    status: "bad" as Status,
    statusText: "Avvikelse",
    detail:
      "Aggregatet drar ca 38 % mer el än vanligt sedan i lördags, men luftflödet är oförändrat. Det brukar betyda ett igensatt filter eller en fläkt som går på för högt varv. Förslag: be ventilationsfirman titta på filtren vid nästa besök.",
  },
  solar: {
    name: "Solceller på taket",
    detail: "48 paneler, ca 95 m². Täcker en del av fastighetselen.",
  },
  compliance: [
    {
      id: "ovk",
      name: "Ventilationskontroll (OVK)",
      last: "2023-09-12",
      next: "2026-09-12",
      status: "bad" as Status,
      statusText: "Försenad",
      note: "Tidpunkten har passerat. Boka besiktning.",
    },
    {
      id: "energi",
      name: "Energideklaration",
      last: "2021-05-03",
      next: "2031-05-03",
      status: "ok" as Status,
      statusText: "Giltig",
      note: "Gäller i tio år.",
    },
    {
      id: "hiss",
      name: "Hissbesiktning",
      last: "2025-12-02",
      next: "2026-12-02",
      status: "warn" as Status,
      statusText: "Snart",
      note: "Båda hissarna. Besiktaren är bokad.",
    },
    {
      id: "brand",
      name: "Brandskydd (SBA)",
      last: "2026-02-10",
      next: "2027-02-10",
      status: "ok" as Status,
      statusText: "Genomfört",
      note: "Årlig egenkontroll. Brandsläckare kontrollerade.",
    },
    {
      id: "laddning",
      name: "Laddplatser, krav vid renovering",
      last: "–",
      next: "Vid större renovering",
      status: "ok" as Status,
      statusText: "Bevakas",
      note: "Påminnelse läggs in om garaget renoveras.",
    },
  ],
  ticket: {
    apartmentId: "1304",
    title: "Det droppar från kranen i badrummet",
    from: "Boende i lgh 1304",
    steps: [
      {
        time: "mån 07:42",
        text: "Boende skickar felanmälan med en bild, direkt från sin vy av lägenheten.",
      },
      {
        time: "mån 07:42",
        text: "Ärendet hamnar på rätt badrum i modellen. Kranens fabrikat finns redan i dokumenten.",
      },
      {
        time: "mån 09:15",
        text: "Fastighetsskötaren får ärendet och svarar att hen kommer på onsdag.",
      },
      { time: "ons 10:30", text: "Packningen byts. Boende får besked och ärendet stängs." },
    ],
  },
  questions: [
    {
      q: "När byttes filtren i ventilationsaggregatet senast?",
      a: "Den 14 mars 2026, enligt servicerapporten. Nästa byte är planerat till september 2026, men med dagens avvikelse kan det vara värt att tidigarelägga.",
      source: "Servicerapport FTX 2026-03-14.pdf, s. 2",
    },
    {
      q: "Vilken säkring hör till tvättstugan?",
      a: "Grupp 7 i undercentralen i källarens teknikrum, 16 A. Torktumlaren har en egen grupp, nummer 8.",
      source: "Elschema källare, rev C",
    },
    {
      q: "Hur mycket värme gick åt i oktober?",
      a: "Ungefär 21 MWh fjärrvärme, nästan samma som oktober förra året. Trapphus B ligger något högre än A.",
      source: "Mätardata från fjärrvärmemätaren (simulerad)",
    },
    {
      q: "När ska hissarna besiktas?",
      a: "Senast den 2 december 2026. Besiktningen är bokad för båda hissarna.",
      source: "Besiktningsprotokoll hiss 2025-12-02.pdf",
    },
    {
      q: "Finns det asbest någonstans i huset?",
      a: "Miljöinventeringen hittade asbest i rörisolering i teknikrummet. Den är inkapslad och märkt. Inget i lägenheterna.",
      source: "Miljöinventering 2019, avsnitt 4.2",
    },
  ],
};
