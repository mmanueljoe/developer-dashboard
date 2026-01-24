# Developer Resources Dashboard — Step-by-Step Implementation Guide

**Format:** Practical skills assessment.  
**Audience:** Junior frontend engineer in training (HTML, CSS, JS; new to React).  
**Goal:** Hands-on learning and discipline. Implement each step in order; do not skip ahead.

---

## Prerequisites

Before starting, ensure you have:

- A Vite + React project (e.g. `npm create vite@latest my-app -- --template react`).
- A `src/devResources.json` file whose structure is an object: keys are category IDs (e.g. `"learning"`, `"tools"`, `"frameworks"`), and each value is an array of resource objects with `id`, `name`, `url`, `description`, and `icon`.

Example shape:

```json
{
  "learning": [{ "id": "1", "name": "React", "url": "https://react.dev/", "description": "...", "icon": "https://..." }],
  "tools": [...]
}
```

If your `devResources.json` uses different keys (e.g. `descrittion`), fix the JSON so the property is `description` everywhere. Your React code will use `item.description`.

---

## Step 1: Data shape and root render

### Why this step

The app is driven by `devResources`. We need to import it, understand its shape, and confirm the root component renders. This avoids “mystery data” bugs later.

### What to implement

1. In `App.jsx`: import `devResources` from `./devResources.json`.
2. Derive a list of **category IDs** with `Object.keys(devResources)`.
3. Render a simple UI that proves the app runs and the data is wired: e.g. a heading and the count of categories.

**Terminology:**

- **Component:** A function that returns JSX. `App` is the root component.
- **JSX:** The HTML-like syntax in React. Always return a single parent element (a `div`, `section`, or React Fragment `<>...</>`).

### Code

**`src/App.jsx`**

```jsx
import devResources from './devResources.json';
import './App.css';

function App() {
  const categories = Object.keys(devResources);

  return (
    <div className="app">
      <h1>Developer Resources</h1>
      <p>Categories: {categories.length}</p>
    </div>
  );
}

export default App;
```

### Checkpoint

Run the app. You should see “Developer Resources” and the number of categories. If your JSON has 8 keys, you should see `8`.

### Common mistake

Importing `devResources` but never using it, or using `Object.values(devResources)` when you need the **keys** (category IDs) for nav and “view more” targets. Category IDs come from `Object.keys(devResources)`.

---

## Step 2: Loading state and `LoadingScreen`

### Why this step

The product requires a loading indicator when the app initializes. We need **state** to remember “are we still loading?” and **conditional rendering** to show either the loading UI or the rest of the app.

**Terminology:**

- **State:** Data that can change over time. React keeps it and re-renders when it changes. Create it with `useState(initialValue)`.
- **`useEffect`:** Runs **side effects** (e.g. timers, fetching, touching the DOM) after render. We use it to simulate “app is ready after a short delay.”
- **Conditional rendering:** `{condition ? <A /> : <B />}` or `{condition && <A />}` so we show different UI depending on state.

### What to implement

1. **State:** `isLoading` in `App`, initialized to `true`.
2. **Effect:** In `useEffect`, after a delay (e.g. 1–2 seconds), set `isLoading` to `false`. The dependency array should be `[]` so it runs once on mount.
3. **`LoadingScreen` component:** A presentational component that shows a loading message or spinner. It accepts no props.
4. **Conditional render in `App`:** If `isLoading` is `true`, return `<LoadingScreen />` and nothing else. Otherwise, return the `div` you built in Step 1.

### Code

**`src/components/LoadingScreen.jsx`** (create the `components` folder if it does not exist)

```jsx
function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading">
      <p>Loading...</p>
    </div>
  );
}

export default LoadingScreen;
```

**`src/App.jsx`**

```jsx
import { useState, useEffect } from 'react';
import devResources from './devResources.json';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const categories = Object.keys(devResources);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <h1>Developer Resources</h1>
      <p>Categories: {categories.length}</p>
    </div>
  );
}

export default App;
```

### Checkpoint

On load, you see “Loading…” for about 1.5 seconds, then the categories count.

### Common mistakes

- Forgetting to **clean up** the timer: `return () => clearTimeout(timer)` in `useEffect`. Without it, if the component unmounts before the timer fires, you can cause a state update on an unmounted component.
- Using `setTimeout` without `useEffect`: the delay would run on every render. Side effects belong in `useEffect`.
- Putting `isLoading` in `LoadingScreen`: the parent (`App`) must decide _when_ to show it, so `App` owns `isLoading`.

