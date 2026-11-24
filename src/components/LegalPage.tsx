import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="innehall" className="wrap py-20 md:py-28">
        <div className="grid-12">
          <article className="[&_p]:text-ink-2 [&_ul]:text-ink-2 col-span-12 md:col-span-8 md:col-start-3 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            <p className="eyebrow text-ink-2">Senast uppdaterad {updated}</p>
            <h1 className="display h-lg mt-3">{title}</h1>
            <div className="measure">{children}</div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
