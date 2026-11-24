"use client";

import { SiteLink } from "@/components/SiteLink";
import { useState, type FormEvent } from "react";
import { contact } from "@/content/sv";
import { contactSchema } from "@/lib/contact-schema";

const f = contact.form;
type Errors = Partial<
  Record<"name" | "email" | "role" | "message" | "consent" | "company", string>
>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      role: String(fd.get("role") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
    };
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Errors = {};
      parsed.error.issues.forEach((i) => {
        const k = String(i.path[0]) as keyof Errors;
        if (!errs[k]) errs[k] = i.message;
      });
      setErrors(errs);
      const first = Object.keys(errs)[0];
      (form.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "1") {
      setState("done");
      form.reset();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 422 && json.fieldErrors) {
        setErrors(json.fieldErrors);
        setState("idle");
        return;
      }
      if (!res.ok) throw new Error();
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done")
    return (
      <div role="status" className="border-copper-light border-l-2 py-2 pl-6">
        <p className="display h-md">{f.thanksTitle}</p>
        <p className="measure text-paper-muted mt-3">{f.thanksText}</p>
        {process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" && (
          <p className="measure text-copper-light mt-3 text-sm">{f.previewNote}</p>
        )}
        <button
          type="button"
          onClick={() => setState("idle")}
          className="text-copper-light mt-6 text-sm font-semibold underline underline-offset-4"
        >
          {f.again}
        </button>
      </div>
    );

  const field =
    "mt-1.5 w-full rounded-[3px] border border-line-dark bg-marin-800 px-3.5 py-3 text-paper placeholder:text-paper-muted/70 transition-colors duration-200 focus:border-copper-light focus:outline-none aria-[invalid=true]:border-bad-light";
  const label = "text-sm font-semibold text-paper";
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-err`} className="text-bad-light mt-1.5 text-sm">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className={label}>
          {f.name}
        </label>
        <input id="name" name="name" autoComplete="name" className={field} {...aria("name")} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="email" className={label}>
          {f.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          className={field}
          {...aria("email")}
        />
        {err("email")}
      </div>
      <div>
        <label htmlFor="company" className={label}>
          {f.company} <span className="text-paper-muted font-normal">({f.companyOptional})</span>
        </label>
        <input id="company" name="company" autoComplete="organization" className={field} />
      </div>
      <div>
        <label htmlFor="role" className={label}>
          {f.role}
        </label>
        <select id="role" name="role" defaultValue="" className={field} {...aria("role")}>
          <option value="" disabled>
            Välj
          </option>
          {f.roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {err("role")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={label}>
          {f.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={f.messagePlaceholder}
          className={field}
          {...aria("message")}
        />
        {err("message")}
      </div>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">{f.honeypot}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2">
        <label className="text-paper-muted flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--copper-light)]"
            {...aria("consent")}
          />
          <span>
            {f.consentBefore}{" "}
            <SiteLink
              href="/integritetspolicy"
              className="text-paper hover:text-copper-light underline underline-offset-4"
            >
              {f.consentLink}
            </SiteLink>{" "}
            {f.consentAfter}
          </span>
        </label>
        {err("consent")}
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="bg-copper-light text-marin hover:bg-paper rounded-[3px] px-6 py-3 font-semibold transition-colors duration-200 disabled:opacity-60"
        >
          {state === "sending" ? f.sending : f.submit}
        </button>
        <div aria-live="polite" className="text-bad-light text-sm">
          {state === "error" && f.errorGeneric}
        </div>
      </div>
    </form>
  );
}
