# Sorting Algorithm Visualizer - Implementation Plan

## Overview
This application will provide an interactive visualization of various sorting algorithms, helping users understand how different sorting methods work by displaying the process in real-time with configurable speeds. The application includes comprehensive theme support with light/dark modes and smooth transitions.

## Assumptions
- Single-page application (SPA) with no backend dependency (current scope).
- Modern browsers with Web Worker support; graceful handling when metrics APIs are unavailable.
- Limited concurrent users; minimal-cost Azure hosting (Static Web Apps Free) targeted for MVP.
- Theme and accessibility standards apply to all new features.

## Core Features

### 1. Algorithm Selection
- Dropdown menu to select sorting algorithms:
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
  - Merge Sort

### 2. Visualization Controls
- Speed Control Slider
  - Adjustable delay between sorting steps (e.g., 1ms to 1000ms)
- Randomize Button
  - Generates new random array (size based on screen width)
- Start/Stop Button
  - Begins/Pauses the sorting visualization
- Step Button
  - Executes one step of the algorithm

### 3. Performance Metrics Display
- Number of steps/comparisons
- Total execution time
- Number of swaps
- Memory usage tracking

### 4. Main Visualization Area
- Responsive display of vertical bars (50-200 based on screen size)
- Each bar represents a value through its height
- Bars will be arranged from shortest to tallest (left to right) when sorted
- Visual indicators for:
  - Currently compared elements
  - Swapped elements
  - Sorted portions of the array
- **Theme-aware styling** with proper contrast ratios
- Screen reader descriptions of operations

### 5. Educational Features
- Step-by-step explanation panel
- Algorithm pseudo-code display with current step highlighting
- Time complexity information
- Best/worst case scenarios
- Common use cases

### 6. Theme System ⭐ **REQUIRED FOR ALL NEW FEATURES**
- **Light and Dark Theme Support**: Comprehensive theme switching with smooth transitions
- **System Theme Detection**: Automatic theme switching based on OS preferences
- **Persistent Theme Storage**: User theme preferences saved locally
- **Accessibility Compliance**: WCAG AA contrast ratios in both themes
- **Mobile Responsive**: Theme support across all device sizes
- **High Contrast Support**: Enhanced visibility options for accessibility
- **Reduced Motion Support**: Respects user motion preferences

## Technical Implementation

### Components Structure
1. `SortingVisualizer` (Main Component)
   - Contains the overall layout and state management
   - Manages Web Worker communication
   - Handles the animation timing
   - **Theme Integration**: Uses theme context for all styling

2. `ControlPanel`
   - Algorithm selection dropdown
   - Speed control slider
   - Control buttons (Start, Reset, Step)
   - Performance metrics display
   - Accessibility controls
   - **Theme Integration**: All controls use theme-aware styling

3. `BarDisplay`
   - Renders the array as vertical bars
   - Handles the visual updates during sorting
   - Implements responsive sizing
   - **Theme Integration**: Bar colors and states adapt to current theme

4. `AlgorithmExplanation`
   - Displays current algorithm details
   - Shows pseudo-code with highlighting
   - Provides step-by-step explanation
   - **Theme Integration**: Content panels and code blocks use theme colors

5. `ThemeSwitcher` ⭐ **CORE COMPONENT**
   - Manages theme state (light/dark/system)
   - Provides theme switching controls
   - Handles theme persistence and system detection
   - **Required Integration**: All new components must use this system

### State Management
- Implement State Machine with states:
  - IDLE
  - GENERATING
  - SORTING
  - PAUSED
  - COMPLETED
- Array of numbers (heights)
- Current algorithm selection
- Animation speed
- Performance metrics
- Currently active elements
- Step history with compression
- **Theme State**: Current theme, user preferences, system detection

### Background Processing
- Web Worker implementation for sorting algorithms
- Message-based communication protocol
- Progress tracking and cancellation support
- Memory usage monitoring

### Algorithm Implementation
Each sorting algorithm will be implemented as a separate module with:
- Main sorting function
- Step-by-step execution capability
- State tracking for visualization
- Performance metrics collection
- Educational descriptions and pseudo-code
- **Theme Considerations**: Algorithm-specific colors must work in both themes

### Animation System
- RequestAnimationFrame for smooth animations
- Configurable delay between steps
- State management for visual transitions
- Memory-efficient step recording
- **Theme Integration**: Animation colors and effects adapt to current theme

