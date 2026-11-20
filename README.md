# Socra English-learner demo

A standalone humanities research prototype for exploring language access and teacher review of existing student conversations. The fixed task uses Glaucon’s account of justice from Plato’s *Republic*. This project is independent of Socra’s production codebase.

## Run locally

Requires Node.js 22.12 or later and npm.

```bash
git clone https://github.com/ismaeljlioui/socra-english-learner-demo.git
cd socra-english-learner-demo/demo
npm ci
npm run dev
```

Open [localhost:4317](http://127.0.0.1:4317/). Without model credentials, open **Research controls**, choose **Scripted walkthrough**, and start a session. Select a language case and **Play example** for response-by-response playback. Scripted examples make no AI requests and are labeled separately from live results.

For a local production build, run `npm run build` and then `npm start` from `demo/`. Sessions are held in server memory; export records before restarting.

## Included

- Text chat with the fixed source and question, support controls, and preserved drafts.
- 24 authored language cases, separate comparisons, and pause/step/replay controls.
- Illinois/WIDA simulated student context with independent reading and writing selections; levels are withheld from detector requests.
- Five proposed observation categories: contextual word meaning, logical relationships, unclear references, attribution, and claim–evidence connections.
- Exact quotation checks, teacher confirmation/dismissal/edits, assistance history, and JSON exports.
- Server-side Gemini integration with structured outputs, explicit configuration/quota errors, and no automatic model fallback or billing setup.
- The earlier assessment baseline/policy comparison, authored walkthroughs, tests, and research evidence log.

## Live configuration

Credentials are not included. For a new checkout, copy `demo/.env.example` to `demo/.env`, supply a Gemini key locally, and follow the [configuration and Free-tier verification instructions](demo/README.md#gemini-live-configuration). Do not overwrite an existing `.env`. The model remains configurable and identical across baseline and policy conditions. Never commit credentials or real student data.

## Deploy on Vercel

Import this repository with **Root Directory `demo`**. The included configuration deploys the Vite frontend and Node API together. Add Gemini configuration only as server-side environment variables, then redeploy. See the [hosting instructions and temporary-session limits](demo/README.md#vercel-deployment--2026-11-20). No persistent database or billing setup is included.

## Verification and limits

The recorded software baseline is **98 passing offline tests** and a successful production build. Run `npm test` and `npm run build` from `demo/` to verify your checkout. Verified desktop/mobile screenshots and actual synthetic live outputs are linked in the [demo README](demo/README.md).

The latest three synthetic detector checks completed after an initial schema rejection, but exposed overflagging and inappropriate uncertainty labels. Exact quotations do not prove correct interpretation. Authored expectations, mocked UI checks, and live model results remain distinct. These proposed categories are not official WIDA codes, diagnoses, or evidence of educational validity, fairness, or real-student performance. The Grades 9–12 task assumption is provisional; middle-school suitability remains unresolved.

## Project files

- [Demo, configuration, tests, and walkthrough](demo/README.md)
- [Current research brief](RESEARCH_BRIEF.md)
- [Illinois language-observation research](ILLINOIS_LANGUAGE_DETECTION.md)
- [Source and evidence log](SOURCES.md)
- [Original demo specification](DEMO_SPEC.md) and [acceptance cases](DEMO_CASES.md)

Local credentials, dependencies, generated builds, and future evaluation exports are ignored by Git. The retained evaluation files are synthetic development records, with failures and interpretation limitations preserved.
