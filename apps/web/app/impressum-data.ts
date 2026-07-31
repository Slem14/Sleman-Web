/**
 * Impressum details — § 5 DDG (formerly § 5 TMG).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * FILL THIS IN. It is the only file you need to edit, and the site is not
 * legally operable in Germany until you do. Running ads makes the service
 * `geschäftsmäßig`, which is exactly what triggers the obligation.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * What each field must contain:
 *
 *  name     Your full legal name. If you later register a company, the
 *           company name PLUS its legal form (GmbH, UG (haftungsbeschränkt),
 *           Einzelunternehmen …).
 *
 *  address  A `ladungsfähige Anschrift` — a real street address where legal
 *           documents can be served on you. A Postfach / PO box does NOT
 *           satisfy this, and neither does an address abroad if you operate
 *           from Germany. This is the requirement people most often get
 *           wrong, and it is the one that gets enforced.
 *
 *  email    A working address that a person actually reads. Required.
 *
 *  phone    Required alongside email: the law wants a channel allowing
 *           `unmittelbare Kommunikation`. A contact form alone is not enough.
 *
 *  vatId    Umsatzsteuer-Identifikationsnummer (DE………), ONLY if you have one.
 *           As a Kleinunternehmer under § 19 UStG you usually will not —
 *           leave it empty rather than inventing one.
 *
 *  register Handelsregister / Registernummer, ONLY if actually registered.
 *           A sole trader is not.
 *
 * Empty optional fields are simply omitted from the page. Empty REQUIRED
 * fields make the page say plainly that it is incomplete, because a
 * half-filled Impressum is worse than an obviously unfinished one — it looks
 * like a claim of compliance that is not true.
 */
export interface ImpressumDetails {
  name: string;
  addressLines: string[];
  email: string;
  phone: string;
  vatId?: string;
  register?: string;
}

export const IMPRESSUM: ImpressumDetails = {
  name: "Sleman Parwiz",
  addressLines: ["Ferdinand-Lassalle-Ring 14", "06366 Köthen (Anhalt)"],
  email: "parwizsleman@gmail.com",
  phone: "0152 21025261",
  // Not applicable: sole operator, no VAT registration and no company
  // register entry. Both are omitted from the rendered page rather than
  // shown empty — an empty field reads as an unanswered legal question.
  vatId: "",
  register: "",
};

/** True once every legally required field carries a value. */
export function isImpressumComplete(d: ImpressumDetails = IMPRESSUM): boolean {
  return (
    d.name.trim() !== "" &&
    d.addressLines.filter((l) => l.trim() !== "").length > 0 &&
    d.email.trim() !== "" &&
    d.phone.trim() !== ""
  );
}
