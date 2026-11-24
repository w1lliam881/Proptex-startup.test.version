/**
 * Alla texter på sidan. Ändra här, inte i komponenterna.
 * Hakparenteser [SÅ HÄR] är platshållare som du måste fylla i innan lansering.
 */

export type Audience = "agare" | "installator" | "boende";

export const site = {
  name: "Proptex",
  title: "Proptex – hela huset i en 3D-modell du kan klicka i",
  description:
    "Proptex samlar el, värme, ritningar, besiktningar och lagkrav i en 3D-modell av byggnaden. För fastighetsägare, installatörer och de som bor där.",
  company: {
    name: "[FÖRETAGSNAMN AB]",
    orgnr: "[ORG.NR]",
    address: "[ADRESS]",
    email: "[E-POST]",
    phone: "[TELEFON]",
  },
};

export const nav = {
  skipLink: "Hoppa till innehållet",
  items: [
    { href: "/#demo", label: "Demo" },
    { href: "/#sa-funkar-det", label: "Så funkar det" },
    { href: "/#for-vem", label: "För vem" },
    { href: "/#kontakt", label: "Kontakt" },
  ],
  cta: "Boka demo",
  menuOpen: "Öppna meny",
  menuClose: "Stäng meny",
};

export const hero = {
  eyebrow: "Byggnaden, samlad på ett ställe",
  // Rubrikalternativ (se README): "Vet du hur dina hus mår just nu?" och "Pärmen i källaren kan gå i pension."
  titleLines: ["Huset vet.", "Nu gör du det också."],
  lead: "Proptex samlar el, värme, ritningar, besiktningar och lagkrav i en 3D-modell av byggnaden som du kan klicka i.",
  primary: "Boka en demo",
  secondary: "Prova demon",
  simulated: "Exempel med simulerad data",
  hint: "Dra för att vrida. Klicka i ett rum för att tända.",
  liftRoof: "Lyft taket",
  lowerRoof: "Lägg på taket",
  showFlow: "Visa energiflödet",
  hideFlow: "Dölj energiflödet",
  annotations: {
    heatpump: "Här sitter värmepumpen",
    solar: "Solceller, ca 32 m²",
    charger: "Laddboxen i carporten",
    leak: "Läckagesensor under diskbänken i tvättstugan",
  },
};

export const problem = {
  number: "01",
  label: "Problemet",
  title: "Allt finns. Bara inte på samma ställe.",
  paragraphs: [
    "Ritningarna ligger i en pärm i källaren. Besiktningsprotokollet i någons mejl. Energisiffrorna i en Excel-fil som bara en person förstår, och hen går i pension i vår.",
    "När det luktar bränt i ett elskåp ringer man fastighetsskötaren och hoppas att hen svarar. När kommunen frågar om ventilationskontrollen letar man i tre system.",
    "Samtidigt blir kraven fler: energideklarationer, OVK, laddinfrastruktur, nya EU-regler om byggnaders energiprestanda. Det är inte konstigt att det känns tungt.",
  ],
  aside: {
    title: "Det vi hör oftast",
    items: [
      "”Vem har senaste versionen av ritningen?”",
      "”När gjordes OVK:n senast, egentligen?”",
      "”Varför drar trapphus B så mycket el?”",
    ],
    note: "Frågorna ovan är typiska exempel, inte citat.",
  },
};

export const how = {
  number: "02",
  label: "Så funkar det",
  title: "Från pärm till modell i fyra steg",
  steps: [
    {
      title: "Vi bygger modellen",
      text: "Utifrån ritningar och ett platsbesök gör vi en 3D-modell av huset. Varje lägenhetstyp ritas en gång och återanvänds, så även stora hus går fort.",
      note: "ritningar räcker oftast",
    },
    {
      title: "Vi kopplar på det som finns",
      text: "Elmätare, värmepump, ventilation, sensorer och dokument hamnar på rätt plats i modellen. Saknas mätare säger vi det rakt ut.",
      note: "inga nya prylar i onödan",
    },
    {
      title: "Du klickar i stället för att leta",
      text: "Klicka på ett rum, en lägenhet eller ett aggregat och se status, historik, dokument och vad som behöver göras härnäst.",
      note: "",
    },
    {
      title: "Huset säger till i tid",
      text: "Avvikelser i energin, besiktningar som närmar sig och felanmälningar från boende dyker upp där de hör hemma, med en förklaring.",
      note: "",
    },
  ],
};

