# Coach App

A self-paced DevOps / AWS interview-prep course, built as a React + Vite + TypeScript app. Each topic (EC2, ASG, ALB & NLB, VPC, Terraform, ...) is its own guided module: knowledge → pieces → hands-on → troubleshoot → key-insight → Q&A → fault-injection → Q&A → conclusion, with later stages gated until you've answered the round ahead of them.

## Running it

```bash
npm install
npm run dev
```

It prints a local URL (usually `http://localhost:5173` — use whatever port it actually reports). Open that in a browser.

Optionally, run the local save server alongside it so answers persist to disk as well as to the browser's local storage:

```bash
python save_server.py
```

It listens on `http://127.0.0.1:8765` and writes to `coach-mode-data.json`. The app works without it — saves just stay in local storage only.

## Content format

Each module is authored as a plain-text `.txt` file in `src/data/content/` using a small tag vocabulary (`[STAGE]`, `[CODE]`, `[DEFS]`, `[TABLE]`, `[ROUND]`, etc.), parsed into the app's typed model by `src/lib/parseModuleContent.ts`. See `src/data/modules.ts` for how modules are loaded.

## Building

```bash
npm run build
```
