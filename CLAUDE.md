# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## GitHub Sync (Auto-Push)

Este projeto está vinculado ao repositório GitHub `ISABELAPIRES/rheumascan`.

**Comportamento automático:** ao final de cada sessão do Claude Code, o hook `Stop` executa `.claude/scripts/auto-push.ps1`, que faz `git add . && git commit && git push origin main` sempre que houver alterações pendentes.

**Para criar o repositório pela primeira vez (rodar uma vez no terminal):**
```powershell
gh auth login          # autenticar com GitHub (abre o navegador)
gh repo create rheumascan --public --source=. --remote=origin --push
```

**Para sincronizar manualmente:**
```powershell
cd "c:\Users\isapi\OneDrive\Área de Trabalho\PROJETOS CLAUDE\rheumascan"
git add . && git commit -m "update" && git push origin main
```

**Para ver o status:**
```powershell
git status
git log --oneline -5
```

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build
npm run lint      # ESLint check
npm run preview   # preview production build locally
```

All commands must be run from the `rheumascan/` directory.

## Architecture

**RheumaScan** is a React 19 + Vite 8 SPA for rheumatologists to browse recent PubMed articles and official guidelines. No router — tab state (`home` | `guidelines` | `favorites`) is managed with `useState` in `App.jsx`.

### Data flow

`src/services/pubmed.js` is the only API layer. Each search triggers two sequential NCBI E-utilities calls:
1. `esearch` → gets up to 20 article IDs filtered to the last 5 years
2. `esummary` → fetches metadata for those IDs (with a 400 ms deliberate delay to respect NCBI rate limits)

In dev, Vite proxies `/pubmed/*` to `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/*` (see `vite.config.js`). In a production deployment, this proxy must be replicated server-side — there is no backend today.

### Pages

- **Home** (`src/pages/Home.jsx`) — search + specialty filter, displays `ArticleCard` grid with skeleton loading state. The `useFavorites` hook (defined inline in this file) owns all localStorage read/write for favorites.
- **Favorites** (`src/pages/Favorites.jsx`) — reads `rheumascan_favorites` from localStorage on mount; manages its own removal logic (duplicates some logic from `useFavorites`).
- **Guidelines** (`src/pages/Guidelines.jsx`) — static list of ACR/EULAR/SBR guideline links, no API calls.

### Favorites persistence

Favorites are stored under the key `rheumascan_favorites` in `localStorage` as a JSON array of full article objects. The `useFavorites` hook in `Home.jsx` is the canonical write path; `Favorites.jsx` writes directly on removal.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed. Teal (`teal-600`/`teal-700`) is the primary brand color throughout.

### Article type badges

`ArticleCard` derives a display badge (Guideline, Meta-análise, Revisão, Ensaio Clínico) from the `pubTypes` array returned by PubMed's `esummary`. The mapping lives in `getBadge()` at the top of `src/components/ArticleCard.jsx`.