### Future overhead

Later, the delay will be replaced by real initialization (e.g. fetching user, config). The same pattern applies: set `isLoading` to `false` when init is done. If you add more async steps, you may introduce an `error` state and show an error UI when init fails.

---

## Step 3: Username gate and `UsernameForm`

### Why this step

We must collect the developer’s username before showing the main dashboard. That implies a **gate:** we show a form until we have a non‑empty username, then we show the main app.

**Terminology:**

- **Props:** Values (and functions) passed _from parent to child_. The child must not change them; they are read‑only.
- **Callback prop:** A function passed as a prop (e.g. `onSubmit`) so the child can _report_ an action to the parent. The parent owns the meaning (e.g. “save username”).
- **Controlled input:** The input’s `value` comes from state and `onChange` updates that state. The component owns the string in the input; the parent owns the “submitted” username.

### What to implement

1. **State in `App`:** `username`, initialized to `''` or `null`. We will treat “no username” as “show the form.”
2. **`UsernameForm` component:**
   - Props: `onSubmit` (function). When the user submits, call `onSubmit` with the current input value.
   - Local state: one `useState` for the input value (e.g. `inputValue`). This is _not_ the same as `username` in `App`; it’s only the text in the field.
   - A `<form>` with `onSubmit`. In the handler: `event.preventDefault()`, then `onSubmit(inputValue)`.
   - Optionally clear `inputValue` after submit, or leave it; the form will disappear once `username` is set.
3. **Conditional render in `App`:** When `!username` (and we are not loading), return `<UsernameForm onSubmit={...} />`. The callback should call `setUsername` with the value.

### Code

**`src/components/UsernameForm.jsx`**

```jsx
import { useState } from 'react';

function UsernameForm({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  }

  return (
    <div className="username-gate">
      <h2>Welcome</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Your username</label>
        <input
          id="username"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your username"
          autoFocus
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default UsernameForm;
```

**`src/App.jsx`** (add `username` and the gate; keep loading first)

```jsx
import { useState, useEffect } from 'react';
import devResources from './devResources.json';
import LoadingScreen from './components/LoadingScreen';
import UsernameForm from './components/UsernameForm';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const categories = Object.keys(devResources);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (!username) return <UsernameForm onSubmit={setUsername} />;

  return (
    <div className="app">
      <h1>Developer Resources</h1>
      <p>Categories: {categories.length}</p>
    </div>
  );
}

export default App;
```

### Checkpoint

After loading, you see the username form. Submitting a non‑empty value shows the categories count. Reload to see the flow again (we are not persisting yet).

### Common mistakes

- **Storing `username` in `UsernameForm`:** Then `App` and `Header` (later) cannot use it. The parent that needs it for branching and display must own it; the form only notifies via `onSubmit`.
- **Forgetting `e.preventDefault()` in `handleSubmit`:** The form would do a full-page POST.
- **Not trimming:** `'  '` would be accepted as a username. `trim` before `onSubmit` is a good habit.

---

## Step 4: App as orchestrator — order of conditions

### Why this step

We now have two gates (loading, username) and a main view. The **order** of the conditionals defines the user’s path. We make that order explicit and avoid showing the username form while “still loading.”

### What to implement

Nothing new. In `App`, enforce this order:

1. If `isLoading` → `return <LoadingScreen />`
2. Else if `!username` → `return <UsernameForm onSubmit={setUsername} />`
3. Else → `return` the main layout (for now, the simple `div` with the heading and categories count; we will replace this with `Layout` and real content in the next steps).

### Code

Your `App` should already look like this. If not, align it:

```jsx
if (isLoading) return <LoadingScreen />;
if (!username) return <UsernameForm onSubmit={setUsername} />;

return (
  <div className="app">
    <h1>Developer Resources</h1>
    <p>Categories: {categories.length}</p>
  </div>
);
```

### Common mistake

Putting `!username` before `isLoading` would show the username form during the loading phase. Always resolve loading first.

---

## Step 5: Header with username and theme toggle

### Why this step

The header must display the username and a theme toggle. The **theme** affects the whole app, so it must live in a common ancestor—`App`. The header only _displays_ the current theme and _reports_ a toggle; it does not own the theme.

**Terminology:**

- **Lifting state up:** When several components need to read or change the same data, put that data (and the setter) in their **lowest common ancestor** and pass it down via props. Here, `App` is that ancestor for `username` and `theme`.
- **Side effect for DOM/global state:** Applying `data-theme` to the document is a side effect. Do it in `useEffect` that depends on `theme`, not during render.

