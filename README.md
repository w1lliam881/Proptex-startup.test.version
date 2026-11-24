# Proptex – webbplats med interaktiv 3D-demo

Next.js (App Router) + TypeScript + Tailwind CSS 4. 3D med three.js via `@react-three/fiber` och `@react-three/drei`. Allt i demon är simulerad data.

## Öppna sidan (enklast)

1. Installera [Node.js](https://nodejs.org) (välj LTS) om du inte redan har det. Görs en gång.
2. Dubbelklicka på **`Starta Proptex.command`** (Mac) eller **`Starta Proptex.bat`** (Windows).
3. Webbläsaren öppnas av sig själv. Låt fönstret som dök upp vara öppet, stäng det för att stänga av sidan.

Första gången tar det ett par minuter (installation och bygge). Sedan går det på några sekunder. Ändrar du texter eller data byggs sidan om automatiskt nästa gång du startar.

På Mac kan det första gången stå att filen är från en "oidentifierad utvecklare": högerklicka, välj **Öppna** och bekräfta. Har du laddat ner projektet som zip och filen inte går att köra, öppna Terminal i mappen och skriv `npm run preview`.

Samma sak från terminalen: `npm run preview`.

## För utvecklare

```bash
npm install
npm run dev          # http://localhost:3000, uppdateras direkt när du sparar
npm run build        # produktionsbygge
npm start            # kör bygget
npm run lint         # ESLint
npm run format       # Prettier
npm run check:contrast   # kontrastkontroll av färgparen (WCAG AA)
```

Kräver Node 20 eller senare. Kopiera `.env.example` till `.env.local` och fyll i vid behov.

## Driftsättning

**Vercel:** importera repot, inga inställningar behövs. Lägg in miljövariablerna under Settings → Environment Variables.

**Netlify:** importera repot. Netlify känner igen Next.js och använder sin Next-adapter automatiskt (byggkommando `npm run build`). Lägg in miljövariablerna under Site configuration → Environment variables.

Sätt `NEXT_PUBLIC_SITE_URL` till den riktiga domänen så blir sitemap, robots och Open Graph rätt.

## Ändra innehåll

| Vad | Var |
| --- | --- |
| Alla texter | `src/content/sv.ts` |
| All demodata (rum, enheter, lägenheter, lagkrav, frågor) | `src/data/demo.ts` |
| Färger | `src/app/globals.css` (CSS-variabler i `:root`, kopplade till Tailwind via `@theme`) |
| 3D-modellernas lerfärger | `clay` i `src/components/demo/three/shared.tsx` |
| Typsnitt | `src/fonts/` (Fraunces och Hanken Grotesk, SIL Open Font License), laddas med `next/font/local` |
| Favicon / wordmark | `src/app/icon.svg`, `src/components/Wordmark.tsx` |
| Open Graph-bild | `src/app/opengraph-image.tsx` (genereras med `next/og`) |

## Formuläret

Formuläret valideras med zod både i webbläsaren och i `src/app/api/contact/route.ts`. Det har en honeypot mot spam.

- `FORM_ENDPOINT` tom: inskicket loggas i serverkonsolen och besökaren får tack. Bra för lokal testning.
- `FORM_ENDPOINT` satt: inskicket skickas som JSON (`POST`) dit.

Exempel på koppling:
- **Formspree / Basin / Getform:** skapa ett formulär och sätt deras endpoint-URL som `FORM_ENDPOINT`. De mejlar vidare.
- **Make / Zapier / n8n:** skapa en webhook och skicka vidare till e-post, Slack eller CRM.
- **Egen e-post (t.ex. Resend, Postmark):** byt `fetch` i route-filen mot leverantörens SDK och lägg API-nyckeln som miljövariabel.

Uppdatera integritetspolicyn med vilken tjänst som tar emot uppgifterna.

## Statistik

Ingen statistik och inga icke-nödvändiga cookies som standard. För cookiefri statistik (t.ex. Plausible): sätt `NEXT_PUBLIC_ANALYTICS_ENABLED=true`, `NEXT_PUBLIC_ANALYTICS_DOMAIN` och `NEXT_PUBLIC_ANALYTICS_SRC`. Uppdatera cookiesidan först.

## Måste fyllas i före lansering

Sök efter hakparenteser i `src/`:
- `[FÖRETAGSNAMN AB]`, `[ORG.NR]`, `[ADRESS]`, `[E-POST]`, `[TELEFON]` i `src/content/sv.ts`
- `[NAMN]`, `[ROLL]`, `[ORT]` i avsnittet Om oss
- `[DATUM]`, `[ANTAL]`, `[TJÄNST FÖR FORMULÄR/E-POST]`, `[DRIFTLEVERANTÖR]`, `[STATISTIKTJÄNST]` på sidorna för integritetspolicy och cookies
- Telefonlänken i kontaktavsnittet (`href="tel:"` i `src/app/page.tsx`)

## Att kontrollera

- **Namn och domän:** Proptex och domänen är ännu inte kontrollerade mot varumärkesregister (PRV/EUIPO) och Bolagsverket.
- **Utfästelser:** sidan lovar inga svarstider eller priser. Lägger du till svarstider, se till att det är sådant ni kan hålla.
- **Påståenden som kräver belägg** (finns inte på sidan i dag, lägg inte till utan underlag): besparingar i kronor eller procent, antal kunder, kundcitat, säkerhetscertifieringar, påståenden om att data lagras i EU (FAQ säger "strävar efter", ändra när det är avtalat), att 3D-modellen kan byggas från ritningar inom en viss tid.
- Lagkravsexemplen (OVK, energideklaration, hissbesiktning, SBA, laddplatser) är förenklade exempel. Låt någon med branschkunskap läsa texterna innan lansering.

## Val vi gjort

- **Hjälterubrik:** "Huset vet. Nu gör du det också." Andra alternativ: "Vet du hur dina hus mår just nu?" och "Pärmen i källaren kan gå i pension."
- **Färger:** kopparn som text är justerad från `#B4532A` till `#A3481F` och varningsfärgen från `#B77A12` till `#8A5A0C` för att klara 4,5:1 på båda pappersbakgrunderna. Originalfärgerna används för grafik och 3D. Ljusa statusfärger för mörk bakgrund är tillagda. Kör `npm run check:contrast`.
- **3D:** modellerna byggs procedurellt av lådor (`wall()` i `src/components/demo/three/walls.ts` gör väggar med dörr- och fönsteröppningar utan CSG). Väggar, möbler och lägenhetsytor ritas med instancing. Flerbostadshuset har tre lägenhetstyper som definieras en gång i `aptTypes` och placeras ut 40 gånger.
- **Prestanda:** 3D laddas med dynamic import först när ytan närmar sig skärmen, renderar bara vid behov (`frameloop="demand"`) och pausar helt när den inte syns. `dpr` max 2.
- **Fallback:** utan WebGL, eller på svaga enheter (≤2 kärnor eller ≤1 GB minne), visas en SVG-ritning med text och länk till demobokning. Testa med `?no3d` eller `?weak` i adressen.
- **Mobil:** sidopanelen blir ett nedre ark under modellen. Vertikal scroll fungerar ovanpå modellen. Zoom med nypning är avstängd för att inte krocka med scroll.
- **Tillgänglighet:** alla reglage är vanliga knappar som går att nå med tangentbordet, även markörerna i 3D. Rum och enheter kan väljas i listor. Status visas alltid med ikon och text. Det finns en textbeskrivning av demon för skärmläsare. `prefers-reduced-motion` stänger av animationer.