export const audiences = {
  number: "03",
  label: "För vem",
  title: "Tre sätt att använda samma hus",
  tablistLabel: "Välj vem du är",
  scenarioLabel: "Ett tänkbart scenario",
  youGetLabel: "Det här får du",
  items: [
    {
      id: "agare" as Audience,
      tab: "Fastighetsägare",
      kicker: "Bostadsrättsföreningar, fastighetsbolag och lokalägare",
      scenario:
        "Ordföranden i en förening med 40 lägenheter ser en tisdag att ventilationsaggregatet på taket drar mer el än vanligt sedan helgen. I modellen ligger servicehistoriken och kontaktuppgiften till firman. Hon skickar en fråga direkt därifrån, innan det blir en dyr vinter.",
      gets: [
        "Hela beståndet i 3D, från källare till tak",
        "Energiavvikelser som förklaras i klartext",
        "Koll på OVK, energideklaration, hiss och brandskydd",
        "Dokument du kan söka i med vanliga frågor",
        "Felanmälan och meddelanden till boende",
      ],
    },
    {
      id: "installator" as Audience,
      tab: "Installatör",
      kicker: "Elfirmor och smart hem-installatörer",
      scenario:
        "En elfirma lämnar över ett nytt villaprojekt med värmepump, solceller och laddbox. I stället för fyra appar och en lös lapp i elcentralen får kunden en 3D-modell av sitt hus med firmans namn på. Ringer kunden kan montören se samma vy.",
      gets: [
        "Ett färdigt kundgränssnitt med 3D-styrning",
        "Ditt eget varumärke, inte vårt",
        "Samma vy för dig och kunden vid support",
        "Dokumentation av installationen på rätt plats",
      ],
    },
    {
      id: "boende" as Audience,
      tab: "Privatboende",
      kicker: "Kommer via din hyresvärd eller installatör, eller direkt",
      scenario:
        "Familjen i radhuset får ett meddelande en natt: läckagesensorn i tvättstugan har känt fukt. Mobilen visar exakt var i huset den sitter. Pappan stänger av vattnet, och morgonen därpå skickar han en felanmälan med en bild, direkt i samma vy.",
      gets: [
        "Ditt hem i 3D, att se och styra",
        "Lampor, värme och laddning på ett ställe",
        "Larm som visar var något hänt, inte bara att",
        "Felanmälan till din hyresvärd eller förening",
      ],
    },
  ],
};

