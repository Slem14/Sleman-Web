# Validation Plan — Welcome Germany

> Stage 0 deliverable. Draft v0.1. Goal: test the assumptions in [requirements.md §6](requirements.md) with real people before and during the pilot — without ever using real user documents in development or testing.

## Phase V1 — Problem interviews (can start now, parallel to Stages 1–3)

**Who:** 5–8 Dari-speaking newcomers (mix of asylum-context and other statuses), 3–5 English-speaking newcomers, 3–5 helpers/volunteers, 2–3 professional counselors (Migrationsberatung or similar).

**Recruiting channels (founder action):**

- Afghan community/cultural associations in the founder's region.
- Migration counseling services (MBE/JMD run by Caritas, Diakonie, AWO, DRK, Paritätischer).
- State refugee council (Flüchtlingsrat) volunteer networks.
- Integration courses (via teachers), community WhatsApp/Telegram groups.
- Personal network.

**Script themes (not a survey — conversations):**

1. Walk me through the last official letter you received. What did you do, step by step?
2. How long until you understood it? Who helped? What did it cost (time, favors, worry)?
3. Have you ever missed something important in a letter? What happened?
4. Show reaction cards: translation app vs. structured explanation mock — which answers your real question?
5. Privacy: what would you need to know before photographing a letter into an app? What would make you refuse? (Tests A-3, D-3.)
6. Language: Dari UI vs English vs German — what would you choose? (Tests A-2, D-4.)
7. For helpers/counselors: would you use this for triage? What would make you _stop_ recommending it? (Tests D-5, R-33.)

**Output:** interview notes (no personal data beyond first name/role with consent), assumption verdicts (supported / weakened / refuted), persona corrections.

## Phase V2 — Prototype walkthroughs (after Stage 2/3 — static journey + upload flow with stub analysis)

- Moderated sessions, participant's own phone, **synthetic letters we provide printed on paper** (photographing our fixtures, never their real mail).
- Tasks: select language → understand privacy screen (comprehension check: "what happens to your letter?") → upload → read a stub result → find the deadline → find the evidence → reset.
- Measure: task success, misunderstanding points, privacy-screen comprehension, RTL/Dari readability issues.
- Include at least one keyboard-only and one screen-reader session.

## Phase V3 — Analysis quality validation (Stage 4+, internal)

- Eval suite runs on synthetic fixtures (master-spec §14 list).
- **Native Dari review** of real output for every fixture: correctness, register, Afghan terminology, dangerous ambiguity. Findings logged as launch-blocking issues. (Recruit reviewer during V1 — see R-31.)
- Counselor review of high-risk flow: show HR fixtures' outputs to 2–3 professionals; ask "would this have harmed your client?"

## Phase V4 — Closed pilot (after Stage 8 gates pass)

- 2–4 partner organizations distribute access to a limited group.
- Participants use it on **their own real letters, on their own devices** — real documents never reach the team; feedback is collected _about_ the experience, never the letter contents (feedback form explicitly instructs not to paste letter text).
- Weekly metric review ([metrics.md](metrics.md)); incident path for any "the app misled me" report → treated as safety incident, root-caused against eval suite.
- Exit criteria to public launch: no unresolved safety incidents, completion rate acceptable, org partners willing to keep referring.

## Community-organization engagement principles

- Approach as partners, not user-acquisition channels: they get a triage tool and a feedback line, we get truth.
- Never imply endorsement without written agreement.
- Do not burden them: sessions ≤45 min, their premises, their languages.
- Share findings back (summary level).

## Ethics rules for all phases

- Informed consent for interviews/sessions; no compensation-dependent pressure; participants can stop anytime.
- No real letters in V1–V3, and in V4 real letters stay exclusively on participants' devices ↔ production service (same guarantees as any user).
- No recording of sessions where a real letter might be visible; notes only.
- Vulnerable-population care: no questions about case details, status specifics, or trauma; interpreter available where needed.

## Founder actions this plan needs now

1. List 5–10 candidate organizations and personal contacts (start with your own community ties).
2. Identify 1–2 native Dari reviewer candidates (can come from V1 participants or associations).
3. Decide the region/city for first outreach.
