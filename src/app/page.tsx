import {
  hero,
  problem,
  how,
  audiences,
  demo,
  start,
  about,
  faq,
  contact,
  site,
} from "@/content/sv";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroDemo } from "@/components/HeroDemo";
import { Audiences } from "@/components/Audiences";
import { ContactForm } from "@/components/ContactForm";
import { DemoSection } from "@/components/demo/DemoSection";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, SectionHead, SimulatedTag } from "@/components/ui";
import { ScribbleUnderline, ScribbleCircle } from "@/components/Scribbles";

export default function Home() {
  return (
    <>
      <Header />
      <main id="innehall">
        {/* Hjälte */}
        <section
          aria-labelledby="hero-title"
          className="on-marin bg-marin text-paper relative overflow-hidden"
        >
          <div className="wrap grid-12 items-center gap-y-6 pt-6 pb-10 md:pt-10 md:pb-14">
            <div className="col-span-12 lg:col-span-5">
              <p className="eyebrow text-copper-light">{hero.eyebrow}</p>
              <h1 id="hero-title" className="display h-xl mt-5">
                <span className="block">{hero.titleLines[0]}</span>
                <span className="block">
                  {hero.titleLines[1].split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="relative inline-block">
                    {hero.titleLines[1].split(" ").slice(-1)}
                    <ScribbleUnderline className="scribble-draw text-copper-light absolute -bottom-2 left-0 h-4 w-full" />
                  </span>
                </span>
              </h1>
              <p className="lead measure text-paper-muted mt-8">{hero.lead}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <ButtonLink href="#kontakt" dark>
                  {hero.primary}
                </ButtonLink>
                <ButtonLink href="#demo" variant="quiet" dark>
                  {hero.secondary}
                </ButtonLink>
              </div>
            </div>
            <div className="col-span-12 -mx-5 lg:col-span-7 lg:-mr-10 lg:ml-0">
              <HeroDemo />
            </div>
          </div>
          <div className="wrap border-line-dark border-t py-4">
            <SimulatedTag dark />
          </div>
        </section>

        {/* 01 Problemet */}
        <section aria-labelledby="problem-title" className="wrap py-24 md:py-36">
          <SectionHead
            id="problem-title"
            number={problem.number}
            label={problem.label}
            title={problem.title}
          />
          <div className="grid-12 gap-y-12">
            <Reveal className="col-span-12 space-y-5 md:col-span-6 md:col-start-4">
              {problem.paragraphs.map((p, i) => (
                <p key={i} className={`measure ${i === 0 ? "lead text-ink" : "text-ink-2"}`}>
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal
              as="aside"
              delay={120}
              className="border-line col-span-12 border-t pt-5 md:col-span-3 md:col-start-10 md:mt-2"
            >
              <p className="eyebrow text-ink-2">{problem.aside.title}</p>
              <ul className="mt-3 space-y-3 font-serif text-lg leading-snug">
                {problem.aside.items.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <p className="text-ink-2 mt-4 text-xs">{problem.aside.note}</p>
            </Reveal>
          </div>
        </section>

        {/* 02 Så funkar det */}
        <section
          id="sa-funkar-det"
          aria-labelledby="how-title"
          className="border-line bg-paper-deep border-y py-24 md:py-36"
        >
          <div className="wrap">
            <SectionHead id="how-title" number={how.number} label={how.label} title={how.title} />
            <ol className="grid-12 gap-y-10">
              {how.steps.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.title}
                  delay={i * 80}
                  className={`border-ink col-span-12 border-t pt-5 sm:col-span-6 lg:col-span-3 ${i % 2 ? "lg:mt-14" : ""}`}
                >
                  <p className="num text-copper font-serif text-[2.4rem] leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="text-ink-2 mt-2">{s.text}</p>
                  {s.note && (
                    <p
                      className="text-copper mt-3 font-serif text-[1.05rem]"
                      style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
                    >
                      ↳ {s.note}
                    </p>
                  )}
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 03 För vem */}
        <section id="for-vem" aria-labelledby="who-title" className="wrap py-24 md:py-36">
          <SectionHead
            id="who-title"
            number={audiences.number}
            label={audiences.label}
            title={audiences.title}
          />
          <Audiences />
        </section>

        {/* 04 Demo */}
        <section
          id="demo"
          aria-labelledby="demo-title"
          className="border-line border-t py-24 md:py-32"
        >
          <div className="wrap">
            <SectionHead
              id="demo-title"
              number={demo.number}
              label={demo.label}
              title={demo.title}
            />
            <div className="grid-12 -mt-6 mb-12 md:-mt-10">
              <p className="measure text-ink-2 col-span-12 md:col-span-7 md:col-start-4">
                {demo.intro}
              </p>
            </div>
            <DemoSection />
          </div>
        </section>

        {/* 05 Så börjar vi */}
        <section
          aria-labelledby="start-title"
          className="border-line bg-paper-deep border-y py-24 md:py-36"
        >
          <div className="wrap">
            <SectionHead
              id="start-title"
              number={start.number}
              label={start.label}
              title={start.title}
            />
            <ol className="grid-12 gap-y-10">
              {start.steps.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.title}
                  delay={i * 80}
                  className="col-span-12 md:col-span-3 md:first:col-start-4"
                >
                  <p className="num text-ink-2 text-sm">
                    <span className="text-copper">{i + 1}.</span> {s.time}
                  </p>
                  <h3 className="display h-md mt-2">{s.title}</h3>
                  <p className="text-ink-2 mt-3">{s.text}</p>
                </Reveal>
              ))}
            </ol>
            <div className="grid-12 mt-14">
              <p className="border-copper col-span-12 border-l-2 pl-4 md:col-span-8 md:col-start-4">
                {start.price}
              </p>
            </div>
          </div>
        </section>

        {/* 06 Om oss */}
        <section aria-labelledby="about-title" className="wrap py-24 md:py-36">
          <SectionHead
            id="about-title"
            number={about.number}
            label={about.label}
            title={about.title}
          />
          <div className="grid-12 gap-y-10">
            <Reveal className="col-span-12 space-y-5 md:col-span-6 md:col-start-4">
              {about.paragraphs.map((p, i) => (
                <p key={i} className={`measure ${i === 0 ? "lead" : "text-ink-2"}`}>
                  {p}
                </p>
              ))}
            </Reveal>
            <div className="col-span-12 md:col-span-3 md:col-start-10">
              <ul className="space-y-4">
                {about.people.map((p, i) => (
                  <li key={i} className="border-line border-t pt-3">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-ink-2 text-sm">
                      {p.role}, {p.place}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Vanliga frågor */}
        <section aria-labelledby="faq-title" className="border-line border-t py-24 md:py-32">
          <div className="wrap">
            <SectionHead id="faq-title" label={faq.label} title={faq.title} />
            <div className="grid-12">
              <div className="border-ink col-span-12 border-t md:col-span-8 md:col-start-4">
                {faq.items.map((item) => (
                  <details key={item.q} className="group border-line border-b">
                    <summary className="flex cursor-pointer items-baseline justify-between gap-6 py-5 text-[1.1rem] font-semibold">
                      {item.q}
                      <span
                        aria-hidden
                        className="text-copper font-serif text-2xl leading-none transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="measure text-ink-2 pb-6">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Kontakt */}
        <section
          id="kontakt"
          aria-labelledby="contact-title"
          className="on-marin bg-marin text-paper py-24 md:py-36"
        >
          <div className="wrap">
            <SectionHead
              id="contact-title"
              number={contact.number}
              label={contact.label}
              title={contact.title}
              dark
            />
            <div className="grid-12 gap-y-12">
              <div className="col-span-12 md:col-span-3">
                <p className="text-paper-muted">{contact.lead}</p>
                <Reveal className="relative mt-10 w-fit">
                  <p className="font-serif text-xl">{contact.human}</p>
                  <p className="mt-2">
                    <a
                      href={`mailto:${site.company.email}`}
                      className="text-copper-light underline underline-offset-4"
                    >
                      {site.company.email}
                    </a>
                    <span className="text-paper-muted"> / </span>
                    <a href="tel:" className="text-copper-light underline underline-offset-4">
                      {site.company.phone}
                    </a>
                  </p>
                  <ScribbleCircle className="text-copper-light/60 pointer-events-none absolute -inset-x-5 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+2.5rem)]" />
                </Reveal>
              </div>
              <div className="relative col-span-12 md:col-span-8 md:col-start-5">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
