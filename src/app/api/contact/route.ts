import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: fylls i av robotar. Låtsas att allt gick bra.
  if (
    body &&
    typeof body === "object" &&
    "website" in body &&
    (body as { website?: string }).website
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      parsed.error.issues.map((i) => [String(i.path[0]), i.message]),
    );
    return NextResponse.json({ ok: false, fieldErrors }, { status: 422 });
  }

  const { website: _hp, ...data } = parsed.data;
  void _hp;
  const payload = { ...data, receivedAt: new Date().toISOString(), source: "proptex-webb" };
  const endpoint = process.env.FORM_ENDPOINT;

  if (!endpoint) {
    console.info("[kontakt] FORM_ENDPOINT saknas, loggar bara:", payload);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[kontakt] Kunde inte skicka vidare:", err);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
