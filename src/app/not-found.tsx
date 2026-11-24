import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { notFound } from "@/content/sv";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="innehall" className="wrap py-24 md:py-36">
        <div className="grid-12 items-center gap-y-10">
          <div className="col-span-12 md:col-span-6 md:col-start-2">
            <p className="eyebrow num text-copper">404</p>
            <h1 className="display h-lg mt-3">{notFound.title}</h1>
            <p className="measure text-ink-2 mt-6">{notFound.text}</p>
            <Link
              href="/"
              className="bg-copper text-paper hover:bg-ink mt-8 inline-block rounded-[3px] px-5 py-3 font-semibold"
            >
              {notFound.back}
            </Link>
          </div>
          <svg
            viewBox="0 0 240 200"
            className="col-span-12 h-auto w-full max-w-[320px] md:col-span-4 md:col-start-9"
            aria-hidden
          >
            <g fill="none" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round">
              <path d="M20 40h200v140H20z" fill="var(--paper-deep)" />
              <path d="M20 110h90M110 40v140M150 110h70M150 110v70" />
              <path d="M60 110v-6M75 40v6" />
              <path
                d="M150 130h70v50h-70z"
                fill="var(--paper)"
                strokeDasharray="4 4"
                stroke="var(--copper-graphic)"
              />
              <text
                x="185"
                y="160"
                textAnchor="middle"
                fontSize="20"
                fill="var(--copper)"
                stroke="none"
                fontFamily="var(--font-fraunces)"
              >
                ?
              </text>
            </g>
          </svg>
        </div>
      </main>
      <Footer />
    </>
  );
}