### Accessibility Implementation
- ARIA labels for all controls
- Keyboard navigation support
- Screen reader descriptions
- **Theme-aware high contrast mode**
- Focus management
- Audio feedback options
- **Reduced motion support** for theme transitions

## Work Plan by Phases

### Completed Phases

## Development Phases

### Phase 1: Core Architecture ✅ **COMPLETE**
1. ✅ Set up Web Worker architecture
2. ✅ Implement state machine
3. ✅ Create base components
4. ✅ Set up accessibility foundation
5. ✅ **Implement theme system foundation**

### Phase 2: Algorithm Implementation ✅ **COMPLETE**
1. ✅ Implement Bubble Sort with step tracking
2. ✅ Add Selection Sort
3. ✅ Add Insertion Sort
4. ✅ Implement Merge Sort
5. ✅ Add educational content for each
6. ✅ **Theme integration for all algorithm visualizations**

### Phase 3: Controls & UI ✅ **COMPLETE**
1. ✅ Create accessible control panel
2. ✅ Implement speed control
3. ✅ Add randomize functionality
4. ✅ Build performance metrics display
5. ✅ Add step-by-step controls
6. ✅ **Complete theme integration for all UI elements**

### Phase 4: Visual & Educational Enhancements ✅ **COMPLETE**
1. ✅ Add responsive sizing
2. ✅ Implement swap animations
3. ✅ Add color coding for states
4. ✅ Create explanation panel
5. ✅ Add pseudo-code display
6. ✅ **Theme-aware color coding and animations**

### Pre‑MVP Phases

#### Phase 5: Testing & Optimization (Required for MVP)
- Implement unit tests for algorithms (worker-level)
- Add visual regression tests (key states)
- Add accessibility testing (contrast, focus, screen reader)
- Optimize memory usage and check for leaks
- Cross-browser smoke tests
- Add basic performance benchmarks
- Theme system testing across light/dark/system and reduced motion

### Phase 6: Theme System Implementation ✅ **COMPLETE**
1. ✅ **Foundation CSS Variables**: Comprehensive color system
2. ✅ **Global Theme Support**: Base styles with Headless UI integration
3. ✅ **Smooth Transitions**: 300ms ease transitions
4. ✅ **Theme Context**: React context for state management
5. ✅ **Theme Switcher**: Functional control component
6. ✅ **Component Integration**: All components themed
7. ✅ **Polish & Testing**: Accessibility, performance, mobile support

## Technical Considerations

### Theme System Requirements ⭐ **MANDATORY FOR ALL NEW FEATURES**
- **CSS Variables**: Use established theme variable system for all colors
- **Theme Context**: Integrate with ThemeContext for state management
- **Smooth Transitions**: Implement 300ms ease transitions for theme changes
- **Accessibility**: Ensure WCAG AA compliance in both themes
- **Performance**: Optimize theme switching without layout shifts
- **Mobile Support**: Ensure themes work across all device sizes
- **Fallbacks**: Provide graceful degradation for unsupported browsers

### Core Theme Variables Available
```css
/* Background Colors */
--color-page-background, --color-panel-background, --color-overlay-background

/* Text Colors */
--color-foreground, --color-foreground-muted, --color-foreground-subtle

/* Border Colors */
--color-border, --color-border-strong, --color-border-subtle

/* Status Colors */
--color-success, --color-warning, --color-error, --color-info

/* Interactive Colors */
--color-hover, --color-hover-strong, --color-active, --color-accent

/* Code Colors */
--color-code-background, --color-code-foreground, --color-code-border
```

### Other Technical Requirements
- Use Web Workers for background processing
- Implement memory-efficient step tracking
- Use TypeScript for type safety
- Maintain responsive design
- Comprehensive accessibility support
- State machine for robust state management
- Memory usage monitoring and optimization

## Testing Strategy
- Unit tests for sorting algorithms
- Visual regression tests for animations
- Accessibility compliance testing
- Performance benchmarking
- Memory leak detection
- Cross-browser compatibility
- State machine transition testing
- **Theme System Testing**:
  - Light/dark theme switching
  - System theme detection
  - Theme persistence
  - Accessibility compliance in both themes
  - Mobile theme support
  - Performance during theme changes

## Release Phases

### Pre‑MVP Bug Fixes & Hardening
- Fix step-by-step Merge Sort comparison logic in `SortingVisualizer.tsx` (align with worker).
- Guard memory usage metric when unsupported; display N/A.
- Verify Web Worker behavior in production (no cross-origin issues).
- Ensure SPA fallback works on deep links/refresh.

