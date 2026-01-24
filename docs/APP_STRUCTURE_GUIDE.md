# Developer Resources Dashboard — Structure & Design Guide

A step-by-step guide to thinking about and structuring this React app from first principles.  
**Do not implement yet.** Use this as your blueprint before writing code.

---

## Part 1: Thinking From First Principles (Before Writing Code)

### 1.1 What Does "First Principles" Mean Here?

**First principles** means starting from the basics: what the app must _do_, what the user _sees_, and what _changes over time_. We build the structure from that, not from "where should I put this file?"

---

### 1.2 Start With the User’s Journey

Write down the user flow in plain language:

1. User opens the app → sees a **loading indicator**.
2. Loading finishes → sees an **input** to enter their username.
3. User enters a name and confirms (or we auto-save) → **header** shows the name and a **theme toggle**.
4. User sees a **side nav** with resource categories and a **main area** with resource previews.
5. User clicks **"view more"** on a category → (for now) we only need the link; behavior can be filled in later.

This gives you: **screens/states** (loading, no-username, has-username) and **pieces of UI** (loading, input, header, side nav, main area, view-more links).

---

### 1.3 Identify What Changes (State) vs What Stays (Structure)

| Thing                   | Changes?    | Drives                                               |
| ----------------------- | ----------- | ---------------------------------------------------- |
| App is loading          | Yes         | Show loading UI vs rest of app                       |
| Username                | Yes         | Header text, maybe what we “remember”                |
| Theme (e.g. light/dark) | Yes         | CSS classes, `data-theme`, or `prefers-color-scheme` |
| Selected nav category   | Yes (later) | Which resources to show, active style in nav         |
| Resource list           | Maybe later | Fetched from API or static for now                   |

**Terminology: state** = data that can change over time and that React “remembers” so it can re-render the right UI.

---

### 1.4 Single Source of Truth

For each piece of state, decide: **one place that “owns” it**.  
Duplicated state (e.g. `username` in two components each with its own `useState`) leads to bugs when one updates and the other doesn’t. We’ll pick **one owner** and pass data down (and occasionally pass **updater functions** up).

---

## Part 2: Breaking the UI Into Components and Responsibilities

### 2.1 Draw a Simple Hierarchy (on Paper or Figma)

Think in **boxes**:

