# Tailwind CSS Styling Guide: Developer Dashboard

**Audience:** Junior frontend engineer  
**Stack:** React, Vite, Tailwind CSS v4  
**Scope:** Design system, theming (light/dark), responsiveness, and accessibility for the developer dashboard

---

## Table of Contents

1. [Step 1: Tailwind CSS setup and entry point](#step-1-tailwind-css-setup-and-entry-point)
2. [Step 2: Custom color system with #7b33cd](#step-2-custom-color-system-with-7b33cd)
3. [Step 3: Dark mode with data-theme](#step-3-dark-mode-with-data-theme)
4. [Step 4: Base styles and design tokens](#step-4-base-styles-and-design-tokens)
5. [Step 5: Responsive breakpoints and strategy](#step-5-responsive-breakpoints-and-strategy)
6. [Step 6: Header](#step-6-header)
7. [Step 7: Sidebar and SideNav](#step-7-sidebar-and-sidenav)
8. [Step 8: Buttons](#step-8-buttons)
9. [Step 9: Inputs (UserNameForm)](#step-9-inputs-usernameform)
10. [Step 10: Resource cards and lists](#step-10-resource-cards-and-lists)
11. [Step 11: Interactive states (hover, focus, active)](#step-11-interactive-states-hover-focus-active)
12. [Step 12: LoadingScreen and polish](#step-12-loadingscreen-and-polish)
13. [Reference: WCAG contrast and design decisions](#reference-wcag-contrast-and-design-decisions)

---

## Step 1: Tailwind CSS setup and entry point

### Why this step

Tailwind is already wired via `@tailwindcss/vite` in `vite.config.js` and `@import "tailwindcss"` in CSS. You need a single place for **theme**, **base**, **component**, and **utility** layers so styling is predictable and maintainable.

### Concepts

- **`@import "tailwindcss"`** — Loads Tailwind and makes utilities like `flex`, `p-4`, `bg-white` available.
- **`@layer`** — Controls order: `base` (resets, HTML elements), `components` (reusable patterns), `utilities` (overrides). Utilities always win.

### What to do

Use **`src/index.css`** as the single Tailwind entry. Remove `@import "tailwindcss"` from `App.css` so it does not load Tailwind twice. If `App.css` would then be empty, delete `App.css` and remove `import './App.css'` from `App.jsx`. Rely on `index.css` (already imported in `main.jsx`) for global styles.

**`src/index.css`** — start with:

```css
@import 'tailwindcss';

/* Step 2–4 will add @theme, @custom-variant, and @layer base here */
```

**Rationale:** One CSS entry keeps the cascade and layer order clear. Tailwind v4 uses a CSS-first config, so `tailwind.config.js` is optional; we do everything in CSS.

---

## Step 2: Custom color system with #7b33cd

### Why this step

#7b33cd is the primary brand color. Raw hex on its own is not enough: we need a small scale (lighter/darker) for backgrounds, borders, and text so we can meet contrast rules and support light and dark themes.

### Concepts

- **`@theme { --color-* }`** — In v4, custom colors live in CSS. Keys like `--color-primary-500` become `bg-primary-500`, `text-primary-500`, etc.
- **Design tokens** — Named values (e.g. `primary-500`) used across the app instead of ad-hoc hex codes.

### Accessibility note

- **#7b33cd on white:** ~4.1:1 for normal text (below 4.5:1). Use it for **large text (≥18px or 14px bold)** or non-text (icons, borders, decorative).
- **#7b33cd on black:** ~3.5:1. In dark mode we need **lighter** shades for text and accents.
- We define darker shades for body text on light backgrounds and lighter shades for dark mode.

### What to do

Add to **`src/index.css`** immediately after `@import "tailwindcss"`:

```css
@theme {
  /* Base: #7b33cd — use for large text, icons, borders, and as base for variants */
  --color-primary-500: #7b33cd;

  /* Darker: body text and buttons on light backgrounds (≥4.5:1 on white) */
  --color-primary-600: #6b2bb8;
  --color-primary-700: #5a2499;

  /* Lighter: accents and buttons on dark backgrounds; better contrast on black */
  --color-primary-400: #9b5dd9;
  --color-primary-300: #b57de8;

  /* Soft backgrounds (hover, subtle highlights) — low chroma to avoid overwhelming text */
  --color-primary-50: #f5eefc;
  --color-primary-100: #ebe0f9;
  --color-primary-950: #2d0f52;
}
```

**Usage examples:** `bg-primary-500`, `text-primary-600`, `bg-primary-50`, `dark:bg-primary-950`, `dark:text-primary-400`.

**Rationale:** A small scale (50, 100, 300, 400, 500, 600, 700, 950) supports backgrounds, text, and interactive states in both themes without inventing hex codes in components.

---

## Step 3: Dark mode with data-theme

### Why this step

The app toggles themes via `data-theme="light"` or `data-theme="dark"` on `<html>`. By default, Tailwind’s `dark:` uses `prefers-color-scheme`. We need `dark:` to follow `[data-theme="dark"]` instead.

### Concepts

- **`@custom-variant dark (...)`** — Redefines when `dark:` utilities apply. We use a selector so that any descendant of `[data-theme="dark"]` gets `dark:` styles.

### What to do

In **`src/index.css`**, after the `@theme` block:

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

**Effect:** `dark:bg-black` applies when `<html data-theme="dark">` (or an ancestor with `data-theme="dark"`) exists. Your existing `document.documentElement.setAttribute("data-theme", theme)` in `App.jsx` will drive this.

**Rationale:** `data-theme` is already in use; aligning Tailwind’s `dark` with it keeps one source of truth and avoids `prefers-color-scheme` when the user has chosen an explicit theme.

---

## Step 4: Base styles and design tokens

### Why this step

We need a stable background and text color for the whole app in light and dark mode, and we should reuse semantic names (e.g. `bg-surface`, `text-body`) instead of raw `white`/`black` everywhere.

### Concepts

- **`@layer base`** — For element-level and `:root` styles. Low specificity so components can override.
- **Semantic tokens** — `--color-surface`, `--color-body` make it clear what a color is for and allow theme-dependent values.

### What to do

In **`src/index.css`**, inside `@layer base`:

```css
@layer base {
  :root {
    --color-surface: #ffffff;
    --color-surface-alt: #fafafa;
    --color-body: #0a0a0a;
    --color-body-muted: #525252;
  }

  [data-theme='dark'] {
    --color-surface: #0a0a0a;
    --color-surface-alt: #171717;
    --color-body: #fafafa;
    --color-body-muted: #a3a3a3;
  }

  html {
    @apply antialiased;
  }

  body {
    background-color: var(--color-surface);
    color: var(--color-body);
  }
}
```

**Usage:** In custom CSS use `var(--color-surface)`; in Tailwind use arbitrary values if needed, e.g. `bg-[var(--color-surface)]`. For most components we will use `bg-white dark:bg-black` and `text-black dark:text-white` as direct tokens until you add more `@theme` mappings; this keeps the guide simple. The `:root` / `[data-theme="dark"]` split shows the pattern for extending tokens later.

**Rationale:** `antialiased` improves text rendering. Centralizing surface and body colors in `:root` / `[data-theme="dark"]` makes theme changes in one place. For this guide, we’ll often use `bg-white dark:bg-black` and `text-black dark:text-white` in components for clarity; you can later replace those with `var(--color-surface)` and `var(--color-body)`.

---

## Step 5: Responsive breakpoints and strategy

### Why this step

The dashboard is used on phones, tablets, and desktops. We need a clear rule for when layout changes and how to apply it with Tailwind so the app stays usable and consistent.

### Concepts

- **Tailwind breakpoints** — `sm:` 640px, `md:` 768px, `lg:` 1024px, `xl:` 1280px, `2xl:` 1536px. The prefix means “at this width **and up**” (e.g. `lg:flex` applies when the viewport is ≥1024px).
- **Mobile-first** — Base styles target the smallest screen; breakpoint prefixes add or override for larger screens. You write `block md:flex` (stack by default, row from `md` up) rather than “desktop first.”
- **`max-*`** — For “up to this width” use `max-lg:`, `max-md:`, etc. (e.g. `max-lg:fixed` for “only when smaller than `lg`”).

### Responsive strategy for this app

| Viewport                    | Sidebar                                                     | Header                                          | Main content           |
| --------------------------- | ----------------------------------------------------------- | ----------------------------------------------- | ---------------------- |
| **&lt; lg (mobile/tablet)** | Hidden by default; overlay drawer opened by a “Menu” button | Sticky; includes Menu button (and theme + time) | Full width             |
| **≥ lg (desktop)**          | Always visible in the layout, left of main                  | Sticky; no Menu button                          | Flexes next to sidebar |

- **`lg` (1024px)** is the cutoff between “mobile layout” (drawer) and “desktop layout” (persistent sidebar).
- **Sidebar:** Below `lg`, it’s a `fixed` overlay that slides in from the left; a backdrop closes it. From `lg` up, it’s `relative` and in the document flow.
- **Header:** A “Menu” button is shown only below `lg` (`lg:hidden`). It toggles the drawer. From `lg` up, the button is hidden.
- **Main:** Full width when the sidebar is in a drawer; when the sidebar is in-flow at `lg`, main shares the row with `flex-1`.
- **Dashboard:** Single column on small screens; `md:grid-cols-2`, `xl:grid-cols-3` for a responsive grid.
- **CategoryPage:** Title and “Back to Dashboard” stack on extra-small; from `sm` up they sit in a row.

### What to do

No code in this step. Steps 6–12 will use `sm:`, `md:`, `lg:`, and `max-lg:` to implement this. When you see a breakpoint prefix, recall: **base = mobile, prefixed = at that width and up** (or `max-*` for “below that width”).

**Rationale:** One shared strategy avoids ad-hoc breakpoints. `lg` at 1024px fits a typical “sidebar always visible” desktop layout while keeping the drawer pattern on smaller screens.

---

## Step 6: Header

### Why this step

The header is high-visibility and contains text, a time, a theme toggle, and on small screens a **Menu** button to open the sidebar. It must stay visible when scrolling, work in both themes, and use semantic markup.

### Concepts

- **Utility classes** — `flex`, `justify-between`, `items-center`, `gap-*`, `p-*` for layout; `text-*`, `bg-*` for color.
- **`dark:`** — Overrides for dark theme. Always pair light and dark when setting background or text.
- **`sticky top-0 z-50`** — Keeps the header at the top when scrolling and above the sidebar drawer (`z-40`) and backdrop (`z-30`).
- **`lg:hidden`** — The Menu button is only shown below `lg`; from `lg` up the sidebar is always visible so the button is hidden.

### What to do

Update **`src/components/Header.jsx`**. It must accept **`onMenuToggle`** and **`sidebarOpen`** (passed from Layout in Step 7) for the Menu button. Keep the existing DOM and behavior for theme and time. Implement Step 7 (Layout) next so those props are provided.

```jsx
<header
  className="sticky top-0 z-50 flex justify-between items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800"
  role="banner"
>
  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
    <button
      type="button"
      onClick={onMenuToggle}
      aria-expanded={sidebarOpen}
      aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      className="shrink-0 p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
    >
      {sidebarOpen ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
    <span className="font-medium text-black dark:text-white truncate">{username}</span>
  </div>

  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
    <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400" aria-hidden="true">
      {formattedTime}
    </span>
    <button
      type="button"
      onClick={onThemeToggle}
      aria-pressed={theme === 'dark'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  </div>
</header>
```

**Tailwind used:** `sticky top-0 z-50`, `gap-2 sm:gap-4`, `p-3 sm:p-4`, `min-w-0`, `truncate`, `shrink-0`, `lg:hidden`, `text-xs sm:text-sm`.

**Rationale:** `sticky top-0 z-50` keeps the header above the drawer and visible on scroll. The Menu button uses `aria-expanded` and `aria-label`; it is `lg:hidden` because the sidebar is persistent from `lg` up. `truncate` and `min-w-0` prevent the username from overflowing on narrow screens. `shrink-0` on the right group keeps the time and theme toggle from shrinking. Hover and focus for the theme toggle are in Step 11.

---

## Step 7: Sidebar and SideNav

### Why this step

The sidebar is the main navigation. It needs a clear background, readable labels, and a distinct “current” state. On smaller screens it becomes an overlay drawer (Step 5); it must close when a link is chosen or the backdrop is clicked.

### Concepts

- **Spacing:** `p-*`, `gap-*` for internal rhythm; `w-*` or `min-w-*` for width.
- **Borders:** `border-r` to separate from main content on desktop.
- **Responsive sidebar:** Below `lg`: `fixed left-0 top-0 z-40 h-full w-64`, `-translate-x-full` when closed and `translate-x-0` when open, `transition-transform` for a slide. From `lg` up: `lg:relative lg:translate-x-0` and `lg:w-56` so it’s in the flow. `pt-16 lg:pt-4` so on mobile the drawer content starts below the sticky header.
- **Backdrop:** When the drawer is open, a `fixed inset-0 z-30 bg-black/50` overlay; `lg:hidden` so it never shows on desktop. Clicking it closes the drawer.
- **State:** Layout owns `sidebarOpen` and `handleSelect(id)` that calls `onSelectCategory(id)` and `setSidebarOpen(false)` so the drawer closes when a nav item is clicked.

### What to do

**`src/components/Layout.jsx`** — add `useState` for `sidebarOpen`, a `handleSelect` wrapper, the backdrop, and responsive sidebar classes. Pass `onMenuToggle`, `sidebarOpen` to `Header` and `handleSelect` to `SideNav`.

```jsx
import { useState } from 'react';
import Header from './Header';
import SideNav from './SideNav';

function Layout({ username, theme, onThemeToggle, categories, activeCategory, onSelectCategory, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelect = (id) => {
    onSelectCategory(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Header
        username={username}
        theme={theme}
        onThemeToggle={onThemeToggle}
        onMenuToggle={() => setSidebarOpen((s) => !s)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <aside
          className={`
            fixed left-0 top-0 z-40 h-full w-64 pt-16
            border-r border-neutral-200 dark:border-neutral-800
            bg-neutral-50 dark:bg-neutral-950
            transform transition-transform duration-200 ease-out
            lg:relative lg:left-auto lg:top-auto lg:z-auto lg:h-auto lg:w-56 lg:min-w-[14rem] lg:pt-4 lg:shrink-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          aria-label="Sidebar"
        >
          <SideNav categories={categories} activeCategory={activeCategory} onSelectCategory={handleSelect} />
        </aside>
        <main className="flex-1 min-w-0 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
```

**`src/components/SideNav.jsx`** — list and buttons (unchanged; it receives `onSelectCategory` which is now `handleSelect` so the drawer closes on click):

```jsx
<nav className="p-4" aria-label="Resource categories">
  <ul className="flex flex-col gap-1">
    <li>
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={`
          w-full text-left px-3 py-2 rounded-md text-sm font-medium
          transition-colors
          ${
            activeCategory === null
              ? 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
          }
        `}
        aria-current={activeCategory === null ? 'page' : undefined}
      >
        Dashboard
      </button>
    </li>
    {categories.map((id) => (
      <li key={id}>
        <button
          type="button"
          onClick={() => onSelectCategory(id)}
          className={`
            w-full text-left px-3 py-2 rounded-md text-sm font-medium
            transition-colors
            ${
              activeCategory === id
                ? 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }
          `}
          aria-current={activeCategory === id ? 'page' : undefined}
        >
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </button>
      </li>
    ))}
  </ul>
</nav>
```

**Rationale:** `neutral-50`/`neutral-950` give a subtle difference from the main `white`/`black` surface. Active state uses primary tints so the current page is obvious. `transition-colors` prepares for hover/focus. `aria-current="page"` marks the current item for assistive tech. Hover and focus will be completed in Step 11. The drawer closes on nav click via `handleSelect`; the backdrop’s `lg:hidden` ensures it never appears on desktop. Optional: close on Escape (keydown on `document`) or when `matchMedia('(min-width: 1024px)')` becomes true to avoid a stuck drawer after resize.

---

## Step 8: Buttons

### Why this step

Buttons appear in Header (theme toggle), SideNav (navigation), ResourcePreview (“View more”), CategoryPage (“Back to Dashboard”), and UserNameForm (“Continue”). A consistent pattern reduces decisions and keeps contrast and hit areas predictable.

### Concepts

- **Button roles:**
  - **Primary:** main actions (Continue, View more). Strong fill, high contrast.
  - **Secondary:** lower emphasis (Back to Dashboard, theme toggle, nav items). Outlined or tinted.
- **Hit area:** Min height ~44px (or padding that achieves it) helps touch and pointer. `py-2` + `text-sm` is a minimum; “View more” and “Continue” can use `py-2.5` or `px-4`.

### What to do

Do **not** create a shared `<Button>` component; apply the same utility pattern in each place. Two patterns:

**Primary (e.g. “Continue”, “View more”):**

```txt
bg-primary-500 dark:bg-primary-500
text-white
px-4 py-2.5 rounded-md text-sm font-medium
border border-primary-600 dark:border-primary-400
```

**Why:** #7b33cd meets 4.5:1 with white text. We keep `primary-500` in dark mode and rely on white text; border uses 600 (light) or 400 (dark) for a slight edge.

**Secondary (e.g. “Back to Dashboard”, theme toggle, nav):**

Use the same pattern as the Header theme button and SideNav: tinted background (`primary-100` / `primary-950`), contrasting text (`primary-700` / `primary-300`), and a border. Navigation and toggle are already done; apply the secondary pattern to “Back to Dashboard” and “View more” if you want them secondary, or use primary for “View more” and “Continue” and secondary for “Back to Dashboard”.

**Example — primary “View more” and “Continue”:**

```jsx
<button
  type="button"
  className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-500 text-white border border-primary-600 dark:border-primary-400"
>
  View more
</button>
```

```jsx
<button
  type="submit"
  className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-500 text-white border border-primary-600 dark:border-primary-400"
>
  Continue
</button>
```

**Example — secondary “Back to Dashboard”:**

```jsx
<button
  type="button"
  className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
  onClick={onBack}
>
  Back to Dashboard
</button>
```

**Rationale:** One primary and one secondary pattern is enough for this app. Focus and hover will be added in Step 10.

---

## Step 9: Inputs (UserNameForm)

### Why this step

The username input must be clearly visible, have a visible focus style, and work in both themes. The label must be associated and the field must look like an input.

### Concepts

- **`label` + `htmlFor` / `id`** — Keeps label and input programmatically linked; clicking the label focuses the input.
- **`rounded-md` + `border`** — Define the input shape and edge; we use `ring` for focus (Step 10).
- **Placeholder contrast:** Placeholders can be lower contrast; we use `neutral-400`/`neutral-500` so they’re visible but de‑emphasized.

### What to do

Update **`src/components/UserNameForm.jsx`** (only the JSX; keep state and submit logic):

```jsx
<div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white dark:bg-black">
  <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
    <label htmlFor="username" className="block text-sm font-medium text-black dark:text-white">
      Your username
    </label>
    <input
      id="username"
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Enter your username"
      autoFocus
      className="w-full px-3 py-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
      aria-invalid={false}
      aria-describedby={undefined}
    />
    <button
      type="submit"
      className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-500 text-white border border-primary-600 dark:border-primary-400"
    >
      Continue
    </button>
  </form>
</div>
```

**Rationale:** `max-w-sm` keeps the form from stretching on large screens. `p-4 sm:p-6` reduces padding on small viewports. `gap-4` spaces label, input, and button. Input uses `border-neutral-300`/`neutral-700` so it’s visible in both themes; `bg-white`/`dark:bg-neutral-950` avoids pure black for a slight relief. You can later add `aria-invalid` and `aria-describedby` when you add validation. Focus ring is added in Step 10.

---

## Step 10: Resource cards and lists

### Why this step

ResourcePreview and CategoryPage show lists of links and descriptions. Cards need a clear surface, readable text, and links that are obviously interactive and meet contrast requirements.

### Concepts

- **Cards:** `border`, `rounded-lg`, `p-*`, and a different background from the page (`bg-white`/`dark:bg-neutral-950` or `neutral-50`/`neutral-900`) so they read as a group.
- **Responsive grid:** `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3` for Dashboard; `flex flex-col sm:flex-row` for the CategoryPage title row so the “Back to Dashboard” button stacks on small screens.
- **Links:** `text-primary-600 dark:text-primary-400` for url color (≥4.5:1 on our surfaces when using 600/400). Underline on focus or hover is optional; we use underline for clarity.
- **Descriptions:** `text-neutral-600 dark:text-neutral-400` for secondary text.

### What to do

**`src/components/ResourcePreview.jsx`:**

```jsx
<section
  className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 sm:p-5"
  aria-labelledby={`heading-${categoryId}`}
>
  <h2 id={`heading-${categoryId}`} className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3">
    {title}
  </h2>
  <ul className="flex flex-col gap-2 mb-4">
    {preview.map((item) => (
      <li key={item.id} className="flex flex-col gap-0.5">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-400 font-medium underline underline-offset-2"
        >
          {item.name}
        </a>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
      </li>
    ))}
  </ul>
  <button
    type="button"
    onClick={() => onViewMore(categoryId)}
    className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-500 text-white border border-primary-600 dark:border-primary-400"
  >
    View more
  </button>
</section>
```

**`src/components/Dashboard.jsx`** — responsive grid: 1 column on mobile, 2 from `md`, 3 from `xl`.

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
  {categories.map((categoryId) => (
    <ResourcePreview
      key={categoryId}
      categoryId={categoryId}
      title={categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
      items={devResources[categoryId]}
      onViewMore={onViewMore}
    />
  ))}
</div>
```

**`src/components/CategoryPage.jsx`:**

```jsx
<div className="flex flex-col gap-4">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
    <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white">{title}</h2>
    <button
      type="button"
      onClick={onBack}
      className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
    >
      Back to Dashboard
    </button>
  </div>
  <ul className="flex flex-col gap-3">
    {items.map((item) => (
      <li
        key={item.id}
        className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 sm:p-5"
      >
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-400 font-medium underline underline-offset-2"
        >
          {item.name}
        </a>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
      </li>
    ))}
  </ul>
</div>
```

**Rationale:** Cards use `rounded-lg`, `border`, and `p-4` for consistency. Links use primary-600/400 and underline so they’re identifiable and meet contrast on our surfaces. Descriptions use muted grays. `rel="noopener noreferrer"` is required for `target="_blank"`.

---

## Step 11: Interactive states (hover, focus, active)

### Why this step

Hover and focus provide feedback and are required for accessibility. Focus must be clearly visible (visible focus ring) and not removed. Active can be subtle.

### Concepts

- **`hover:`** — Styles when the pointer is over the element. Use for buttons, links, nav items.
- **`focus:` and `focus-visible:`** — `focus` applies on any focus (including click); `focus-visible` usually only when focusing via keyboard. Prefer `focus-visible:` for ring so we don’t show a ring on mouse click. If `focus-visible:` is unavailable, use `focus:` and accept a ring on click.
- **`outline` and `ring`** — `outline` is the classic focus indicator. `ring-2 ring-offset-2` gives a visible, offset ring. `ring-primary-500` ties to the brand; `ring-offset-white`/`ring-offset-black` keeps the ring visible on our backgrounds.
- **`active:`** — Optional; a slight scale or darker background is enough. Prefer not to reduce contrast.

### What to do

Add these classes **in addition to** the existing styles (do not remove base styles).

**Buttons (primary and secondary):**

- Hover:
  - Primary: `hover:bg-primary-600 dark:hover:bg-primary-400` (slightly darker/lighter).
  - Secondary: already covered in SideNav/Header with `hover:bg-neutral-100 dark:hover:bg-neutral-900` or equivalent.
- Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black`
- Active (optional): `active:opacity-90` or a darker `active:bg-*` for primary.

**Links (ResourcePreview, CategoryPage):**

- Hover: `hover:text-primary-700 dark:hover:text-primary-300` (or keep underline and add `hover:underline` if you ever remove default underline).
- Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black`

**Input (UserNameForm):**

- Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black`
- Optionally: `focus-visible:border-primary-500` to reinforce.

**SideNav buttons (inactive):**

- Hover: already `hover:bg-neutral-100 dark:hover:bg-neutral-900`.
- Focus: add the same `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2`; use `ring-offset` to match the sidebar background (e.g. `ring-offset-neutral-50 dark:ring-offset-neutral-950` if the sidebar is `neutral-50`/`neutral-950`).

**Header theme toggle:** same focus-visible ring pattern as other buttons.

**Rationale:** `focus-visible` reduces unnecessary focus rings for mouse users while keeping them for keyboard. `ring-2` and `ring-offset-2` meet WCAG 2.4.7 (Focus Visible). `outline-none` is only used when we replace it with a ring; never remove focus indication entirely.

---

## Step 12: LoadingScreen and polish

### Why this step

The loading screen is shown before the app is ready. It should support both themes and be readable. It doesn’t receive a `theme` prop; we can use `dark:` because `data-theme` is set on load from state—however, on first load, `data-theme` may not be "dark" yet. For robustness, either: (a) assume initial theme is light and style only for light, or (b) read `data-theme`/`class` from `document.documentElement` in a `useEffect` and set `data-theme` before first paint if you persist theme. For this guide, we use `dark:` so that if the user has previously chosen dark and you later restore it before React mounts, it will look correct.

### Concepts

- **`fixed inset-0`** — Covers the viewport; `z-50` keeps it above layout.
- **`animate-spin`** — Built-in Tailwind animation for the loader.
- **`sr-only`** — Visually hidden, read by screen readers. We keep “Loading...” in `sr-only` and a visible “Loading” for sighted users, or one message for both.

### What to do

Update **`src/components/LoadingScreen.jsx`**:

```jsx
<div
  className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black"
  data-testid="loading-screen"
  role="status"
  aria-label="Loading"
>
  <svg
    className="h-16 w-16 mb-4 animate-spin text-primary-500"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="8"
      strokeDasharray="150"
      strokeDashoffset="80"
    />
  </svg>
  <span className="text-base sm:text-lg font-medium text-black dark:text-white">Loading</span>
  <span className="sr-only">Loading…</span>
</div>
```

**Changes:** `bg-white dark:bg-black` and `text-black dark:text-white` for theming. `text-primary-500` on the SVG so the spinner uses the brand color. `text-base sm:text-lg` scales the “Loading” label for readability on small screens. `strokeWidth="8"` makes the arc easier to see; you can tune `strokeDasharray`/`strokeDashoffset` for the desired gap. `aria-hidden="true"` on the decorative SVG; `role="status"` and `aria-label="Loading"` with `sr-only` “Loading…” keep screen reader feedback.

**Rationale:** LoadingScreen stays minimal and theme-aware. If you don’t persist theme before first paint, the first frame may be light; that’s acceptable for this guide.

---

## Reference: WCAG contrast and design decisions

### Contrast requirements (WCAG 2.1)

- **Normal text (&lt; 18px or &lt; 14px bold):** ≥ 4.5:1.
- **Large text (≥ 18px or ≥ 14px bold):** ≥ 3:1.
- **UI components and graphics:** ≥ 3:1.

### Choices made in this guide

| Decision                                                                  | Reason                                                                          |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| #7b33cd as `primary-500` for buttons with **white text**                  | White on #7b33cd meets 4.5:1; safe for buttons and UI.                          |
| `primary-600` / `primary-700` for **text on light**                       | #7b33cd on white is &lt; 4.5:1; darker shades used for body text on white.      |
| `primary-400` / `primary-300` for **text and accents on dark**            | Lighter shades on black meet 4.5:1; used for link and button text in dark mode. |
| `primary-100` / `primary-950` for **secondary buttons and nav active**    | Tinted backgrounds; text uses 700/300 so contrast stays high.                   |
| `neutral-400` / `neutral-500` for **placeholders**                        | De‑emphasized but still readable; ≥ 3:1 on our surfaces.                        |
| `neutral-600` / `neutral-400` for **descriptions**                        | Muted; ≥ 4.5:1 on white and black.                                              |
| `ring-2` + `ring-offset-2` for **focus**                                  | Meets 2.4.7 (Focus Visible) and is clearly different from the rest of the UI.   |
| `underline` on **links**                                                  | Makes links identifiable without relying only on color.                         |
| **Responsive:** `lg` (1024px) for sidebar drawer vs in-flow               | Single breakpoint for “desktop” layout; below `lg` the sidebar is an overlay.   |
| **Responsive:** `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` for Dashboard | 1 col on mobile, 2 on tablet, 3 on desktop.                                     |
| **Responsive:** `p-4 sm:p-6`, `text-base sm:text-lg`                      | Tighter padding and smaller type on small viewports.                            |

### Semantic HTML and ARIA

- `<header role="banner">`, `<main>`, `<aside>`, `<nav aria-label="...">` for structure and landmarks.
- `aria-label` on icon-only or short-label buttons (e.g. theme toggle).
- `aria-pressed` on the theme toggle.
- `aria-current="page"` on the active nav item.
- `aria-labelledby` / `id` on sections and headings.
- `aria-invalid` and `aria-describedby` on inputs when you add validation.

### Files to touch (summary)

| File                                 | Purpose                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| `src/index.css`                      | `@import "tailwindcss"`, `@theme`, `@custom-variant dark`, `@layer base`           |
| `src/App.css`                        | Remove `@import "tailwindcss"` or delete if unused                                 |
| `src/components/Header.jsx`          | Layout, colors, theme toggle, Menu button (`lg:hidden`), `aria-label`, `sticky`    |
| `src/components/Layout.jsx`          | Page layout, sidebar drawer (responsive), backdrop, `sidebarOpen` state            |
| `src/components/SideNav.jsx`         | List, nav buttons, active and inactive styles                                      |
| `src/components/UserNameForm.jsx`    | Form layout, label, input, primary submit button, `p-4 sm:p-6`                     |
| `src/components/ResourcePreview.jsx` | Card, headings, links, descriptions, “View more” button                            |
| `src/components/Dashboard.jsx`       | Responsive grid (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`) for ResourcePreviews |
| `src/components/CategoryPage.jsx`    | Title, “Back to Dashboard”, list of resource cards                                 |
| `src/components/LoadingScreen.jsx`   | Themed background/text, primary-colored spinner, `text-base sm:text-lg`, `sr-only` |

---

_End of guide. Implement in order; each step builds on the previous. Prefer the design tokens and patterns above over one-off values so the system stays consistent and easier to change later._
