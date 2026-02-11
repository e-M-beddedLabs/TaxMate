# TaxMate - Monorepo

This repository contains the source code for the TaxMate application.

## Structure

- **tmfront/**: Frontend application (React + Vite + Tailwind)
- **v0/**: Other components/backend (FastAPI + Python)

## Deployment

Since this is a monorepo, you must configure your deployment service (Cloudflare Pages, Vercel, Render, etc.) to build from the specific subdirectory.

### Cloudflare Pages / Vercel (Frontend)

1.  **Framework Preset:** Vite
2.  **Root Directory / Build Directory:** `tmfront` (**Important**)
3.  **Build Command:** `npm run build`
4.  **Output Directory:** `dist`

### Render (Backend)

1.  **Root Directory:** `v0` (or `tmfront` if the backend is there)
2.  **Build Command:** `pip install -r requirements.txt`
3.  **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Local Development

To run the frontend locally:

```bash
cd tmfront
npm install
npm run dev
```