export const demo = {
  number: "04",
  label: "Demo",
  title: "Prova själv. Inget går sönder.",
  intro:
    "Det här är en riktig 3D-modell med påhittade siffror. Byt mellan villan och flerbostadshuset, klicka runt och tryck på knapparna.",
  simulated: "Exempel med simulerad data",
  switchLabel: "Välj byggnad",
  villa: "Villa",
  building: "Flerbostadshus",
  loading: "Vi ställer fram modellen…",
  loadingSlow: "Det tar en liten stund på långsammare enheter.",
  srDescription:
    "Interaktiv 3D-modell. Villan är ett hus i två plan på cirka 150 kvadratmeter med carport och uteplats. Där finns lampor, termostater, värmepump, laddbox, solceller och läckagesensorer som du kan välja i listan bredvid modellen. Flerbostadshuset har fem våningar, källare och tak, med 40 lägenheter av tre typer. Där kan du byta mellan översikt, energi, lagkrav och underhåll. All data är simulerad.",
  fallback: {
    title: "3D-modellen kan inte visas här",
    textNoWebgl:
      "Din webbläsare eller enhet saknar stöd för WebGL, som modellen behöver. Här är en ritning av samma hus i stället. I en demo visar vi gärna det riktiga på din skärm.",
    textWeak:
      "Din enhet verkar vara på den svagare sidan, så vi visar en ritning i stället för att låta telefonen bli varm.",
    tryAnyway: "Visa 3D ändå",
    book: "Boka en demo",
  },
  villaUi: {
    liftRoof: "Lyft taket",
    lowerRoof: "Lägg på taket",
    flow: "Energiflöde",
    leak: "Simulera vattenläcka",
    leakStop: "Stäng av larmet",
    leakAlert: "Läckage i tvättstugan",
    leakAlertText: "Sensorn under diskhon har känt fukt. Stäng huvudkranen i hallen.",
    devicesLabel: "Enheter i huset",
    roomsLabel: "Rum",
    nothingSelected: "Klicka på något i huset, eller välj i listan.",
    lampOn: "Tänd",
    lampOff: "Släck",
    tempLabel: "Önskad temperatur",
    usageTitle: "Förbrukning just nu",
    usageUnit: "kW",
    usageNote: "Uppdateras med det du gör i modellen.",
    solarNow: "Sol",
    houseNow: "Hus",
    carNow: "Bil",
  },
  buildingUi: {
    modesLabel: "Visa",
    modes: {
      overview: "Översikt",
      energy: "Energi",
      compliance: "Lagkrav",
      maintenance: "Underhåll",
    },
    explode: "Lyft isär våningarna",
    implode: "Lägg ihop våningarna",
    typesTitle: "Byggd en gång, använd 40 gånger",
    typesText:
      "Modellen har tre lägenhetstyper. Varje typ ritas en gång och placeras ut där den finns i huset.",
    floorLabel: "Våning",
    aptLabel: "Lägenhet",
    pickHint: "Klicka på en lägenhet eller våning i modellen, eller välj nedan.",
    legendEnergy: "Förbrukning jämfört med snittet för typen",
    legendLow: "Lägre",
    legendNormal: "Normal",
    legendHigh: "Högre",
    complianceTitle: "Kontroller och besiktningar",
    complianceNote: "Exempeldata. Datum och status är påhittade.",
    nextDate: "Nästa",
    maintenanceTitle: "Så går en felanmälan",
    askTitle: "Fråga huset",
    askPlaceholder: "Välj en fråga nedan",
    askNote: "Svaren är färdigskrivna exempel. I tjänsten söker vi i husets egna dokument.",
    sourceLabel: "Källa",
  },
  status: { ok: "OK", warn: "Snart", bad: "Avvikelse" },
};

export const start = {
  number: "05",
  label: "Så börjar vi",
  title: "Vi börjar smått",
  steps: [
    {
      title: "Ett samtal",
      time: "ca 45 minuter",
      text: "Du berättar om husen och vad som skaver. Vi visar demon och är ärliga med om det passar.",
    },
    {
      title: "Pilot på en byggnad",
      time: "några veckor",
      text: "Vi modellerar ett hus, kopplar på det som finns och låter er använda det på riktigt.",
    },
    {
      title: "Utrullning",
      time: "i er takt",
      text: "Fungerar det lägger vi till fler byggnader. Lägenhetstyper som redan finns återanvänds.",
    },
  ],
  price: "Pris beror på byggnadernas antal och typ, vi tar fram ett förslag.",
};

export const about = {
  number: "06",
  label: "Om oss",
  title: "Varför vi bygger Proptex",
  paragraphs: [
    "Vi har sett för många hus skötas med pärmar, post-it-lappar och minnet hos en enda person. Det fungerar, tills den personen flyttar eller det blir fel en fredagskväll.",
    "Byggnader är fysiska saker. Då borde informationen om dem också gå att se som en byggnad, inte som en lista i ett system. Det är hela idén.",
    "Vi är ett litet team och i ett tidigt skede. Det betyder att du pratar direkt med de som bygger tjänsten, och att det du tycker faktiskt påverkar vad vi gör.",
  ],
  people: [
    { name: "[NAMN]", role: "[ROLL]", place: "[ORT]" },
    { name: "[NAMN]", role: "[ROLL]", place: "[ORT]" },
  ],
  peopleNote: "Fyll i namn, roll och ort. Lägg gärna till en mening om varför just du gör det här.",
};

