# Personas and Jobs-to-be-Done — Welcome Germany

> Stage 0 deliverable. Draft v0.1 — personas are hypotheses until validated with real users ([validation-plan.md](validation-plan.md)).

## Persona 1 — Farid, 34, Afghan newcomer (primary, Dari UI)

Arrived in Germany 18 months ago; asylum procedure ongoing. Speaks Dari natively, some English, A2 German. Lives in shared accommodation; smartphone (mid-range Android) is his only computer. Receives letters from BAMF, Ausländerbehörde, Jobcenter, and his Krankenkasse.

- **Context:** letters arrive with no warning; every official envelope produces anxiety. He currently photographs letters and sends them to a cousin in another city or waits days for a social worker appointment.
- **Goals:** know immediately whether a letter is dangerous, whether he must act, and by when. Not miss anything that affects his asylum case.
- **Frustrations:** Google Translate garbles bureaucratic German; friends' explanations are inconsistent; counseling centers are booked out for weeks.
- **Tech ability:** comfortable with WhatsApp, camera, mobile browser. Not comfortable with accounts, forms, or email attachments.
- **Trust factors:** wants to know the letter isn't stored or shared with authorities. Dari (not Iranian Farsi) wording signals the product respects who he is.
- **Accessibility notes:** reads Dari comfortably; long paragraphs in any language are a barrier — short blocks, clear headings.

## Persona 2 — Rana, 27, English-speaking newcomer (primary, English UI)

Moved from India to Berlin on a skilled-worker visa; works in tech. Fluent English, A1 German. Receives letters from Finanzamt, Bürgeramt, health insurer, landlord, Rundfunkbeitrag.

- **Context:** can afford mistakes less than she thinks (visa renewal depends on clean records); currently pastes letters into a chatbot and hopes it's right.
- **Goals:** fast, structured answer; confidence about deadlines; a correct polite German reply she can adapt.
- **Frustrations:** generic AI answers with no evidence; not knowing whether a letter is routine or serious.
- **Trust factors:** privacy-conscious; wants to see _why_ the app concluded something (evidence snippets matter).
- **Tech ability:** high. Will notice and distrust sloppy UX.

## Persona 3 — Maryam, 46, helper (secondary)

Volunteer at an Afghan community association; also helps neighbors. Bilingual Dari/German. Uses the app _on behalf of others_, often on the other person's phone.

- **Goals:** triage quickly — which of five letters needs action this week; show the person the evidence in German so they learn.
- **Implications:** the app must work without any personal setup (no account = essential), reset cleanly between letters, and never store the previous person's document.

## Persona 4 — Social worker / Migrationsberatung staff (secondary, later)

Professional counselors with 30-minute slots and waiting lists. Might recommend the app for routine letters to free capacity for serious cases. **Implication:** the high-risk escalation must be conservative and credible, or professionals will not recommend the tool.

## Jobs-to-be-Done

| #   | When…                                           | I want to…                                                    | So that…                                           |
| --- | ----------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| J-1 | I receive a German official letter I can't read | know if it requires action and by when                        | I don't suffer consequences for missing a deadline |
| J-2 | a letter looks serious (court, BAMF, police)    | know immediately how serious it is and that I need human help | I get to the right help in time                    |
| J-3 | a letter asks for documents                     | know exactly which documents are requested                    | I can prepare them without a counselor appointment |
| J-4 | I must answer a letter                          | get a correct, polite German draft                            | I respond on time without paying for translation   |
| J-5 | I'm helping someone else with their mail        | triage several letters quickly with no setup                  | I help more people in the time I have              |
| J-6 | I'm unsure whether I understood correctly       | see the original German passage behind each conclusion        | I can verify with a German speaker if needed       |
| J-7 | I worry where my document goes                  | see plainly that it isn't stored or shared                    | I can use the service without fear                 |

## Non-users to respect

- **Illiterate or low-literacy users:** v1 is text-based; voice output is a documented future direction, not a promise.
- **People with no smartphone/internet:** out of reach for a web MVP; community orgs remain their path.
- **Minors:** not a target group; age/minor-use assessment is a legal-review item.
