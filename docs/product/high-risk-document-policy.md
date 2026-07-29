# High-Risk Document Policy — Welcome Germany

> Stage 0 deliverable. Draft v0.1 — draft for professional review; the category list and behavior rules require legal input before launch.

## Purpose

Some letters can change a person's life if misunderstood. For these, the product must become _more_ cautious, not more helpful-sounding. This policy defines which documents are high-risk, how the system must behave, and how escalation to human help works.

## High-risk categories

| Code  | Category                                           | Examples of German signals (non-exhaustive)                                              |
| ----- | -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| HR-01 | Courts / judicial proceedings                      | Amtsgericht, Landgericht, Klage, Mahnbescheid, Vollstreckungsbescheid, Ladung, Beschluss |
| HR-02 | Criminal accusations                               | Strafbefehl, Anklage, Beschuldigter, Staatsanwaltschaft                                  |
| HR-03 | Police / prosecution matters                       | Polizei, Vorladung, Zeugenvernehmung, Ermittlungsverfahren                               |
| HR-04 | Deportation / removal                              | Abschiebung, Ausreiseaufforderung, Ausreisepflicht, Duldung (revocation)                 |
| HR-05 | Asylum decisions                                   | BAMF Bescheid, Ablehnung, offensichtlich unbegründet, Klagefrist                         |
| HR-06 | Residence-permit rejection / revocation            | Aufenthaltstitel, Versagung, Widerruf, Rücknahme                                         |
| HR-07 | Imminent loss of benefits                          | Aufhebung, Erstattung, Sanktion, Leistungseinstellung (Jobcenter/Sozialamt)              |
| HR-08 | Enforcement / seizure / debt collection            | Zwangsvollstreckung, Pfändung, Inkasso, eidesstattliche Versicherung                     |
| HR-09 | Eviction / housing termination                     | Kündigung des Mietverhältnisses, Räumungsklage, fristlose Kündigung                      |
| HR-10 | Employment dismissal                               | Kündigung (employer), Abmahnung with termination threat                                  |
| HR-11 | Tax penalties / criminal tax matters               | Steuerstrafverfahren, Verspätungszuschlag with escalation, Schätzungsbescheid            |
| HR-12 | Child protection / custody                         | Jugendamt (protective context), Sorgerecht, Inobhutnahme                                 |
| HR-13 | Urgent medical decisions                           | urgent treatment consent, insurance denial of urgent care                                |
| HR-14 | Unclear deadline + potentially serious consequence | any legalistic letter with a deadline the system cannot confidently interpret            |

**Classification stance: conservative.** When in doubt between high-risk and routine, classify high-risk. A false alarm costs a user some reassurance; a miss can cost them their housing or status. Detection combines model classification with deterministic keyword/sender checks (belt and suspenders); the deterministic layer can only _raise_ risk, never lower it.

## Required behavior for high-risk documents

1. Cautious plain-language summary only — what the letter _states_, in restrained wording.
2. Original German passages shown prominently for every conclusion.
3. **No definitive legal interpretation.** No "you will be deported", no "you will win the appeal".
4. No confident recommendations beyond: keep the letter, note the date, seek qualified help.
5. Clear statement that qualified assistance may be necessary, with the deadline (if explicit) emphasized as the reason to act quickly.
6. Display **categories** of professional help (no endorsements) sourced exclusively from the verified-resources file (below).
7. **Reply drafting disabled** for HR-01…HR-06 and HR-12. For other categories, at most a neutral acknowledgement/extension-request draft if a future policy revision explicitly permits it. MVP default: no drafts for any high-risk document.
8. `requiresHumanReview: true` and machine-readable `riskFlags` set in the output schema.
9. Risk communicated by text + icon + structure — never color alone.
10. Tone: serious and calm. No panic language, no minimization.

## Verified-resources file

- A configuration file (versioned in the repo) listing categories of help: Migrationsberatung (MBE), Jugendmigrationsdienste, Flüchtlingsräte (state refugee councils), public legal aid (Beratungshilfe/Prozesskostenhilfe — described, not promised), tenant associations (Mieterverein), debt counseling (Schuldnerberatung), workers' rights counseling.
- Every entry manually verified by a human before inclusion; verification date recorded; re-verification at a documented cadence (proposal: every 6 months).
- The model **never generates** resource names, phone numbers, or URLs. The application renders resources only from this file. An automated test must assert that resource strings in output originate from the file.
- MVP may launch with _categories described generically_ (e.g., "state refugee council") plus one national, stable, government-published entry point per category, if per-city verification is not feasible yet.

## Emergency escalation policy

The product is not an emergency service and must say so. If content indicates immediate danger (detention order, imminent deportation date, eviction date already passed):

- The result states plainly that the matter appears urgent and qualified help should be sought **now**.
- No emergency numbers are invented; only verified entries (112/110 are publicly canonical and may be included in the verified file for genuinely acute-danger wording, with careful scoping so bureaucratic urgency never triggers emergency-number display).

## Failure and abstention rules

- If the document is unreadable, incomplete, or contradictory: say so; do not fill gaps.
- If classification confidence is low: treat as HR-14 (unclear + potentially serious).
- If schema validation fails on a high-risk analysis: return a safe generic "we could not analyze this reliably — this letter may be important; consider getting help" response rather than retrying into a hallucination.

## Review

This policy is re-reviewed: after native Dari review, after legal review, after every eval-suite run that shows an escalation miss, and at minimum quarterly during the first year.
