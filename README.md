# Project Hub Lite

A React + TypeScript application for browsing and filtering internal projects. Browse a list of projects, narrow by search and filters, and view detailed project information.

## Quick start

```bash
npm install
npm run dev       # Start dev server on http://localhost:5173
npm test          # Run tests (watch mode with --watch)
```

### Assumptions

The app uses mock data loaded synchronously from `projects.json` to simulate a project list. Search query, status filter, and tag selection are persisted in the URL using `URLSearchParams` so filters persist across page refreshes and can be bookmarked. The detail view is displayed as a side panel on desktop and stacks below the list on mobile.

### Debounce

Search input debounce delay: **300ms**. This reduces re-renders while users type without introducing noticeable lag.

### Focus management

When a project is selected and the detail panel opens, keyboard focus is moved to the detail container (marked with `tabIndex={-1}` and imperatively focused) so keyboard navigation continues within the detail region.

### Keyboard shortcuts

- **`Escape`** — Close the detail panel when open
- **Arrow Up / Down** — Navigate through project list items (when list is focused)
- **Enter** — Select a highlighted project to open detail view

### Accessibility

- **Keyboard navigation:** Full keyboard support for list, filters, and detail pane
- **Semantic HTML:** Proper heading hierarchy (`h1` → `h2`) and ARIA labels where needed
- **Focus management:** Visible focus styles and focus moves into detail region on selection
- **Labels:** All inputs have associated labels; filter buttons are clearly labeled
- **Loading/Error/Empty states:** Clear visual messaging for all states

---

## Features

✅ **List** — Display all projects with title, status, tags  
✅ **Search** — Debounced text search on title and description  
✅ **Filters** — Filter by status (active/paused/archived) and tags  
✅ **URL state** — Query, status, and tag filters reflected in URL (supports deep linking)  
✅ **Detail view** — Side panel showing full project info (title, status, description, owner, updatedAt, tags)  
✅ **States** — Loading, error, and empty state handling  
✅ **Responsive** — Adapts to desktop and mobile viewports  
✅ **Tests** — Meaningful unit and integration tests with React Testing Library  

---

## AI and verification

### Tools

GitHub Copilot — Used for component structure, hook implementations, and test boilerplate generation throughout the project.

### Prompt links

Unfortunately, GitHub Copilot chat does not provide shareable URLs. However, key areas where AI assistance shaped the project:

1. **Hook design** — Prompts focused on `useUrlState`, `useDebounce`, and `useProjects` for managing complex state and URL synchronization
2. **Filter logic** — Assistance with combining search + status + tag filters using AND logic in `filterProjects.ts`
3. **Component tests** — Guidance on structuring React Testing Library tests with `waitFor`, `userEvent`, and fake timers
4. **Accessibility** — Suggestions for focus management, ARIA labels, and keyboard event handling

**Verification approach:** All AI suggestions were manually reviewed by running tests, checking in the browser (especially keyboard shortcuts, focus behavior, and filter combinations), and cross-referencing React docs for correctness.

### Verify

Three things verified manually before considering the implementation complete:

1. **Debounce behavior** — Typed quickly into search input; confirmed with browser DevTools that the filter function only ran after 300ms of inactivity, not on every keystroke.
2. **URL deep linking** — Crafted a URL by hand with query parameters (`?q=test&status=active&tag=frontend`), refreshed the page, and confirmed the same filtered list and previous selections were restored.
3. **Keyboard navigation** — Used only keyboard (no mouse) to navigate the list, open a project detail pane, close it with Escape, and refocus the list—verified all focus transitions worked correctly with DevTools accessibility inspector.

### Course-correct

Early in development, AI suggested using a centralized Redux store for filter state. This was overly complex for the scope and would have added unnecessary bundle weight. Instead, I stayed with React hooks + URL state (URLSearchParams), which is simpler, more performant, and aligns with the app's needs. This decision simplified debugging and made the code more maintainable for a small take-home.

---

## Optional stretch

**None** 

---

## Tailwind

**Tailwind CSS** was used for all custom layout and responsive styling in this submission. The following Tailwind features were leveraged:

- **Responsive utilities** — `sm:`, `md:` breakpoints for mobile and desktop layouts
- **Flexbox & Grid** — Layout components (`flex`, `gap`, `p-`, `rounded-lg`)
- **Colors & spacing** — Consistent design tokens from `tailwind.config.js`
- **Hover & focus states** — `hover:`, `focus:ring-` for interactive feedback
- **Animations** — `animate-slide-up` for mobile filter drawer