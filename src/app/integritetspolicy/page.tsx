import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/sv";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description: "Hur Proptex hanterar personuppgifter som du lämnar på webbplatsen.",
  alternates: { canonical: "/integritetspolicy" },
};

const c = site.company;

export default function Page() {
  return (
    <LegalPage title="Integritetspolicy" updated="[DATUM]">
      <p>
        Här beskriver vi vilka personuppgifter vi samlar in via webbplatsen, varför och hur länge vi
        sparar dem. Vi försöker skriva så att det går att förstå utan jurist.
      </p>
      <h2>Vem ansvarar?</h2>
      <p>
        {c.name}, org.nr {c.orgnr}, {c.address}, är personuppgiftsansvarig. Du når oss på {c.email}.
      </p>
      <h2>Vad vi samlar in</h2>
      <p>När du skickar kontaktformuläret sparar vi det du skriver:</p>
      <ul>
        <li>namn och e-postadress</li>
        <li>företag eller förening, om du anger det</li>
        <li>vilken typ av kontakt du är (till exempel fastighetsägare)</li>
        <li>ditt meddelande och tidpunkten när det skickades</li>
      </ul>
      <p>
        Vi samlar inte in något annat via webbplatsen. Demon på sidan använder bara påhittad data
        och sparar ingenting om dig.
      </p>
      <h2>Varför och med vilken rätt</h2>
      <p>
        Vi använder uppgifterna för att svara dig och, om du vill, boka ett samtal. Den rättsliga
        grunden är ditt samtycke, som du ger när du kryssar i rutan i formuläret. Du kan när som
        helst ta tillbaka samtycket.
      </p>
      <h2>Hur länge</h2>
      <p>
        Vi sparar uppgifterna så länge vi har kontakt, och längst [ANTAL] månader efter senaste
        kontakten om det inte blir ett avtal. Blir det ett avtal gäller villkoren i det.
      </p>
      <h2>Vem mer får se uppgifterna</h2>
      <p>
        Formuläret skickas via [TJÄNST FÖR FORMULÄR/E-POST]. Webbplatsen drivs hos
        [DRIFTLEVERANTÖR]. De behandlar uppgifterna för vår räkning enligt
        personuppgiftsbiträdesavtal. Vi säljer aldrig uppgifter vidare.
      </p>
      <h2>Dina rättigheter</h2>
      <p>
        Du har rätt att få veta vilka uppgifter vi har om dig, få dem rättade eller raderade,
        begränsa behandlingen och flytta dem. Hör av dig till {c.email}. Tycker du att vi gör fel
        kan du klaga hos Integritetsskyddsmyndigheten (IMY).
      </p>
    </LegalPage>
  );
}
