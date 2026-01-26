# Developer Dashboard

A React + Vite dashboard for curated developer resources, built to practice **design systems**, **responsive UI**, **accessibility**, and **state management**.

## Running locally

- **Install**: `yarn install` (or `yarn`)
- **Dev server**: `yarn start` (Vite on port **3000**)
- **Build**: `yarn build`
- **Preview build**: `yarn preview`

## What’s implemented in this repo

- **Tailwind CSS v4 setup**
  - Uses `@tailwindcss/vite` (see `package.json`) and Tailwind’s CSS-first config in `src/index.css`.
  - Custom brand palette based on `#7b33cd` via `@theme` (see `src/index.css`).

- **Light/Dark theme**
  - Theme toggling uses a `data-theme` attribute and a Tailwind custom variant:
    - `@custom-variant dark (&:where([data-theme=\"dark\"], [data-theme=\"dark\"] *));` in `src/index.css`
  - Theme is managed in React Context and persisted to `localStorage` (see `src/contexts/AppContext.jsx`).

- **Responsive layout**
  - Mobile: sidebar behaves like a drawer (opened from the Header menu button).
  - Desktop: sidebar is positioned to stay visible while the main content scrolls (see `src/components/Layout.jsx`).

- **Accessible username flow**
  - Username gate before the dashboard renders.
  - Validation (required + min length) with inline, accessible error messaging (see `src/components/UserNameForm.jsx`).
  - Logout button clears username and resets theme (see `src/components/Header.jsx` and `src/contexts/AppContext.jsx`).

- **Resource rendering**
  - Resources come from JSON (`src/data/devResources.json`).
  - Cards and category lists render resource items with descriptions and external links.

- **Resource icons (favicons) with fallback**
  - Uses Google’s favicon service for more reliable logos (see `src/utils/getFavicon.js` and usage in `src/components/ResourcePreview.jsx` + `src/components/CategoryPage.jsx`).

- **Custom favicon**
  - App favicon is `public/favicon.svg` and is wired in `index.html`.

- **Path aliases**
  - Aliases like `@components/*`, `@contexts/*`, `@data/*`, `@utils/*` are configured in `vite.config.js` and `jsconfig.json`.

## Docs in this repo

- **Styling + design system guide**: `docs/TAILWIND_STYLING_GUIDE.md`
- **Refactoring + learning path**: `docs/REFACTORING_LEARNING_GUIDE.md`

## Things learned

- **Tailwind v4 CSS-first configuration** (`@theme`, `@custom-variant`, layering)
- **Mobile-first responsive layout** with a drawer-style nav
- **Accessible form validation** (`aria-invalid`, `aria-describedby`, `role=\"alert\"`)
- **React Context state management** for app-wide state (username + theme)
- **Persisting preferences** using `localStorage` + syncing `data-theme`
- **Resilient external icons** by deriving favicons from a domain
- **Keeping imports maintainable** using Vite/JSConfig path aliases

## Areas to improve next

- **ESLint config issue**
  - `yarn lint` currently fails with `TypeError: Plugin \"\" not found.` (needs investigation in `eslint.config.js` and dependencies).

- **Sidebar behavior**
  - Consider adding a proper **focus trap** and Escape-to-close behavior for the mobile drawer for stronger accessibility.

- **Favicon caching / fallbacks**
  - Consider caching favicon URLs (or providing a local fallback icon) for cases where external services are unavailable.

- **Testing**
  - Add basic unit/integration tests (e.g. username validation, logout behavior, theme persistence).

## Deployment

### Production build

```bash
yarn build
```

This creates a `dist/` directory with optimized production files.

### Server configuration (MIME types)

If you see **"Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of application/octet-stream"** in production, your server needs to serve `.js` files with the correct MIME type.

**Quick fixes by platform:**

- **Vercel**: `vercel.json` is included (automatically applies headers)
- **Netlify**: `public/_headers` is included (automatically applies headers)
- **Apache**: Copy `public/.htaccess` to your `dist/` directory after build
- **Nginx**: Add to your server config:
  ```nginx
  location ~* \.(js|mjs|jsx)$ {
    add_header Content-Type application/javascript;
  }
  ```
- **Other servers**: Ensure `.js`, `.mjs`, `.jsx` files are served with `Content-Type: application/javascript; charset=utf-8`

### Favicon 404

If the favicon shows a 404:

- Ensure `public/favicon.svg` is copied to `dist/favicon.svg` (Vite does this automatically)
- Verify your server serves files from the root of `dist/`
- Check that `index.html` references `/favicon.svg` (not `favicon.svg` or `./favicon.svg`)