### Pre‑MVP MVP Quick Wins
- Invariant overlays per algorithm (sorted regions, active ranges).
- Stability demonstration mode (duplicate labels and order preservation).
- Data pattern presets (reversed, nearly sorted %, few unique k, organ pipe, sawtooth, Gaussian, duplicates-heavy).
- Step history with next/prev and timeline scrubber (bounded memory).
- Split-view Algorithm Race with minimal charts; synchronized controls.

### Pre‑MVP Deployment Setup
- Configure CI build workflow (Node 18) for `Sorter/App.UI`.
- Connect repository to Azure Static Web Apps (Free) and verify portal workflow.
- Confirm output path `dist` and app path `Sorter/App.UI`.

### MVP Release (V1)
- Deploy to Azure Static Web Apps following the Deployment Plan.
- Acceptance Criteria:
  - Sorting works in production for Bubble, Selection, Insertion, Merge (run and step modes).
  - No console errors; worker steps stream and complete.
  - Theme switching persists and respects system settings.
  - SPA routes refresh correctly; deep links load.
  - Keyboard navigation and ARIA live updates work.
  - CI build on main passes; deployment is automatic and public.

## Post‑Release Phases

### Phase 7: Additional Sorting Algorithms (Planned)

### Goals
- Broaden educational coverage by adding a diverse set of sorting algorithms.
- Maintain smooth, theme-aware visualization with consistent step semantics.
- Keep complexity manageable by staging algorithms based on required UI/tooling.

### Categories and Tooling Impact

- Group A — Drop-in comparison sorts (no new UI required):
  - Use existing `SortingStep` types (`compare`, `swap`, `select`, `insert`, `merge`) and bar visualization.
  - Optional semantic types for clarity can be introduced later, but not required to ship.

- Group B — Non-comparison/bucketed sorts (auxiliary overlay panel recommended):
  - Require an additional, collapsible panel to visualize buckets/count arrays.
  - Prefer extending `SortingStep['type']` with: `count`, `bucket`, `collect`, `write`.

- Group C — Advanced/hybrid algorithms (new state or visualization modules):
  - May require recursion depth indicators, run detection, merge stack view, or specialized diagrams (heaps, networks, trees).
  - Consider extending step types: `partition`, `heapify`, `gap`, and a generic `note` step for algorithm-specific context.

- Group D — Educational/novelty algorithms (guardrails required):
  - Add explicit max-step/time safeguards to prevent runaway sessions.

### Proposed Algorithms (with implementation notes)

- Quick Sort (Lomuto/Hoare/3-way)
  - Category: Group A (3-way still fits bars, but adds equal partition awareness)
  - Stable: No; In-place: Yes (typical implementations)
  - Time: best/avg O(n log n), worst O(n²); Space: O(log n) recursion
  - Step types: `select` (pivot), `compare`, `swap`; optional `partition`
  - Notes: highlight pivot; consider variant toggle (Lomuto/Hoare/3-way); recursion depth optional badge

- Heap Sort
  - Category: Group A (optional Group C heap overlay later)
  - Stable: No; In-place: Yes
  - Time: O(n log n); Space: O(1)
  - Step types: `compare`, `swap`; optional `heapify`
  - Notes: can visualize purely in the array; future: optional heap tree overlay

- Shell Sort (gap sequences: Knuth, Ciura)
  - Category: Group A
  - Stable: No; In-place: Yes
  - Time: sequence-dependent; commonly ~O(n^(3/2)) to O(n log² n)
  - Step types: `compare`, `swap`; optional `gap` note
  - Notes: expose gap sequence config in UI (later)

- Comb Sort
  - Category: Group A
  - Stable: No; In-place: Yes; Time: O(n²) average; Space: O(1)
  - Step types: `compare`, `swap`; notes: shrink factor (≈1.3)

- Cocktail Shaker Sort (bidirectional bubble)
  - Category: Group A
  - Stable: No; In-place: Yes; Time: O(n²); Space: O(1)
  - Step types: `compare`, `swap`; notes: forward/backward passes

- Gnome Sort
  - Category: Group A
  - Stable: No; In-place: Yes; Time: O(n²); Space: O(1)
  - Step types: `compare`, `swap`

- Odd-Even Sort (Brick Sort)
  - Category: Group A
  - Stable: No; In-place: Yes; Time: O(n²); Space: O(1)
  - Step types: `compare`, `swap`; notes: odd/even phase indicator