### What to implement

1. **State in `App`:** `theme`, e.g. `'light' | 'dark'`, initial value `'light'`.
2. **`useEffect` in `App`:** When `theme` changes, set `document.documentElement.setAttribute('data-theme', theme)`. Dependency array: `[theme]`. This lets CSS use `[data-theme="dark"] { ... }`.
3. **`Header` component:**
   - Props: `username`, `theme`, `onThemeToggle`.
   - Render: show `username` and a button (or control) that calls `onThemeToggle()` when clicked.
   - Do **not** call `setTheme` inside `Header`; the parent provides the setter via `onThemeToggle`.
4. **Wire in `App`:** In the main branch (after the two gates), render `<Header username={username} theme={theme} onThemeToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />` above the rest of the main content.

For now, keep the “rest” as the simple `div` from Step 4; we will wrap it in `Layout` in Step 6.

### Code

**`src/components/Header.jsx`**

```jsx
function Header({ username, theme, onThemeToggle }) {
  return (
    <header className="header">
      <h1>Developer Resources</h1>
      <span className="header-username">{username}</span>
      <button type="button" onClick={onThemeToggle} aria-pressed={theme === 'dark'}>
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>
    </header>
  );
}

export default Header;
```

**`src/App.jsx`** (add `theme`, `useEffect` for `data-theme`, and `Header` in the main branch)

```jsx
import { useState, useEffect } from 'react';
import devResources from './devResources.json';
import LoadingScreen from './components/LoadingScreen';
import UsernameForm from './components/UsernameForm';
import Header from './components/Header';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('light');
  const categories = Object.keys(devResources);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isLoading) return <LoadingScreen />;
  if (!username) return <UsernameForm onSubmit={setUsername} />;

  function handleThemeToggle() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <div className="app">
      <Header username={username} theme={theme} onThemeToggle={handleThemeToggle} />
      <h2>Categories: {categories.length}</h2>
    </div>
  );
}

export default App;
```

### Checkpoint

After passing the username gate, you see the header with your name and a theme button. Clicking it toggles `data-theme` on `<html>`. Add a few CSS rules for `[data-theme="dark"]` to confirm (e.g. dark background).

### Common mistake

Owning `theme` in `Header` and only applying it there: the rest of the app would not know the theme. The toggle would change local state but not the document. Keep `theme` in `App` and pass `onThemeToggle` so `App` updates it and the `useEffect` applies it.

---

## Step 6: Layout and `SideNav` shell

### Why this step

We need a **layout:** header, sidebar, and main area. We introduce the structure and a placeholder `SideNav` so that in the next step we can fill the sidebar with real categories without changing the layout.

### What to implement

1. **`Layout` component:**
   - Props: `username`, `theme`, `onThemeToggle`, and `children` (the main content).
   - Structure:
     - A full‑width `Header` (reuse the one from Step 5).
     - A wrapper (e.g. `div` with flex or grid) containing:
       - `<aside>` with `SideNav` inside (for now, a placeholder: e.g. “Nav” or a single “Dashboard” link).
       - `<main>` that renders `{children}`.
2. **`SideNav` component (placeholder):** Renders a simple list or a single “Dashboard” item. No props required for now.
3. **`App`:** In the main branch, replace the `div` with:

   ```jsx
   <Layout username={username} theme={theme} onThemeToggle={handleThemeToggle}>
     <p>Main content placeholder</p>
   </Layout>
   ```

### Code

**`src/components/Layout.jsx`**

```jsx
import Header from './Header';
import SideNav from './SideNav';

function Layout({ username, theme, onThemeToggle, children }) {
  return (
    <div className="layout">
      <Header username={username} theme={theme} onThemeToggle={onThemeToggle} />
      <div className="layout-body">
        <aside className="sidebar">
          <SideNav />
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
```

**`src/components/SideNav.jsx`** (placeholder)

```jsx
function SideNav() {
  return (
    <nav className="side-nav" aria-label="Resource categories">
      <ul>
        <li>Dashboard</li>
      </ul>
    </nav>
  );
}

export default SideNav;
```

**`src/App.jsx`** (use `Layout` and pass `children`)

```jsx
// ... state, effects, gates ...

return (
  <Layout username={username} theme={theme} onThemeToggle={handleThemeToggle}>
    <p>Main content placeholder</p>
  </Layout>
);
```