export const faq = {
  label: "Vanliga frågor",
  title: "Det folk brukar undra",
  items: [
    {
      q: "Är det här en färdig tjänst?",
      a: "Inte helt. 3D-modellen och gränssnittet du ser på sidan finns, men siffrorna är simulerade. Kopplingar till riktiga mätare och system gör vi tillsammans med de första kunderna i en pilot.",
    },
    {
      q: "Vad behöver vi ha för att komma igång?",
      a: "Ritningar räcker långt, gärna som pdf. Har ni elmätare, styrsystem eller sensorer kopplar vi på dem. Har ni inget sådant går det ändå att börja med dokument, lagkrav och felanmälan.",
    },
    {
      q: "Måste vi byta ut befintliga system?",
      a: "Nej. Tanken är att samla det ni redan har på ett ställe. Går något inte att koppla på säger vi det, hellre än att lova för mycket.",
    },
    {
      q: "Hur hanteras vår data?",
      a: "Data om er byggnad är er. Vi använder den bara för att leverera tjänsten och delar den inte vidare. Var den lagras och hur länge beskriver vi i avtalet, och vi strävar efter lagring inom EU.",
    },
    {
      q: "Fungerar det för de som bor i huset?",
      a: "Ja, det är planen. Boende kan få en egen vy av sin lägenhet eller sitt hus, oftast via hyresvärden, föreningen eller installatören. Det kommer efter fastighetsägarnas vy.",
    },
    {
      q: "Kan sökningen i dokument hitta på svar?",
      a: "Den ska alltid visa vilket dokument svaret kommer ifrån, så att du kan kontrollera. Hittar den inget ska den säga det. I demon är svaren färdigskrivna exempel.",
    },
  ],
};

export const contact = {
  number: "07",
  label: "Kontakt",
  title: "Ska vi titta på ditt hus?",
  lead: "Berätta kort om byggnaderna så hör vi av oss för att boka ett samtal.",
  human: "Hellre prata med en människa?",
  form: {
    name: "Namn",
    email: "E-post",
    company: "Företag eller förening",
    companyOptional: "valfritt",
    role: "Jag är…",
    roles: [
      { value: "fastighetsagare", label: "Fastighetsägare" },
      { value: "installator", label: "Installatör" },
      { value: "privatperson", label: "Privatperson" },
      { value: "annat", label: "Annat" },
    ],
    message: "Meddelande",
    messagePlaceholder:
      "Till exempel: en förening med två hus från 1968, vi vill få koll på energin.",
    consentBefore: "Jag har läst",
    consentLink: "integritetspolicyn",
    consentAfter: "och går med på att ni sparar det jag skrivit för att kunna svara mig.",
    honeypot: "Lämna det här fältet tomt",
    submit: "Skicka",
    sending: "Skickar…",
    previewNote:
      "Det här är en förhandsversion av sidan. Formuläret går att prova, men meddelandet skickas inte vidare.",
    thanksTitle: "Tack, nu har vi fått det.",
    thanksText:
      "Vi läser allt själva och hör av oss så snart vi kan. Under tiden får du gärna klicka runt i demon igen.",
    again: "Skicka ett till meddelande",
    errorGeneric:
      "Något gick snett hos oss, inte hos dig. Försök igen om en stund, eller mejla oss direkt.",
    errors: {
      name: "Vi behöver ett namn att hälsa med.",
      email: "Den e-postadressen ser inte riktigt ut som en e-postadress.",
      role: "Välj det som passar bäst, ”Annat” går också bra.",
      message: "Skriv några ord, så vet vi vad samtalet ska handla om.",
      messageLong: "Det blev lite långt. Håll dig under 3000 tecken, resten tar vi i samtalet.",
      consent: "Vi behöver ditt ok för att få spara meddelandet.",
    },
  },
};

export const footer = {
  tagline: "Byggnaden, samlad på ett ställe.",
  privacy: "Integritetspolicy",
  cookies: "Cookies",
  rights: "Alla rättigheter förbehållna.",
  demoNote: "All data i demon är simulerad.",
};

export const notFound = {
  title: "Det här rummet finns inte på ritningen",
  text: "Vi har letat i alla våningar, till och med i källaren. Sidan du söker kan ha flyttat, eller så har länken ett stavfel.",
  back: "Tillbaka till entrén",
};