- Stable Selection Sort (with shifts)
  - Category: Group A
  - Stable: Yes; In-place: No (needs shifting) or O(1) extra with trade-offs
  - Time: O(n²); Space: O(n) if using aux; Step types: `select`, `insert`, `compare`
  - Notes: reuse `insert` for element reposition

- Counting Sort
  - Category: Group B
  - Stable: Yes; In-place: No
  - Time: O(n + k); Space: O(n + k) (k = range)
  - Step types: `count` (tally), `write` (output), `collect` (prefix-sum)
  - UI: counts array panel; constrain data range or scale
  - Notes: our values are 10–300; feasible; add fallback when k large

- Radix Sort (LSD/MSD, base-10)
  - Category: Group B
  - Stable: Yes (with stable counting per digit); In-place: No
  - Time: O((n + b)·d); Space: O(n + b)
  - Step types: `bucket` (by digit), `collect`, `write`
  - UI: buckets panel; Notes: digit extractor utility; choose LSD first

- Bucket Sort
  - Category: Group B
  - Stable: Depends on bucket sort subroutine; In-place: No
  - Time: expected O(n) (distribution-dependent); Space: O(n)
  - Step types: `bucket` (assign), `insert` (within-bucket sort)
  - UI: buckets panel; Notes: consider insertion sort for each bucket

- Pigeonhole Sort
  - Category: Group B
  - Stable: Yes; In-place: No
  - Time: O(n + N) where N is value range; Space: O(N)
  - Step types: `count`/`write`
  - UI: holes panel similar to counting sort

- Natural Merge Sort (run detection)
  - Category: Group C (requires run highlighting)
  - Stable: Yes; In-place: No (array aux); Time: O(n log n)
  - Step types: `select` (runs), `merge`; UI: indicate discovered runs

- IntroSort (Quick + Heap + Insertion)
  - Category: Group C
  - Stable: No; In-place: Yes
  - Time: O(n log n) worst; Space: O(log n)
  - Step types: `select` (pivot), `compare`, `swap`, `note` (algorithm switch), optional `heapify`
  - UI: show recursion depth and switch threshold indicators

- TimSort
  - Category: Group C (complex)
  - Stable: Yes; In-place: No (aux merges)
  - Time: O(n) best (presorted), O(n log n) worst; Space: O(n)
  - Step types: `select` (runs), `merge`, `note` (galloping)
  - UI: run stack visualization recommended; schedule for later milestone

- Bitonic Sort / Sorting Network (optional)
  - Category: Group C (benefits from network diagram)
  - Stable: No; In-place: Yes; Time: O(n log² n)
  - Step types: `compare`, `swap`; UI: network overlay ideal; otherwise keep as odd-even first

- Tree Sort (BST-based)
  - Category: Group C (tree visualization)
  - Stable: No; In-place: No; Time: avg O(n log n), worst O(n²)
  - Step types: `insert` (tree), `collect`; UI: BST diagram recommended; defer unless tree view added

- Bogo Sort / Bozo Sort / Stooge Sort (novelty)
  - Category: Group D
  - Stable: N/A; In-place: varies; Time: enormous expected
  - Step types: `compare`, `swap`, `note` (attempts)
  - Guard: enforce max steps/time and explicit user confirmation

### Tooling/UX Updates to Support This Phase

- Extend `SortingStep['type']` (non-breaking): add `partition`, `heapify`, `count`, `bucket`, `collect`, `write`, `gap`, `note`.
- Add theme-aware colors for the new step types in CSS and integrate with `BarDisplay` mapping.
- Optional auxiliary visualization slot:
  - A right/left collapsible `AlgorithmOverlay` panel for buckets/counts/heap views; hidden for Group A.
- Configuration additions:
  - Quick Sort: pivot strategy toggle; Shell Sort: gap sequence selection; Radix: digit base.
- Safeguards:
  - Global max step/time budget for Group D; show warning before start.
- Data constraints:
  - For counting/radix/bucket sorts, ensure value ranges remain tractable; otherwise show guidance or auto-sample.

### Acceptance Criteria (Phase 7)
- At least 4 Group A algorithms implemented with step generators and worker integration.
- One Group B algorithm (Counting or Radix) implemented with an overlay panel and extended step types.
- Colors and a11y are preserved for all new step types; theme transitions remain smooth.
- CI build stays green; production deploy via Azure Static Web Apps continues to succeed.