```
┌─────────────────────────────────────────────────────────┐
│  App (root)                                              │
│  ┌───────────────────────────────────────────────────┐   │
│  │  LoadingScreen  (when loading)                     │   │
│  └───────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────┐   │
│  │  OR: Main Layout (when not loading)                │   │
│  │  ┌─────────────┐  ┌────────────────────────────┐   │   │
│  │  │   Header    │  │  (placeholder for content) │   │   │
│  │  └─────────────┘  └────────────────────────────┘   │   │
│  │  ┌─────────────┐  ┌────────────────────────────┐   │   │
│  │  │  SideNav    │  │  Dashboard (main content)  │   │   │
│  │  │             │  │  - ResourcePreviews        │   │   │
│  │  │             │  │  - "View more" links       │   │   │
│  │  └─────────────┘  └────────────────────────────┘   │   │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

You’ll also need something for **“enter username”** before we have a name. That can be a step _before_ the main layout or a **banner/modal** that hides once we have a username—your choice; we’ll treat it as its own **step/state** in the flow.

---

### 2.2 Component List and Responsibilities

| Component                                  | Responsibility                                                                                                                             | Props it might receive                             | State it might own                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------ |
| **App**                                    | Decides: loading? → `LoadingScreen`; no username? → `UsernameForm` or similar; else → `MainLayout`. Owns `isLoading`, `username`, `theme`. | —                                                  | `isLoading`, `username`, `theme` (or we lift theme to App and pass down) |
| **LoadingScreen**                          | Shows a spinner/skeleton. No logic.                                                                                                        | —                                                  | None                                                                     |
| **UsernameForm** (or **UsernameGate**)     | Input + way to submit. Tells parent “username is X” via callback.                                                                          | `onSubmit(username)`                               | Local `inputValue` only (controlled input)                               |
| **Header**                                 | Shows `username` and a theme toggle.                                                                                                       | `username`, `theme`, `onThemeToggle`               | None                                                                     |
| **SideNav**                                | List of resource categories. Highlights active.                                                                                            | `categories`, `activeId`, `onSelect` (for later)   | None for now                                                             |
| **Dashboard** (main content)               | Composes **resource preview blocks** and “view more” links.                                                                                | `categories` or `resources` structure              | None for now                                                             |
| **ResourcePreview** (or **CategoryBlock**) | One category’s preview + “View more” link.                                                                                                 | `title`, `items[]`, `viewMoreHref` or `onViewMore` | None                                                                     |

**Terminology:**

- **Props** = values passed _in_ from the parent. Read-only in the child.
- **Callback props** = functions passed in (e.g. `onSubmit`, `onThemeToggle`) so the child can _report_ actions to the parent.

---

### 2.3 Keep Components Focused

- **One main job per component.** If one component is doing: “fetch data, parse it, show a list, and handle theme,” that’s too much. Split “data,” “list,” and “theme” so each has a clear owner.
- **Presentational vs a bit of logic.**
  - `LoadingScreen`, `Header`, `SideNav` = mostly presentational (display what they’re told).
  - `App`, `UsernameForm`, and maybe `Dashboard` later = a bit of logic (state, decisions, event handlers).

---

### 2.4 A Note on Naming

- **`UsernameForm`** vs **`UsernameGate`**: “Form” suggests a form in the DOM; “Gate” suggests “you must pass through this before seeing the main app.” Either is fine; pick one and stay consistent.
- **`ResourcePreview`** vs **`CategoryBlock`**: “ResourcePreview” is about _what_ (a preview of resources); “CategoryBlock” is about _structure_ (a block per category). For a resources dashboard, **ResourcePreview** or **CategoryPreview** is often clearer.

---

## Part 3: Where State Lives and Why

### 3.1 The “Lift State Up” Idea

**Rule of thumb:** put state in the **lowest common ancestor** of all components that need to _read_ or _change_ it.

- **Read only** → you can pass it down as props.
- **Change** → you pass a function down (e.g. `onThemeToggle`) so the parent can update the state; the child stays dumb.

---

### 3.2 Loading (`isLoading`)

- **Who needs it?**
  - **App** needs it to choose: `LoadingScreen` vs main flow.
- **Who changes it?**
  - **App** (e.g. in `useEffect` that runs once and sets `isLoading` to `false` after a short delay or after some async init).

**Conclusion:** `isLoading` lives in **App**. No other component needs to own it.  
**Common mistake:** Putting loading in a child and then having to “tell” App. Easier to keep it in App from the start.

---

### 3.3 Username

- **Who needs it?**
  - **App** (to decide: show `UsernameForm` vs main layout).
  - **Header** (to display it).
- **Who changes it?**
  - **UsernameForm** submits; **App** should be the one that stores it.

**Conclusion:** `username` lives in **App**.

- **App** passes `onSubmit` to `UsernameForm`; when the user submits, `UsernameForm` calls `onSubmit(value)` and **App** does `setUsername(value)`.
- **App** passes `username` to `Header`.

**Persistence (optional, later):** If you want to “remember” the name across refreshes, the _state_ can still live in App; you’ll just initialize it from `localStorage` (or similar) in `useState` and write to `localStorage` in the `onSubmit` handler.

**Common mistake:** Storing `username` in `UsernameForm` and also in `Header` separately. That’s two sources of truth. One owner (App), pass down.

---

### 3.4 Theme (e.g. light/dark)

- **Who needs it?**
  - Arguably the **whole app** (styling). In practice, we need:
    - A place to _store_ the chosen theme.
    - A way to _apply_ it (e.g. `document.documentElement.setAttribute('data-theme', theme)` or a class on a root `div`).
- **Who changes it?**
  - **Header** (theme toggle). So Header needs an `onThemeToggle` (or `onThemeChange`) from the parent.

**Conclusion:** `theme` lives in **App**.

- **App** passes `theme` and `onThemeToggle` to `Header`.
- **App** (or a tiny effect) applies the theme to the DOM (e.g. on `document.documentElement` or a layout wrapper).

**Terminology:**

- **Controlled component:** The parent owns the value and passes it down; the child only reports changes. The theme toggle is “controlled” by App.
- **Side effect:** When we _apply_ the theme to the DOM (or `localStorage`), we do it in a `useEffect` in App, so we’re not mixing “when to render” with “when to touch the DOM.”

**Common mistake:** Storing theme only in a child. Then the rest of the app doesn’t know the theme. Lifting to App keeps it in one place.

---

### 3.5 Summary: State in App

| State       | Owner | How it’s set                                   | Who uses it                                 |
| ----------- | ----- | ---------------------------------------------- | ------------------------------------------- |
| `isLoading` | App   | `useEffect` (or async init)                    | App (conditional render)                    |
| `username`  | App   | `setUsername` from `UsernameForm`’s `onSubmit` | App (routing), Header                       |
| `theme`     | App   | `setTheme` from `Header`’s `onThemeToggle`     | App (apply to DOM), Header (display toggle) |

All three stay in **App** for now. No Redux, Zustand, or Context needed for this scope.

---

## Part 4: Simple Now vs Complex Later

### 4.1 Simple for Now

- **Loading:** A `setTimeout` or a `Promise` that resolves after 1–2 seconds. Good enough to practice “loading → not loading” and conditional rendering.
- **Username:** A string in state. Optional: read/write `localStorage` in the same place you `setUsername`.
- **Theme:** A string: `'light' | 'dark'`. Toggle just flips it. Applying it can be `data-theme` on `<html>` or a wrapper.
- **Side nav:** A static list of categories. `activeId` can be `null` or the first category; clicking can `setActiveId` in App and be passed down. No routing yet.
- **Resource previews:** Hard-coded list of categories and a few placeholder resources per category. “View more” can be a `href="#"` or `to="/category-id"` (route not implemented yet) or an `onClick` that you’ll wire later.
- **Layout:** Flex or Grid. Header full width; under it: side nav + main. No need for a layout library yet.

---

### 4.2 Likely to Become More Complex

| Area                                    | Why it may grow                                                                                                                                                                                                               |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Routing**                             | “View more” and “category” will eventually map to URLs. You’ll introduce React Router (or similar) and route-based data loading.                                                                                              |
| **Data (resources)**                    | Today: static. Later: fetch from API, loading/error per category, pagination, caching. That will push you to consider _where_ to fetch (e.g. in a layout or a page component) and possibly **context** or a small data layer. |
| **State shared across many components** | If more than a few screens need `username` or `theme`, you might add **React Context** to avoid prop drilling. For just App → Header and one layout, props are fine.                                                          |
| **Side nav + URL**                      | “Selected category” will align with the URL. The nav becomes a reflection of the route, not the other way around.                                                                                                             |
| **Persistence**                         | `username` and `theme` in `localStorage` are fine. If you add “favorites” or “history,” you’ll need a clearer persistence strategy.                                                                                           |
| **Forms**                               | If you add validation, “saving” states, or multi-step flows, you might later use a form library. For one input and a submit, `useState` is enough.                                                                            |

---

### 4.3 When to Introduce New Tools

- **Context:** When you’re passing the same 2–3 props through many layers with no real logic in between. Not yet for this size.
- **useReducer:** When one action triggers multiple state updates or the logic is hard to follow in `useState`. Not required for loading/username/theme.
- **Custom hooks:** When you want to reuse _logic_ (e.g. “read/write theme from localStorage and DOM”). You can extract `useTheme()` later; for learning, doing it in App is clearer first.

---

## Part 5: Common Beginner Mistakes to Avoid

### 5.1 State and Structure

1. **Duplicated state**
   - Keeping `username` in both `UsernameForm` and `Header`.
   - Fix: one owner (App), pass down.

2. **State that can be derived**
   - Storing `isLoading` and also `hasFinishedInit` when one is the inverse of the other.
   - Prefer one and derive the rest when trivial.

3. **State that belongs to the DOM, not to React**
   - Example: “is the dropdown open?” can be React state. “Scroll position” might be refs or DOM until you need to render from it.
   - For this app, “dropdown open” is likely not needed yet; when it is, put it in the component that renders the dropdown.

---

### 5.2 Components and Props

4. **Props that are never used**
   - Passing `username` to `SideNav` when it doesn’t need it.
   - Keep the interface small: only pass what the component uses.

5. **Big, random prop objects**
   - `payload={{ loading, user, theme, onA, onB }}` instead of `loading`, `user`, `theme`, `onA`, `onB`.
   - Flat, explicit props are easier to understand and refactor.

6. **Logic in presentational components**
   - `Header` should not fetch the username. It should receive `username` and `onThemeToggle` and render.

---

### 5.3 Effects and Lifecycle

7. **`useEffect` for something that can be computed during render**
   - Deriving “display name” from `username` doesn’t need an effect; do it in render.

8. **Missing or wrong dependency arrays**
   - `useEffect` that uses `username` but doesn’t list it in deps.
   - Follow the exhaustive-deps rule: include all values from the effect’s closure that can change.

9. **Applying theme in render**
   - Prefer `useEffect` to sync `theme` to `document.documentElement` or `localStorage`, so it’s a side effect, not part of the render path.

---

### 5.4 Naming and File Organization

10. **Unclear names**
    - `Component1`, `Thing`, `Data`.
    - Prefer: `LoadingScreen`, `UsernameForm`, `ResourcePreview`.

11. **One giant `App.jsx`**
    - As you add layout, header, nav, dashboard, split into components and eventually into files. A good next step: one component per file under `src/components/` (or `src/App/`), and `App.jsx` only orchestrates.

---

## Part 6: What Becomes Overhead as the App Grows

- **Prop drilling**
  - If you add more levels (e.g. `App → Layout → Dashboard → ResourcePreview`), passing `theme` or `username` through every layer becomes noisy.
  - When it hurts: introduce **Context** for “global” things like theme and user.

- **Fetching in the wrong place**
  - Fetching in `App` for everything will make App heavy.
  - Later: fetch in the **page/route** or in a component that “owns” that part of the UI, and lift only what’s needed (e.g. to show a global loading bar).

- **Mixing “layout” and “page”**
  - At first, one big layout is fine. When you add routing, you’ll want:
    - A **layout** that always renders Header + SideNav.
    - **Pages** (e.g. Dashboard, Category) that render in the main area.
  - This will influence where you put `username` and `theme` (layout or a provider above it).

- **Hard-coded categories and resources**
  - When the list comes from an API, you’ll need loading/error and a clear data shape.
  - Define a simple **schema** in your head (or in a constant) early: e.g. `{ id, label, resources: [{ id, title, url }] }` so the transition to fetched data is easier.

---

## Part 7: How to Approach Similar Projects Later

1. **Describe the flow**
   - Write the user’s path and the main “modes” (loading, onboarding, main app).

2. **List what changes**
   - Turn that into state. One owner per piece of state.

3. **Sketch the hierarchy**
   - Blocks on a page, then map to components. One clear responsibility per component.

4. **Assign state to the lowest common parent**
   - Start with the smallest tree that needs to read/write that state.

5. **Implement in small steps**
   - Loading only → then username flow → then theme → then nav and previews.
   - Get each step working before moving on.

6. **Refactor when it hurts**
   - Don’t add Context “just in case.” Add it when passing props through many layers becomes awkward.

---

## Part 8: Suggested File and Component Layout (When You Implement)

Use this as a target structure, not a requirement. You can start flatter and refactor toward this.

```
src/
  App.jsx                 # Orchestrator: loading / username gate / layout; owns isLoading, username, theme
  main.jsx
  index.css

  components/
    LoadingScreen.jsx     # Spinner or skeleton
    UsernameForm.jsx      # Input + submit; calls onSubmit(username)
    Header.jsx            # username, theme, onThemeToggle
    SideNav.jsx           # categories, activeId, onSelect
    Layout.jsx            # (optional) Header + SideNav + main slot (children)
    Dashboard.jsx         # Composes ResourcePreview blocks
    ResourcePreview.jsx   # One category’s preview + “View more”

  data/ or constants/     # (optional) categories, placeholder resources
    categories.js
