import { SiteLink } from "@/components/SiteLink";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/sv";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Vilka cookies Proptex webbplats använder. Kort svar: inga som inte behövs.",
  alternates: { canonical: "/cookies" },
};

export default function Page() {
  return (
    <LegalPage title="Cookies" updated="[DATUM]">
      <p>
        Kort version: webbplatsen sätter inga cookies för statistik eller marknadsföring. Därför ser
        du ingen cookie-ruta.
      </p>
      <h2>Vad som används</h2>
      <ul>
        <li>Inga spårningscookies och inga tredjepartscookies.</li>
        <li>Typsnitt och 3D-modell laddas från vår egen server, inte från externa tjänster.</li>
      </ul>
      <h2>Statistik</h2>
      <p>
        Om vi slår på besöksstatistik använder vi en tjänst som räknar besök utan cookies och utan
        att spara uppgifter som identifierar dig. Vi uppdaterar den här sidan innan det sker och
        anger då vilken tjänst det är: [STATISTIKTJÄNST].
      </p>
      <h2>Frågor</h2>
      <p>
        Hör av dig till {site.company.email}. Mer om hur vi hanterar personuppgifter finns i{" "}
        <SiteLink
          base="../"
          href="/integritetspolicy"
          className="text-copper underline underline-offset-4"
        >
          integritetspolicyn
        </SiteLink>
        .
      </p>
    </LegalPage>
  );
}
