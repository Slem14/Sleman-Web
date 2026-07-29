# User Journey — Welcome Germany (MVP)

> Stage 0 deliverable. Draft v0.1. Emotional states inform UX tone (master-spec §7): users may arrive anxious; the app must never amplify fear.

## Main journey

### 1. Arrival

- **User state:** anxious or rushed; letter in hand; probably on a phone; possibly referred by a friend or community org.
- **Screen:** language selection as the first meaningful interaction. Large cards: **دری** and **English** (native names, no flags — flags misrepresent language communities). Nothing else demanded.
- **Exit risks:** doesn't see their language → clear "more languages coming" note without promises.

### 2. Privacy explanation

- **Screen:** 3–5 short plain-language points: your letter is analyzed by AI; it is not stored; no account needed; AI can make mistakes; this is not legal advice. One clear "Continue" action. Link to full privacy notice for those who want it.
- **Design rule:** this is reassurance, not a consent wall. If legal review requires acknowledgement, it's one honest checkbox, not a dark pattern.

### 3. Upload

- **Screen:** one large upload area. Two affordances: take a photo / choose a file. Accepted formats and size limit stated simply. Tip for photo quality ("flat, good light, whole page").
- **Multi-page:** MVP supports multi-page PDFs and multiple photos of the same letter (cap documented; exact limit set in Stage 3).
- **Failure paths:** wrong file type, too large, unreadable → specific, friendly recovery messages ("This photo is too blurry to read — try again with more light"), never error codes alone.
- **Optional masking (if shipped):** preview with detected personal data highlighted; user can proceed with or without masking; wording never claims completeness.

### 4. Processing

- **Screen:** calm progress state with staged messages (checking file → reading document → preparing explanation). Screen-reader announcements at each stage. No fake percentages.
- **Timeout path:** honest message, no blame, retry option; document already discarded.

### 5. Result — structured explanation

Order of information (progressive disclosure):

1. **Sender + document type** ("From: Jobcenter Berlin Mitte — a request for documents"), with confidence wording when uncertain.
2. **Action status + urgency** — the headline answer: "This letter asks you to do something" / "No explicit action found". Never color alone; icon + text.
3. **Deadline card(s)** — normalized date + the raw German sentence; interpretation flagged when the date was inferred.
4. **Plain-language summary** — short paragraphs.
5. **Requested actions / requested documents** — checklist style.
6. **Stated consequences** — only if explicitly in the letter.
7. **Contact details** — only as stated in the letter.
8. **Evidence** — each card expands to show the supporting German passage (LTR-isolated within RTL layout).
9. **Suggested next steps** — clearly separated: "from the document" vs "general advice".
10. **AI transparency footer** — AI-generated, can err, original letter is authoritative.

### 6. High-risk branch

If the document is court/asylum/deportation/eviction/etc. (see [high-risk-document-policy.md](high-risk-document-policy.md)):

- Calm, serious framing: "This letter appears to be about a court proceeding. For letters like this, getting help from a qualified person is strongly recommended."
- Cautious summary + evidence; no confident interpretation, no reply draft (or acknowledgement-only if policy permits).
- Categories of verified help displayed (e.g., migration counseling, legal advice services) from the manually verified resource file only.

### 7. Optional reply draft

- Separate, explicit action: "Create a German reply draft". Never generated automatically.
- Draft shown with placeholders ([NAME], [DATUM]); labeled clearly as a draft the user must review; one-tap copy; note that nothing is sent by the app.

### 8. Finish — delete/reset

- Visible "Delete and start over" always available. Confirmation that nothing was stored. Clean state for the next letter (critical for helper persona).

## Secondary journeys

- **Legal pages:** privacy notice, Impressum, terms reachable from every screen's footer.
- **Language switch mid-flow:** allowed; current result re-rendered if feasible, otherwise honest note that a new analysis is needed.
- **Return visit:** language remembered (browser storage); everything else fresh.
- **Abuse/limit hit:** rate-limited users get a plain explanation and retry time, not a CAPTCHA maze (bot mitigation must not punish humans; mechanism decided in Stage 6).

## Journey-level accessibility notes

- Every step operable by keyboard and screen reader; upload state changes announced.
- One primary action per screen; no time limits on reading.
- All step indicators textual, not only visual.
