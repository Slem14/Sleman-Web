# Legal Review Questions — for a qualified German privacy/technology lawyer

> Stage 0 deliverable. Draft v0.1. Nothing in this project is launched publicly before these questions are answered. Questions are grouped by blocking level. This document is a briefing aid, not legal analysis.

## Product summary for the lawyer (one paragraph)

A free web app where a person uploads a photo/PDF of a German administrative letter and receives an AI-generated structured explanation in English or Dari: sender, document type, plain summary, explicit deadlines, explicitly requested actions/documents, with the supporting German passages shown. Optionally a placeholder-based polite German reply draft. No accounts; documents processed transiently and not stored; minimal operational logging without document content; high-risk letters (court, asylum, etc.) receive a deliberately cautious summary plus referral to categories of professional help.

## A — Launch-blocking questions

### A1. Rechtsdienstleistungsgesetz (RDG)

1. Does explaining the explicit content of an individual's official letter (sender, stated deadline, stated requested action) constitute a "Rechtsdienstleistung" (§2 RDG) requiring registration, or can it be structured as impermissible-free general information service?
2. Do the planned guardrails change the analysis: no legal conclusions, no eligibility statements, no recommendations beyond "seek qualified help", evidence-only extraction, explicit disclaimers?
3. Does the German reply draft (placeholder-based, user-reviewed, never auto-sent) cross into legal services? Should it be removed, restricted, or is it acceptable as drafted?
4. If any component is RDG-relevant, what structural options exist (scope reduction, cooperation with registered bodies, nonprofit framing)?

### A2. GDPR lawful basis & special categories

5. Uploaded letters routinely reveal Art. 9 data (asylum status, health, sometimes criminal matters — Art. 10). What is the appropriate lawful basis for transient processing: explicit consent (Art. 9(2)(a)) at upload? How should that consent be worded and captured without becoming a dark pattern?
6. Is the operator a controller (assumed yes)? Are there any joint-controller risks with the AI provider?
7. Is a DPIA required (systematic processing of special-category data via novel technology suggests yes)? Screening draft will be provided.
8. Users upload letters that contain _other people's_ data (e.g., family members, case workers). What obligations follow, and what UI wording is advisable?
9. Minors may use the service. Is an age gate or specific wording required?

### A3. AI provider & transfers

10. Under what conditions may C3 documents be sent to a third-country AI provider (e.g., US-headquartered with EU processing)? What must the DPA, SCCs/adequacy, no-training and retention terms contain?
11. Review our provider-assessment checklist (master-spec §9) — is anything missing?
12. Does the provider act as processor in all realistic configurations?

### A4. Transparency & consumer protection

13. Review the planned AI-transparency disclosures against the EU AI Act (transparency obligations for AI systems interacting with natural persons and limited-risk classification) and any German implementing acts. Is our classification correct? Any registration/marking duties?
14. Are the disclaimers ("not legal advice", "AI can err", "original document is authoritative") sufficient and correctly worded in German consumer-protection terms? Provide preferred wording if not.
15. Terms of use: liability limitation boundaries for a free service in Germany (§§ 305 ff. BGB); what can and cannot be disclaimed given foreseeable reliance on deadline information?

## B — Required before launch, not design-changing

16. Impressum: exact requirements given the founder's chosen legal form (checklist to be completed once entity details exist). Which legal form is advisable for liability given the product's risk profile (e.g., UG/gGmbH vs. sole proprietorship)?
17. Privacy notice: review draft (Stage 2 output) for completeness (Art. 13/14).
18. Cookie/storage: our only client-side persistence is a language preference in localStorage; we believe no consent banner is required (§ 25 TDDDG strictly-necessary exemption). Confirm.
19. Data-subject rights: with no stored documents and no accounts, how do we handle access/erasure requests meaningfully? Draft procedure will be provided.
20. Accessibility: does the Barrierefreiheitsstärkungsgesetz (BFSG) apply to this free service, and what does the accessibility statement need to contain?
21. Retention: review the proposed C2 log-retention schedule and abuse-record TTLs.
22. Incident response: breach-notification thresholds for a service that stores no content but processes special-category data transiently.

## C — Advisable / later

23. If the service is later monetized (e.g., donations, sponsors, paid tiers), which answers above change?
24. If community organizations embed or co-brand the tool, what agreements are needed?
25. Trademark check for the final product name before public marketing.
26. If the eval dataset ever includes redacted real letters (currently synthetic-only), what consent/anonymization standard applies?

## Instruction to future contributors

Never mark any legal artifact "compliant" or "approved". The only permitted statuses are: _draft for professional review_ → _reviewed by [lawyer, date]_ with their written conclusions attached.
