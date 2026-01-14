<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js">
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/Turso-SQLite_Edge-4F46E5">
  <img src="https://img.shields.io/badge/Netlify-Deployed-00C7B7?logo=netlify">
  <img src="https://img.shields.io/badge/License-MIT-green">
</p>
# MindTrace
<img src="https://raw.githubusercontent.com/WeAreTheArtMakers/mindTrace/main/mindTrace.png" alt="mindTrace" width="100">



A minimal web app for capturing how you think, not just what you conclude.

## Philosophy

Most knowledge-sharing focuses on answers. MindTrace captures the thinking process—the steps, the reasoning, the mental journey from problem to solution.

No accounts. No likes. No AI-generated thinking. Just human reasoning, preserved.

## Features

- Create mind traces with problem descriptions and step-by-step thinking
- Multi-language UI (English, Turkish, French, Italian, German, Arabic, Hindi)
- Auto-detect browser language on first visit
- Locale-aware content: Turkish users see TR-relevant traces first
- AI-powered content translation (OpenAI or LibreTranslate)
- RTL support for Arabic
- Dark mode with system preference detection
- Mobile-first design
- No tracking, no cookies, no analytics

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | No | Enables AI translation via OpenAI |
| `LIBRETRANSLATE_URL` | No | Self-hosted LibreTranslate URL (e.g., `http://localhost:5000`) |

## Translation

### With API Key (OpenAI or LibreTranslate)
- UI translated to selected language
- Trace content translated on demand
- Translations cached in database (per trace + language)
- Detail view: auto-translates on load
- List view: click "Translate list" button

### Without API Key
- UI fully translated
- Trace content shows in original language
- Subtle note shown once per session

### Self-Hosting LibreTranslate (Free)
```bash
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
```
Then set `LIBRETRANSLATE_URL=http://localhost:5000`

## Seed Data

47 diverse example traces loaded on first run:
- **Global (EN)**: Career, relationships, productivity, health
- **Turkey (TR)**: Inflation, family pressure, emigration, KPSS
- **India (HI)**: Family expectations, UPSC, arranged marriage, joint family
- **Tech**: AI career shifts, crypto, remote work, layoffs

Seeding is idempotent—each trace has a unique `seedId`.

### Locale-Aware Ordering
When user selects Turkish, TR-tagged traces appear first. Same for Hindi, etc.

## Dark Mode

- Toggle via sun/moon icon in header
- Persists in localStorage
- Defaults to system preference

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Turso (SQLite edge database)

## Deployment (Netlify)

### Quick Deploy

1. Push to GitHub
2. Connect repo to Netlify
3. Build settings are auto-configured via `netlify.toml`

### Environment Variables (Required)

Set in Netlify dashboard → Site settings → Environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `TURSO_DATABASE_URL` | Yes | Turso database URL (e.g., `libsql://mindtrace-xxx.turso.io`) |
| `TURSO_AUTH_TOKEN` | Yes | Turso authentication token |
| `OPENAI_API_KEY` | No | Enables AI translation via OpenAI |
| `LIBRETRANSLATE_URL` | No | Self-hosted LibreTranslate URL |

### Turso Setup

1. Create account at [turso.tech](https://turso.tech)
2. Create database: `turso db create mindtrace`
3. Get URL: `turso db show mindtrace --url`
4. Create token: `turso db tokens create mindtrace`
5. Add both to Netlify environment variables

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For local development without Turso, the app uses a local SQLite file.

## License

MIT

---

Made with ❤️ by [WeAreTheArtMakers](https://github.com/WeAreTheArtMakers)