## Theme Implementation Guidelines ⭐ **DEVELOPMENT STANDARDS**

### For All New Components
1. **Use Theme Variables**: Never hardcode colors - use CSS variables
2. **Theme Context Integration**: Connect to ThemeContext for state
3. **Smooth Transitions**: Implement 300ms ease transitions
4. **Accessibility First**: Ensure proper contrast in both themes
5. **Mobile Responsive**: Test themes on different screen sizes
6. **Performance**: Avoid layout shifts during theme changes

### CSS Implementation Pattern
```css
.new-component {
  background: var(--color-panel-background);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
  transition: var(--theme-transition-properties);
}

.new-component:hover {
  background: var(--color-hover);
  border-color: var(--color-border-strong);
}
```

### React Component Pattern
```tsx
import { useTheme } from '../context/ThemeContext';

const NewComponent = () => {
  const { theme } = useTheme();
  
  return (
    <div className="new-component">
      {/* Component content */}
    </div>
  );
};
```

### Quality Assurance Checklist
- [ ] Component responds to theme changes
- [ ] Smooth transitions between themes
- [ ] Proper contrast ratios (WCAG AA compliant)
- [ ] No layout shifts during theme changes
- [ ] Mobile and desktop compatibility
- [ ] Performance optimization
- [ ] Accessibility compliance in both themes

---

**Last Updated**: December 2024  
**Theme Status**: ✅ **FULLY IMPLEMENTED** - All new features must use theme system  
**Next Phase**: Additional algorithms and features (with theme integration required)

## Reality Check vs Implementation Status

While major phases are marked complete, a few items remain to reach a polished v1 and production deployment:

- Tests listed as complete are not yet present in the repo (unit, visual regression, a11y, perf).
- Pseudo-code highlighting is step-type based and does not map to specific lines.
- Step history with compression and replay is not implemented.
- Audio feedback is not implemented.
- Memory usage metric relies on `performance.memory` (Chromium-only); needs a cross-browser fallback or graceful handling.
- Minor bug in step-by-step Merge Sort (component step mode) selection logic versus worker implementation.
- CI/build and deployment automation are not yet configured.

## Remaining Tasks for v1

### Must-have
- [ ] Fix step-by-step Merge Sort in `SortingVisualizer.tsx` so ascending comparisons match worker logic.
- [ ] Add CI build workflow (Node 18) to ensure `npm ci && npm run build` passes for `Sorter/App.UI`.
- [ ] Prepare production build docs in `App.UI/README.md` (build/preview commands, troubleshooting).
- [ ] Configure and deploy to Azure Static Web Apps (Free) with correct paths:
  - App location: `Sorter/App.UI`
  - Output location: `dist`
- [ ] Ensure SPA fallback works on deep links/refresh (verify SWA default behavior; add config if needed).
- [ ] Verify Web Worker works in production build (no cross-origin worker issues).
- [ ] Basic a11y pass: keyboard navigation through controls, ARIA roles live regions sanity, no obvious contrast issues.
- [ ] Remove or gracefully hide memory usage metric when unsupported.

### MVP Quick Wins (Included)
- [ ] Invariant overlays per algorithm
  - Bubble/Selection: highlight last sorted suffix/prefix per pass.
  - Insertion: emphasize sorted prefix; highlight insertion position.
  - Merge: indicate active subarrays and merged range.
  - Toggle in UI; theme-aware colors and a11y labels.

- [ ] Stability demonstration mode
  - Tag equal values with stable IDs (e.g., A1, A2) and optional tiny labels.
  - Visually confirm stability (Insertion/Merge/Bubble stable) and non-stability (Selection).
  - Toggle labels for performance; announce changes via ARIA.

- [ ] Data pattern presets (input distributions)
  - Presets: Reversed, Nearly Sorted (slider %), Few Unique (k distinct), Organ Pipe, Sawtooth, Gaussian/Normal, Duplicates-heavy.
  - Add to `arrayUtils` and a small preset selector in `ControlPanel`.

- [ ] Step history + timeline scrubber
  - Next/Prev controls; slider to scrub steps.
  - Use diff-based history or sparse snapshots to limit memory.
  - Keep a conservative cap; show a clear reset.

- [ ] Split-view Algorithm Race (lightweight)
  - Side-by-side visualizers synchronized by seed and size.
  - Minimal charts (steps, comparisons, swaps, time) using simple bars.
  - Start/Pause/Reset in sync; ensure worker isolation per instance.

