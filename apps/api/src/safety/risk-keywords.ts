import type { RiskFlag } from "@wg/validation";

/**
 * German signal words for high-risk letter categories.
 *
 * Source: docs/product/high-risk-document-policy.md (HR-01 … HR-14). This is
 * the deterministic half of a deliberately redundant classifier: the model
 * decides risk from meaning, this table decides from vocabulary, and the two
 * are combined so that EITHER can raise the risk level (see risk-classifier.ts).
 *
 * Matching is case-insensitive and substring-based, which is the right choice
 * for German: compounding means "Räumungsklage" must match a rule about
 * eviction, and a whole-word matcher would miss it. The cost is occasional
 * false positives, which the policy explicitly prefers over misses.
 */
export const RISK_KEYWORDS: ReadonlyArray<{ flag: RiskFlag; terms: readonly string[] }> = [
  {
    flag: "court_or_judicial",
    terms: [
      "amtsgericht",
      "landgericht",
      "oberlandesgericht",
      "verwaltungsgericht",
      "sozialgericht",
      "arbeitsgericht",
      "finanzgericht",
      "klage",
      "mahnbescheid",
      "vollstreckungsbescheid",
      "ladung",
      "gerichtstermin",
      "verhandlungstermin",
      "az.:",
      "aktenzeichen",
    ],
  },
  {
    flag: "criminal_accusation",
    terms: [
      "strafbefehl",
      "anklage",
      "beschuldigt",
      "beschuldigter",
      "straftat",
      "strafverfahren",
      "geldstrafe",
      "freiheitsstrafe",
    ],
  },
  {
    flag: "police_or_prosecution",
    terms: [
      "staatsanwaltschaft",
      "polizeipräsidium",
      "polizeidirektion",
      "vorladung",
      "zeugenvernehmung",
      "ermittlungsverfahren",
      "beschuldigtenvernehmung",
    ],
  },
  {
    flag: "deportation_or_removal",
    terms: [
      "abschiebung",
      "abschiebungsandrohung",
      "ausreiseaufforderung",
      "ausreisepflicht",
      "ausreisepflichtig",
      "abschiebungshaft",
      "zurückschiebung",
    ],
  },
  {
    flag: "asylum_decision",
    terms: [
      "bundesamt für migration",
      "bamf",
      "asylantrag",
      "asylverfahren",
      "offensichtlich unbegründet",
      "unbegründet abgelehnt",
      "klagefrist",
      "dublin",
    ],
  },
  {
    flag: "residence_permit_negative",
    terms: [
      "aufenthaltstitel",
      "aufenthaltserlaubnis",
      "niederlassungserlaubnis",
      "versagung",
      "widerruf",
      "rücknahme",
      "erlischt",
      "duldung",
      "ausländerbehörde",
    ],
  },
  {
    flag: "benefits_loss",
    terms: [
      "aufhebungsbescheid",
      "erstattungsbescheid",
      "rückforderung",
      "sanktion",
      "leistungseinstellung",
      "leistungskürzung",
      "minderung",
      "einstellung der leistungen",
      "versagung der leistung",
    ],
  },
  {
    flag: "enforcement_or_debt",
    terms: [
      "zwangsvollstreckung",
      "pfändung",
      "pfändungs- und überweisungsbeschluss",
      "gerichtsvollzieher",
      "inkasso",
      "eidesstattliche versicherung",
      "vermögensauskunft",
      "vollstreckungsankündigung",
    ],
  },
  {
    flag: "eviction_or_housing",
    terms: [
      "räumungsklage",
      "räumung",
      "kündigung des mietverhältnisses",
      "fristlose kündigung",
      "mietrückstand",
      "wohnungskündigung",
    ],
  },
  {
    flag: "employment_dismissal",
    terms: [
      "kündigung des arbeitsverhältnisses",
      "betriebsbedingte kündigung",
      "verhaltensbedingte kündigung",
      "abmahnung",
      "kündigungsschutzklage",
      "aufhebungsvertrag",
    ],
  },
  {
    flag: "tax_penalty",
    terms: [
      "steuerstrafverfahren",
      "steuerhinterziehung",
      "verspätungszuschlag",
      "säumniszuschlag",
      "schätzungsbescheid",
      "zwangsgeld",
    ],
  },
  {
    flag: "child_protection",
    terms: [
      "jugendamt",
      "inobhutnahme",
      "sorgerecht",
      "umgangsrecht",
      "kindeswohlgefährdung",
      "familiengericht",
    ],
  },
  {
    flag: "urgent_medical",
    terms: ["notfall", "dringende behandlung", "lebensbedrohlich", "sofortige behandlung"],
  },
];
