---
name: aganitha-doc-writing
description: Write, review, or revise a project document so a reader can actually evaluate it — direct literal English, plus the content a reader needs to judge the proposal. Use when writing or editing any prose document (proposals, design docs, specs, READMEs, guides, reports, notes to a team), when someone says "write this up", "review this doc", "edit this document", "make this clearer", or before sending a document to readers. Also applies while drafting prose inside a document another skill owns — that skill decides the sections, this one decides the writing.
---

# Doc Writing

Most weak project documents fail the same way. They describe concepts without
making the proposed thing concrete enough to examine. The reader cannot place
it in the project, cannot see it operate, and cannot judge whether it solves
the problem.

A document works when the reader can answer four questions: where does this
fit, what does it actually provide, how do people use or extend it, and how do
I judge whether it is good enough. Abstractions and diagrams help when they
make the system easier to reason about. They do not replace showing the
mechanism.

## How this runs

**Create** — write the document from notes or a brief. Produces the document
itself, placed where the request or the owning skill says it goes.

**Review** — check an existing document. Produces a findings list first: what is
missing or unclear, one line each. Revise only after the author agrees. Keep the
author's decisions — fix the writing, not the position.

**In passing** — a paragraph inside a document nobody asked you to write. Apply
the style rules only. Do not run the content checks, and do not restructure
someone's document because you touched one paragraph of it.

## Calibrate to scope

| Document | Treatment |
|---|---|
| Proposal, design doc, vision, spec — something a reader must approve or build from | Full run — every check |
| README, guide, runbook | Style checks, plus purpose, what it concretely is, and one scenario |
| Note answering one narrow question | Style checks only |

Most documents ask somebody to change what they do. A note that answers one
question does not, and does not need a scenario section.

## Not covered

- **Blog posts and other published writing** — a different voice with its own
  rules. Unresolved: until someone decides otherwise, this skill does not
  govern `blogs/`.
- **Prose inside code** — comments, docstrings, commit messages. The language
  convention skills and `aganitha-code-review` own those.
- **Persuasive documents** — the no-decoration rule assumes the reader is
  evaluating a proposal, not being sold one.

## Who owns the structure

When another skill owns the document — `aganitha-design-doc` for `design.md`,
`aganitha-vision` for `vision.md`, `aganitha-handoff` for `handoff.md` — that
skill decides the sections and their order. This skill decides the writing and
supplies the checks below. Where the two disagree about structure, the owning
skill wins.

Those skills ship in other packs and may not be installed here. When none is
present, this skill supplies the sections too — the checks below stand on their
own and depend on nothing outside this file.

## What to interrogate

These five find most of what is wrong. Run them on any document, whatever its
structure.

### Kinds of user, then scenarios

List the different kinds of user before writing any scenario. A system usually
serves several — the person who adopts it, the one who uses it daily, the one
who extends it, the one who operates it when it fails, the one who approves it
— and each operates it differently. Ask what each one's way of working requires
from the design. This is not requirements gathering; the goal is enough outline
to notice a kind of user the design has not accounted for.

Then ask what the list exists to raise: **does one system serve all of them?**
When two kinds share no artifact, no moment of use, and no lifecycle, the
document is describing two systems that have not been separated yet.

A scenario names who starts the action, what they supply, which component
receives it, what it does, what comes back, and where responsibility passes on.
Include one showing someone extending the system: who changes what, where it
goes, what stays the same, how they verify it.

**Make it specific** — a named person, a real moment, actual counts. "A user
asks a question and receives a brief" exposes nothing. "Priya asks on Tuesday;
the watcher finds nine changes; the analyzer keeps two and lists the seven it
dropped" forces the questions the vague version hides. The numbers turn a
description into something that can be wrong.

### What passes between the parts

Naming the components is not describing the system. For every pair of parts
that work together, say what crosses the boundary and in what form.

A document can describe each component well and still leave the reader unable
to tell whether they fit. When one part produces a written report and the next
needs a list of records, the design is broken, and no description of either
part alone reveals it. Form is part of the contract: "the analyzer reads the
findings" hides whether findings are structured records or prose the next stage
must re-interpret.

### The edges — how things get in and out

Documents go vague where the system meets a person or the outside world, not at
the centre. The centre gets thought through because it is obviously hard; the
arrival and delivery points get a phrase instead of a decision.

- "The user provides the input" — through what? A CLI, a web form, a file drop?
  Typed, uploaded, or pasted, and in what format?
- "The system informs them" — pushed or fetched, landing where, and what
  happens when nobody is there to receive it?
- "The system knows their project" — declared, discovered, or derived? If
  discovered, by what and when? If declared, by whom and stored where?
- "Periodically" or "on a change" — what starts the run?

"By a REST call" answers none of these. The question underneath is the model,
not the transport: does the system hold this knowledge, or go and find it?

### Words that imply memory

*New*, *changed*, *since last time*, *again*, *still*, *remaining*, *resume* —
each asserts that the system remembers something. Say what is remembered, where
it is kept, and whose it is.

"Only what changed since the last run" is a state claim. Changed since when —
the last run by anyone, or by this person? The second means per-person state, a
different system from one taking a date range as input. The check is mechanical:
search for those words, make each one say where its memory lives.

### Claims without mechanisms

*Scalable*, *extensible*, *reliable*, *robust*, *flexible*, *easy to use* carry
no information alone. Scalable in which dimension, to what size, limited by
what? Describe the mechanism and let the reader draw the conclusion, or delete
the word.