### Checkpoint

You see: Header, a sidebar with “Dashboard,” and a main area with “Main content placeholder.” Layout and styling (flex/grid) are up to you; ensure the main area expands correctly.

---

## Step 7: `SideNav` with categories and selection

### Why this step

The sidebar must list resource categories and reflect the **selected** one. The selected category will later drive whether we show the **dashboard** (all previews) or a **category page** (full list for one category). The parent that needs to switch main content must own that selection.

**Terminology:**

- **`activeCategory`:** `null` means “dashboard” (all previews); a string (e.g. `'learning'`) means “show the category page for that id.”

### What to implement

1. **State in `App`:** `activeCategory`, initial value `null`. `null` = dashboard view; string = category page.
2. **`Layout`:** Accept `categories`, `activeCategory`, and `onSelectCategory`. Pass them into `SideNav`. `Layout` continues to render `{children}` in `<main>`; the _content_ of `children` will change in Step 9 based on `activeCategory`, but `App` will compose that.
3. **`SideNav`:**
   - Props: `categories` (array of category IDs), `activeCategory` (`null | string`), `onSelectCategory(id)`.
   - Render a “Dashboard” (or “Home”) item that calls `onSelectCategory(null)` when clicked.
   - Map over `categories` and, for each `id`, render a clickable item that calls `onSelectCategory(id)`.
   - Use `className` or `aria-current` to mark the active item (when `activeCategory === id`, or “Dashboard” when `activeCategory === null`).
4. **`App`:**
   - Pass `categories`, `activeCategory`, and `onSelectCategory={(id) => setActiveCategory(id)}` into `Layout`.
   - For now, keep `children` as the placeholder; we will replace it in Step 8 and 9.

### Code

**`src/components/SideNav.jsx`**

```jsx
function SideNav({ categories, activeCategory, onSelectCategory }) {
  return (
    <nav className="side-nav" aria-label="Resource categories">
      <ul>
        <li>
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={activeCategory === null ? 'active' : ''}
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
              className={activeCategory === id ? 'active' : ''}
              aria-current={activeCategory === id ? 'page' : undefined}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SideNav;
```

**`src/components/Layout.jsx`**

```jsx
import Header from './Header';
import SideNav from './SideNav';

function Layout({ username, theme, onThemeToggle, categories, activeCategory, onSelectCategory, children }) {
  return (
    <div className="layout">
      <Header username={username} theme={theme} onThemeToggle={onThemeToggle} />
      <div className="layout-body">
        <aside className="sidebar">
          <SideNav categories={categories} activeCategory={activeCategory} onSelectCategory={onSelectCategory} />
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
```

**`src/App.jsx`** (add `activeCategory` and pass the new props)

```jsx
const [activeCategory, setActiveCategory] = useState(null);

// ... in the main return:
return (
  <Layout
    username={username}
    theme={theme}
    onThemeToggle={handleThemeToggle}
    categories={categories}
    activeCategory={activeCategory}
    onSelectCategory={setActiveCategory}
  >
    <p>Main content placeholder</p>
  </Layout>
);
```

### Checkpoint

Clicking “Dashboard” or a category updates the active state (you can add a temporary `{String(activeCategory)}` in the main area to verify). The active item is visually distinct. We are not yet changing the main content; that is Step 8 and 9.

### Common mistake

Putting `activeCategory` in `SideNav`: then the parent and the main content cannot know the selection. The component that decides what to render in `<main>` (here, `App`) must own it.

---

## Step 8: Dashboard and `ResourcePreview` with “View more”

### Why this step

The main dashboard shows **previews** per category and a “View more” link for each. A preview shows a small slice of resources (e.g. first 3). “View more” should switch the main area to that category’s full page; we will implement that switch in Step 9.

**Terminology:**

- **Presentational component:** A component that receives data and callbacks via props and focuses on rendering. `ResourcePreview` is presentational; it does not fetch or own the list.

### What to implement

1. **Constant:** e.g. `PREVIEW_LIMIT = 3`. Use it when slicing the list for a preview.
2. **`ResourcePreview` component:**
   - Props: `categoryId`, `title` (human‑readable, e.g. “Learning”), `items` (full array for that category), `onViewMore`.
   - Use `items.slice(0, PREVIEW_LIMIT)` to show only the first few.
   - For each item: show `name`, `description` (or a short version), and a link to `url` (and `icon` if you like).
   - A “View more” link or button that calls `onViewMore(categoryId)` when clicked.
