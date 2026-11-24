import Link from "next/link";
import { footer, site } from "@/content/sv";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="border-line bg-paper border-t py-14">
      <div className="wrap grid-12 gap-y-8 text-sm">
        <div className="col-span-12 md:col-span-4">
          <Wordmark className="text-ink h-6 w-auto" />
          <p className="text-ink-2 mt-3">{footer.tagline}</p>
        </div>
        <address className="text-ink-2 col-span-12 not-italic md:col-span-4">
          <p className="text-ink font-semibold">{site.company.name}</p>
          <p>Org.nr {site.company.orgnr}</p>
          <p>{site.company.address}</p>
          <p>
            <a
              href={`mailto:${site.company.email}`}
              className="hover:text-copper underline underline-offset-4"
            >
              {site.company.email}
            </a>
          </p>
        </address>
        <nav aria-label="Juridiskt" className="col-span-12 md:col-span-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/integritetspolicy"
                className="hover:text-copper underline underline-offset-4"
              >
                {footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-copper underline underline-offset-4">
                {footer.cookies}
              </Link>
            </li>
          </ul>
          <p className="text-ink-2 mt-4">{footer.demoNote}</p>
          <p className="num text-ink-2 mt-1">
            © {new Date().getFullYear()} {site.company.name}. {footer.rights}
          </p>
        </nav>
      </div>
    </footer>
  );
}