The same applies to capabilities. *Decides*, *compares*, *identifies*, *weighs*,
*knows* — each asserts the system can do something; say what it reads in order
to do it. "Compares each finding against the undecided parts of the proposal"
requires knowing which parts are undecided. A verb with no named input fails
exactly as an adjective with no mechanism.

If you cannot answer, the claim is not yet true. Delete it.

## Sections the document needs

Structural, and often supplied by the owning skill. Check that they exist; do
not restate the shape when another skill already specifies it.

**Purpose and audience** — what the document proposes, who reads it, what
decision it supports. Short; it orients the reader, it is not the content.

**Place in the project** — what comes before and after, which problem this owns
and which it does not, what it replaces or leaves unchanged. Without it the
reader cannot judge importance or duplication.

**What the thing concretely is** — *framework*, *platform*, and *workflow* do
not say what gets built. Name the artifact (a library, a service, a CLI, a
protocol, a review process) and how people adopt it: import a package, run a
command, edit a config file, follow a process.

**Whose work changes** — what people do today, what is slow or confusing about
it, what they will do instead, who is better off. If you cannot write this, the
proposal has no user.

**What is unresolved** — assumptions, open decisions, deferred problems, known
limits, risks. A design that looks finished when it is not wastes the reviewer's
attention.

**The reader's next action** — approve, comment on a named question, compare two
options, implement a defined part.

Keep common structure brief and give most of the document to what distinguishes
this system. A database-backed workflow application does not need three pages
establishing that it has a database.

## Style

Write for readers who use English as a second language. Make the English
direct.

**Simplify the language, never the content.** These are independent. The reader
is an expert evaluating the work — they know the domain, and explaining what
they already understand wastes their attention as surely as an idiom costs them
a second reading. Simple sentences carrying expert-level content is the target.
Simple sentences carrying beginner-level content is the failure this rule is
most often misread into.

**Name the actor and the action.** Prefer sentences where a person, team,
component, or process does something. Abstract nouns may name the subject; they
should not replace explaining who does what.

**Use concrete verbs** — stores, reads, sends, checks, starts, retries,
displays, validates. Use *supports*, *enables*, *handles*, and *provides* only
when the sentence says what they mean.

**Say it literally.** No idioms, no figurative language. Technical jargon is
correct when it is the right term for the subject. General English jargon is not.

**Unpack compressed statements.** A technically correct phrase can still hide
the reasoning. Explain the concrete problem first, then name the term if it
helps later discussion.

**Prefer clarity over shortness.** Do not cut words that carry reasoning. Keep
distinctions, conditions, limits, and trade-offs; remove repetition and filler.
The goal is the shortest explanation that keeps the reasoning.

**One idea per sentence, one job per paragraph.** A paragraph states a claim,
explains a problem, describes a mechanism, gives an example, or discusses a
trade-off. Break sentences carrying several nested clauses. Do not split one
continuous explanation into many one-sentence paragraphs for visual space.

**Lists only for parallel items** — alternatives, requirements, steps, checks,
examples of one kind. Keep items grammatically parallel. When one point depends
on the previous one, write prose.

**No decoration.** No slogans, dramatic framing, or exaggerated claims. State
limits plainly. Write so a sentence survives translation: literal language,
explicit actors, simple structure.

### Avoid / prefer

| Avoid | Prefer |
|---|---|
| a load-bearing assumption | an assumption the design depends on |
| The architecture enables flexibility. | Developers can replace the renderer without changing the skill. |
| The service supports artifact management. | The service stores artifacts, assigns identifiers, and lets users retrieve them later. |
| This creates a leaky abstraction. | The job manager must now know how the runner stores files. A change in the runner may then force a change in the job manager. |
| The registry provides discoverability and governance. | The registry helps developers find available skills. It also lets the platform team mark which ones are approved. |
| The job manager should never know about tools. | The job manager should not know how tools are staged or executed. It may still store the tool name in the job record. |
| The framework supports registration, discovery, and subscription. | A skill asks for a service by name. The registry resolves the name to a definition, and the runtime creates the client. The registry does not make service calls or manage retries. |
| The system is scalable and extensible. | The scheduler adds workers without a restart, and a new job type needs one file under `jobs/`. |

## Checklist before finishing

Report each as `[✓]` / `[✗]`, using only the blocks the scope table gives this
document. Do not report `[✗]` against a check that was never meant to apply — a
runbook is not a failed proposal.

**Every document**

- [ ] No idioms, no decoration, no vague verb left unexplained
- [ ] Every sentence names who does what
- [ ] Every claim — adjective or capability — is justified by a mechanism or a named input, or deleted

**Guides, READMEs, runbooks, and above**

- [ ] The document says what it proposes, who reads it, and what decision it supports
- [ ] The artifact is named concretely, with how people adopt it
- [ ] At least one scenario shows the system operating, with responsibilities visible, and it is specific — named person, real moment, actual counts

**Full run only**

- [ ] The reader can see where it fits, and what it does not own
- [ ] Somebody's work visibly changes — before, after, who benefits
- [ ] The different kinds of user are named, each one's way of working was checked against the design, and one system genuinely serves all of them
- [ ] Every connection between parts says what crosses it, and in what form
- [ ] Every edge says how — how input arrives, how output is delivered, and whether what the system knows is declared, discovered, or derived
- [ ] Every word implying memory — new, changed, since, again — says where that memory lives
- [ ] At least one scenario shows someone extending or changing it (skip only if nothing is extensible)
- [ ] Unresolved questions, assumptions, and limits are stated
- [ ] The reader knows what to do next