3. **`Dashboard` component:**
   - Props: `devResources` (or `categories` + a way to get `devResources[categoryId]`), `onViewMore`.
   - Map over `categories` and, for each, render `ResourcePreview` with:
     - `categoryId`,
     - `title` (e.g. `id.charAt(0).toUpperCase() + id.slice(1)`),
     - `items={devResources[categoryId]}` (or equivalent),
     - `onViewMore`.
4. **`App`:** In the main branch, when `activeCategory === null`, pass `<Dashboard devResources={devResources} onViewMore={(id) => setActiveCategory(id)} />` as the `children` of `Layout`. When `activeCategory` is non‑null, we will show a category page in Step 9; for now you can keep a placeholder for the non‑null case so the app runs.

### Code

**`src/components/ResourcePreview.jsx`**

```jsx
const PREVIEW_LIMIT = 3;

function ResourcePreview({ categoryId, title, items, onViewMore }) {
  const preview = items.slice(0, PREVIEW_LIMIT);

  return (
    <section className="resource-preview" aria-labelledby={`heading-${categoryId}`}>
      <h2 id={`heading-${categoryId}`}>{title}</h2>
      <ul>
        {preview.map((item) => (
          <li key={item.id}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.name}
            </a>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onViewMore(categoryId)}>
        View more
      </button>
    </section>
  );
}

export default ResourcePreview;
```

**`src/components/Dashboard.jsx`**

```jsx
import ResourcePreview from './ResourcePreview';

function Dashboard({ devResources, onViewMore }) {
  const categories = Object.keys(devResources);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
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
  );
}

export default Dashboard;
```

**`src/App.jsx`** (render `Dashboard` when `activeCategory` is `null`; for non‑null, use a placeholder until Step 9)

```jsx
import Dashboard from './components/Dashboard';

// ... in the main return, replace `children`:

return (
  <Layout
    username={username}
    theme={theme}
    onThemeToggle={handleThemeToggle}
    categories={categories}
    activeCategory={activeCategory}
    onSelectCategory={setActiveCategory}
  >
    {activeCategory === null ? (
      <Dashboard devResources={devResources} onViewMore={(id) => setActiveCategory(id)} />
    ) : (
      <p>Category: {activeCategory} (Step 9)</p>
    )}
  </Layout>
);
```

### Checkpoint

On the dashboard you see one `ResourcePreview` block per category, each with up to 3 items and a “View more” button. Clicking “View more” sets `activeCategory`, so the main area shows the placeholder “Category: … (Step 9)”. The sidebar should already show the correct active state if you also click a category in `SideNav` (from Step 7).

### Common mistake

Defining `onViewMore` inside the `map` callback without passing `categoryId`: e.g. `onClick={() => onViewMore()}`. The handler must receive the category: `onClick={() => onViewMore(categoryId)}`.

---

## Step 9: Category page (“view more” destination)

### Why this step

“View more” and a sidebar category click must lead to a **category page** that lists all resources for that category. We do not use a router; we swap the main content by rendering `CategoryPage` when `activeCategory` is non‑null.

### What to implement

1. **`CategoryPage` component:**
   - Props: `categoryId`, `items` (the array for that category), `onBack` (optional; we can rely on “Dashboard” in the nav to go back).
   - Render a heading (e.g. category name) and a list of all `items` (name, description, link, icon as desired).
   - Optionally a “Back to Dashboard” button that calls `onBack`; otherwise, “Dashboard” in `SideNav` is sufficient.
2. **`App`:** When `activeCategory !== null`, render:

   ```jsx
   <CategoryPage
     categoryId={activeCategory}
     items={devResources[activeCategory] || []}
     onBack={() => setActiveCategory(null)}
   />
   ```

   When `activeCategory === null`, keep rendering `<Dashboard ... />` as in Step 8.

### Code

**`src/components/CategoryPage.jsx`**

```jsx
function CategoryPage({ categoryId, items, onBack }) {
  const title = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  return (
    <div className="category-page">
      <h2>{title}</h2>
      <button type="button" onClick={onBack}>
        Back to Dashboard
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.name}
            </a>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryPage;
```

**`src/App.jsx`** (replace the placeholder for `activeCategory !== null`)

```jsx
import CategoryPage from './components/CategoryPage';

// ... in the main return, inside Layout children:

{
  activeCategory === null ? (
    <Dashboard devResources={devResources} onViewMore={(id) => setActiveCategory(id)} />
  ) : (
    <CategoryPage
      categoryId={activeCategory}
      items={devResources[activeCategory] || []}
      onBack={() => setActiveCategory(null)}
    />
  );
}
```