### Nice-to-have (soon after v1)
- [ ] Unit tests for algorithms (worker-level): correctness on sorted, reverse-sorted, nearly sorted arrays; comparisons/swaps sanity.
- [ ] Map `SortingStep` to pseudo-code line indices; highlight only the active line(s) in `AlgorithmExplanation`.
- [ ] Add a "Reset" control and ensure state machine transitions to `IDLE` cleanly.
- [ ] Make execution time meaningful in step mode (accumulate actual step time, or label separately).
- [ ] Automated a11y checks (e.g., axe) against key views.
- [ ] Basic Playwright e2e: load app, randomize, run each algorithm for a short array, assert no console errors.

### Later
- [ ] Step history compression + replay controls.
- [ ] Additional algorithms (e.g., Quick Sort, Heap Sort, Shell Sort).
- [ ] Algorithm comparison mode (run two algorithms side-by-side with synced seeds).
- [ ] Audio feedback with a mute toggle and reduced motion awareness.
- [ ] Performance benchmarking page with charts (theme-aware).

## Post‑MVP Potential Enhancements
- PWA + offline (service worker, cache `dist`, installability).
- Share/export/embeds (URL state encoding, JSON export, optional GIF/MP4 capture).
- Exact pseudo-code line mapping + recursion/call-stack tree visualizations.
- Custom algorithm playground (sandboxed worker, step API, time/step guards).
- Advanced overlays for non-comparison sorts (bucket/count panels generalized and themable).
- Lightweight benchmarking suite (multi-trials, distributions, aggregates, small charts).
- Specialized diagrams: heap tree, sorting networks, BST for Tree Sort.
- Haptics (mobile) and enhanced narration for accessibility.

## Deployment Plan: Azure Static Web Apps (Free)

### Overview
Host the SPA on Azure Static Web Apps Free tier for lowest cost, GitHub-driven CI/CD, free SSL, and simple custom domain support.

### Prerequisites
- Azure subscription and resource group.
- Source hosted on GitHub (main branch recommended for production).
- Local verification:
  - `cd Sorter/App.UI`
  - `npm install`
  - `npm run build`
  - `npm run preview` and sanity-check workers, theme persistence, sorting.

### Portal Setup (one-time)
1. Create resource → Static Web App.
2. Plan: Free. Region: closest to primary audience.
3. Source: GitHub; select repo and branch (e.g., `main`).
4. Build details:
   - App location: `Sorter/App.UI`
   - API location: (leave empty)
   - Output location: `dist`
5. Complete creation; the portal adds a GitHub Actions workflow with a publish token.

### GitHub Actions expectations
- Workflow should:
  - Check out code.
  - Use Node 18.
  - Run `npm ci` and `npm run build` in `Sorter/App.UI`.
  - Publish `dist` via `Azure/static-web-apps-deploy` action.

### SPA routing and headers (optional but recommended)
If you need explicit SPA fallback or security headers, add `staticwebapp.config.json` in `Sorter/App.UI`:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/favicon.ico"]
  },
  "globalHeaders": {
    "content-security-policy": "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; script-src 'self' 'unsafe-inline'"
  }
}
```

### Custom domain (optional)
1. In the SWA resource, add custom domain.
2. Create CNAME from your domain to the SWA default hostname.
3. Azure provisions free SSL cert automatically.

### Rollback
- Revert to a previous commit on the deployment branch and push; SWA redeploys automatically.

### Monitoring
- Use SWA Overview → Logs for deployment and runtime routing.
- Optionally add an external uptime check to the public URL.

## Acceptance Criteria (v1)
- Sorting works in production for Bubble, Selection, Insertion, and Merge (both run and step modes).
- No console errors; worker messages stream steps and complete correctly.
- Theme switching persists and respects system theme.
- SPA routes refresh correctly (index fallback) and direct links load.
- Basic keyboard navigation works; focus is visible; ARIA live regions announce updates.
- CI build passes on `main`; deploys automatically to SWA and is publicly accessible.

## Task Checklist (condensed)
- [ ] Fix Merge step-mode comparison logic in `SortingVisualizer.tsx`.
- [ ] Hide/guard memory usage when unsupported; label as N/A.
- [ ] Add GitHub Actions CI (build) and SWA deploy (portal-generated or verified).
- [ ] Verify production worker functionality and SPA fallback.
- [ ] Minimal a11y audit and README deployment notes.
- [ ] Tag v1 once deployed and validated.