```

- **App** does:
  - `if (isLoading) return <LoadingScreen />`
  - `if (!username) return <UsernameForm onSubmit={setUsername} />`
  - `return <Layout><Header ... /><SideNav ... /><Dashboard ... /></Layout>`

- **Layout** can wrap `Header`, `SideNav`, and `{children}` for the main area. Dashboard can be `children` or passed explicitly.

---

## Quick Glossary

- **State:** Data that can change and that React keeps so it can re-render.
- **Props:** Values (and callbacks) passed from parent to child. Read-only in the child.
- **Lifting state up:** Moving state to a common parent so multiple children can use it.
- **Controlled component:** Value and changes are fully owned and driven by the parent via props.
- **Side effect:** Something that affects the outside world (DOM, `localStorage`, network). In React, often done in `useEffect`.
- **Presentational component:** Mostly receives props and renders UI; little or no state or logic.

---

## Next Step

Use this document as your spec. Implement in this order:

1. `LoadingScreen` + `isLoading` in App (with a `setTimeout` or similar).
2. `UsernameForm` + `username` in App; show `UsernameForm` when `!username`, else a simple placeholder for the rest.
3. `Header` with `username` and a theme toggle; `theme` in App and applied to the DOM.
4. `SideNav` with static categories.
5. `Dashboard` and `ResourcePreview` with static data and “View more” links.

After each step, run the app and confirm behavior before adding the next. If something feels awkward (e.g. too many props), re-read the “Where state lives” and “Overhead” sections and adjust.