### Checkpoint

- “View more” on a `ResourcePreview` and clicking a category in `SideNav` both show `CategoryPage` with the full list for that category.
- “Dashboard” in the sidebar or “Back to Dashboard” on the category page returns to the dashboard with previews.

### Future overhead

This “page” is in-memory only. The URL does not change. When you add routing (e.g. React Router), you will map paths like `/category/learning` to `activeCategory === 'learning'` and derive `activeCategory` from the URL. The current `activeCategory` + `setActiveCategory` pattern will move to route state or the router’s `params`.

---

## Step 10: Polish and practices

### Why this step

Before considering the assessment complete, we fix loose ends and reinforce where state lives and what may become technical debt.

### What to do

1. **Remove debug code:** No `console.log`, temporary “Category: … (Step 9)” text, or unused variables.
2. **`PREVIEW_LIMIT`:** If it lives only in `ResourcePreview`, consider moving it to a shared `src/constants.js` or `src/config.js` if you prefer. Otherwise, leaving it in the component is acceptable for this size.
3. **Accessibility:**
   - `LoadingScreen`: `role="status"` and `aria-label="Loading"` (you added this in Step 2).
   - Form: `label` with `htmlFor` and `id` on the input (Step 3).
   - Nav: `aria-label` on the nav, `aria-current="page"` on the active item (Step 7).
   - Headings: use a logical order (`h1` in Header, `h2` for sections).
4. **Styling:** Ensure `[data-theme="dark"]` has enough rules so Loading, UsernameForm, and all layouts respond to the theme. Optional: persist `theme` (and `username`) in `localStorage` and rehydrate on load.
5. **PropTypes or types:** Not required here, but in a real codebase you would add PropTypes or TypeScript for props. For this exercise, clear prop names and a short comment above each component listing props is enough.

### Where state lives — summary

| State            | Owner | Set by                                                     | Used by                                                             |
| ---------------- | ----- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| `isLoading`      | App   | `useEffect` (init)                                         | App (conditional: `LoadingScreen`)                                  |
| `username`       | App   | `UsernameForm` via `onSubmit`                              | App (gate), `Header`                                                |
| `theme`          | App   | `Header` via `onThemeToggle`                               | App (`useEffect` for `data-theme`), `Header`                        |
| `activeCategory` | App   | `SideNav`, `ResourcePreview`, `CategoryPage` via callbacks | App (choice of `Dashboard` vs `CategoryPage`), `Layout` → `SideNav` |

### What may become overhead

- **Prop drilling:** If you add more layers, passing `username`, `theme`, or `activeCategory` through many components will get tedious. Then consider **React Context** for read‑only or rarely changing values (e.g. theme, user).
- **No routing:** The category “page” has no URL. For sharable links and back/forward, you will eventually use a router and derive `activeCategory` from the URL.
- **Static data:** `devResources` is imported at build time. For APIs, you will need loading/error state and a clear place to fetch (e.g. in `App` or in a layout/route).
- **`Layout` props:** `Layout` has grown a long prop list. If it continues to grow, you might pass a single `layout` or `config` object, or use Context for some of it. For now, explicit props are clearer for learning.

---

## Final checklist

- [ ] Loading state on init; `LoadingScreen` when `isLoading`.
- [ ] Username gate; `UsernameForm` until `username` is set.
- [ ] Header with `username` and theme toggle; `theme` in `App`, applied via `useEffect` to the document.
- [ ] Sidebar with categories and “Dashboard”; `activeCategory` in `App`; `SideNav` receives `categories`, `activeCategory`, `onSelectCategory`.
- [ ] Dashboard with `ResourcePreview` blocks; each has a “View more” that sets `activeCategory`.
- [ ] Category page when `activeCategory` is set; “View more” and sidebar category both lead there; “Dashboard” and “Back to Dashboard” return to the dashboard.
- [ ] No `console.log` or temporary placeholders; basic a11y and theme handling in place.

---

## File structure (reference)

```
src/
  App.jsx
  App.css
  main.jsx
  index.css
  devResources.json
  components/
    LoadingScreen.jsx
    UsernameForm.jsx
    Header.jsx
    Layout.jsx
    SideNav.jsx
    Dashboard.jsx
    ResourcePreview.jsx
    CategoryPage.jsx
```

---

_End of implementation guide._
