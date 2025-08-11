### Sorter UI Style Guide

This document captures the design tokens, global CSS, component style contracts, and the theme picker implementation used in the Sorter UI. You can:

- Copy the CSS blocks into your app’s global stylesheet
- Recreate the component DOM structure with the documented class names
- Use the Theme Provider and Theme Switcher below (or replicate the data-theme logic) to enable light/dark/system themes

If you feed this document to an AI, it should be able to reproduce the UI’s look and feel very closely.

---

### Design Principles

- Accessible by default: visible focus, high-contrast mode, reduced-motion support
- Themeable: light/dark via CSS variables on the root `data-theme` attribute
- Subtle shadows and rounded corners for surfaces
- Consistent sizing and spacing with utility classes

---

### How To Integrate Into Another Site

1) Load the Inter font and add global CSS

```css
/* In your global stylesheet */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
html, body { height: 100%; }
body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif; }
```

2) Add the theme tokens and base styles (copy the full blocks below into your global stylesheet)

3) Ensure the root element (documentElement or a top-level wrapper) carries `data-theme="light" | "dark"` (or nothing to use fallback). If you implement the Theme Provider below, this is handled for you.

4) Reuse the component DOM structures and class names shown in the Component Recipes.

5) Optional: Use the Theme Switcher implementation to provide a style picker to users.

---

### Theme Tokens (CSS Variables)

Place these at the top of your global stylesheet. They drive all colors, shadows, borders, and transitions.

```css
:root {
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;

  /* Theme transition control */
  --theme-transition-duration: 0.3s;
  --theme-transition-timing: ease;
  --theme-transition-properties: background-color, color, border-color, box-shadow;
}

/* Light theme (default) */
:root[data-theme="light"] {
  /* Background colors */
  --color-page-background: #ffffff;
  --color-panel-background: #f8fafc;
  --color-overlay-background: #ffffff;

  /* Text colors */
  --color-foreground: #0f172a;
  --color-foreground-muted: #475569;
  --color-foreground-subtle: #64748b;

  /* Border colors */
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --color-border-subtle: #f1f5f9;

  /* Accent colors */
  --color-accent: #3b82f6;
  --color-accent-foreground: #ffffff;

  /* Interactive colors */
  --color-hover: #f8fafc;
  --color-hover-strong: #f1f5f9;
  --color-active: #e2e8f0;

  /* Status colors */
  --color-success: #10b981;
  --color-success-foreground: #ffffff;
  --color-warning: #f59e0b;
  --color-warning-foreground: #ffffff;
  --color-error: #ef4444;
  --color-error-foreground: #ffffff;
  --color-info: #3b82f6;
  --color-info-foreground: #ffffff;

  /* Shadow colors */
  --color-shadow: rgba(0, 0, 0, 0.1);
  --color-shadow-strong: rgba(0, 0, 0, 0.15);
  --color-shadow-subtle: rgba(0, 0, 0, 0.05);

  /* Code colors */
  --color-code-background: #f1f5f9;
  --color-code-foreground: #0f172a;
  --color-code-border: #e2e8f0;

  /* Additional utility colors */
  --color-surface: #ffffff;
  --color-surface-hover: #f8fafc;
  --color-input-background: #ffffff;
  --color-input-border: #e2e8f0;
  --color-input-border-focus: #3b82f6;
  --color-disabled: #94a3b8;
  --color-disabled-foreground: #64748b;
}

/* Dark theme */
:root[data-theme="dark"] {
  /* Background colors */
  --color-page-background: #0f172a;
  --color-panel-background: #1e293b;
  --color-overlay-background: #334155;

  /* Text colors */
  --color-foreground: #f8fafc;
  --color-foreground-muted: #cbd5e1;
  --color-foreground-subtle: #94a3b8;

  /* Border colors */
  --color-border: #334155;
  --color-border-strong: #475569;
  --color-border-subtle: #1e293b;

  /* Accent colors */
  --color-accent: #60a5fa;
  --color-accent-foreground: #0f172a;

  /* Interactive colors */
  --color-hover: #1e293b;
  --color-hover-strong: #334155;
  --color-active: #475569;

  /* Status colors */
  --color-success: #34d399;
  --color-success-foreground: #0f172a;
  --color-warning: #fbbf24;
  --color-warning-foreground: #0f172a;
  --color-error: #f87171;
  --color-error-foreground: #0f172a;
  --color-info: #60a5fa;
  --color-info-foreground: #0f172a;

  /* Shadow colors */
  --color-shadow: rgba(0, 0, 0, 0.3);
  --color-shadow-strong: rgba(0, 0, 0, 0.4);
  --color-shadow-subtle: rgba(0, 0, 0, 0.2);

  /* Code colors */
  --color-code-background: #334155;
  --color-code-foreground: #f8fafc;
  --color-code-border: #475569;

  /* Additional utility colors */
  --color-surface: #1e293b;
  --color-surface-hover: #334155;
  --color-input-background: #1e293b;
  --color-input-border: #475569;
  --color-input-border-focus: #60a5fa;
  --color-disabled: #475569;
  --color-disabled-foreground: #64748b;
}

/* Fallback when data-theme is not set */
:root:not([data-theme]) {
  --color-page-background: #ffffff;
  --color-panel-background: #f8fafc;
  --color-overlay-background: #ffffff;
  --color-foreground: #0f172a;
  --color-foreground-muted: #475569;
  --color-foreground-subtle: #64748b;
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --color-border-subtle: #f1f5f9;
  --color-accent: #3b82f6;
  --color-accent-foreground: #ffffff;
  --color-hover: #f8fafc;
  --color-hover-strong: #f1f5f9;
  --color-active: #e2e8f0;
  --color-success: #10b981;
  --color-success-foreground: #ffffff;
  --color-warning: #f59e0b;
  --color-warning-foreground: #ffffff;
  --color-error: #ef4444;
  --color-error-foreground: #ffffff;
  --color-info: #3b82f6;
  --color-info-foreground: #ffffff;
  --color-shadow: rgba(0, 0, 0, 0.1);
  --color-shadow-strong: rgba(0, 0, 0, 0.15);
  --color-shadow-subtle: rgba(0, 0, 0, 0.05);
  --color-code-background: #f1f5f9;
  --color-code-foreground: #0f172a;
  --color-code-border: #e2e8f0;
  --color-surface: #ffffff;
  --color-surface-hover: #f8fafc;
  --color-input-background: #ffffff;
  --color-input-border: #e2e8f0;
  --color-input-border-focus: #3b82f6;
  --color-disabled: #94a3b8;
  --color-disabled-foreground: #64748b;
}
```

---

### Global Base Styles and A11y

Copy these into your global stylesheet after the tokens.

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--color-page-background);
  color: var(--color-foreground);
  transition: background-color var(--theme-transition-duration) var(--theme-transition-timing),
              color var(--theme-transition-duration) var(--theme-transition-timing);
}
h1, h2, h3, h4, h5, h6 { color: var(--color-foreground); transition: color 0.3s ease; }

/* Smooth theme transitions */
*, *::before, *::after {
  transition-property: var(--theme-transition-properties);
  transition-timing-function: var(--theme-transition-timing);
  transition-duration: var(--theme-transition-duration);
}

/* Focus visibility */
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

/* Selection */
::selection { background-color: var(--color-accent); color: var(--color-accent-foreground); }

/* Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--color-panel-background); }
::-webkit-scrollbar-thumb { background: var(--color-border-strong); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-border); }

/* Inputs inherit theme */
input, textarea, select, button {
  color: var(--color-foreground);
  background-color: var(--color-input-background);
  border-color: var(--color-input-border);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root { --theme-transition-duration: 0s; }
  *, *::before, *::after { transition: none !important; animation: none !important; }
}

/* High contrast support */
@media (prefers-contrast: high) {
  :focus-visible { outline: 3px solid var(--color-foreground); outline-offset: 3px; }
  * { border-color: var(--color-border-strong) !important; }
}
```

Optional gradient background helper (requires accent alpha tokens if you use Radix color tokens):

```css
.gradient-bg {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--accent-a5) 100%, transparent),
    color-mix(in srgb, var(--accent-a8) 100%, transparent)
  );
  transition: background 0.3s ease;
}
```

---

### Utility Classes

```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.justify-between { justify-content: space-between; }
.text-sm { font-size: 0.875rem; }
.font-semibold { font-weight: 600; }
.text-gray-500 { color: var(--color-foreground-muted); }
```

---

### Component Recipes (DOM + Classes)

Below are the primary UI building blocks and their expected class names. Reuse these structures to inherit the styling defined further below.

- Sorting Visualizer Layout

```html
<div class="sorting-visualizer">
  <header class="visualizer-header">
    <div class="header-content">
      <div class="header-text">
        <h1>Sorting Algorithm Visualizer</h1>
        <p>Subtitle text</p>
      </div>
      <div class="header-controls">
        <!-- Theme Switcher goes here -->
      </div>
    </div>
  </header>

  <div class="visualizer-content">
    <div class="control-section">
      <!-- ControlPanel content -->
    </div>
    <div class="visualization-section">
      <!-- BarDisplay content -->
    </div>
    <div class="explanation-section">
      <!-- AlgorithmExplanation content -->
    </div>
  </div>
  
</div>
```

- Control Panel

```html
<aside class="control-panel">
  <section class="control-section">
    <h2>Section Title</h2>
    <!-- selectors, sliders, buttons -->
  </section>
</aside>
```

- Buttons

```html
<button class="btn btn-soft">Soft</button>
<button class="btn btn-solid">Solid</button>
<button class="btn btn-green">Confirm</button>
<button class="btn btn-blue">Info</button>
<button class="btn btn-yellow">Pause</button>
<button class="btn btn-red">Danger</button>
<button class="btn btn-gray">Muted</button>
```

- Headless UI Select (Algorithm picker)

```html
<button class="select-trigger">Current value</button>
<div class="select-options">
  <button class="select-option select-option-active">Option A</button>
  <button class="select-option select-option-selected">Option B</button>
</div>
```

- Dropdown Menu (Theme picker)

```html
<div class="dropdown-container">
  <button class="dropdown-trigger">Theme ▼</button>
  <div class="dropdown-items">
    <button class="dropdown-item">☀️ Light</button>
    <button class="dropdown-item">🌙 Dark</button>
    <button class="dropdown-item">🖥️ System</button>
  </div>
</div>
```

- Sliders

```html
<input type="range" class="speed-slider" />
<input type="range" class="array-size-slider" />
```

- Bar Display

```html
<div class="bar-display">
  <div class="bar-container">
    <div class="bar" style="height: 50%"></div>
    <!-- repeat for each bar -->
  </div>
  <div class="step-indicator">
    <div class="step-type">COMPARE</div>
    <div class="step-description">Comparing values...</div>
  </div>
  <div class="array-info">
    <span class="text-sm">Array Size: 100</span>
    <span class="text-sm">Range: 1 - 1000</span>
  </div>
</div>
```

- Algorithm Explanation

```html
<aside class="algorithm-explanation">
  <header class="explanation-header">
    <h2 class="algorithm-title">Bubble Sort</h2>
    <p class="algorithm-description">Description…</p>
  </header>
  <section class="pseudo-code-section">
    <h3 class="section-title">Pseudo-code</h3>
    <div class="pseudo-code">
      <div class="code-line highlight-compare">
        <span class="line-number">1</span>
        <span class="line-content">for i in …</span>
      </div>
    </div>
  </section>
</aside>
```

---

### Component Styles (Copy/Paste)

Paste these styles into your CSS to reproduce the exact visuals.

Sorting Visualizer Layout

```css
.sorting-visualizer { min-height: 100vh; background: var(--color-page-background); color: var(--color-foreground); }
.visualizer-header { padding: 2rem 1rem; background: var(--color-panel-background); color: var(--color-foreground); box-shadow: 0 2px 4px var(--color-shadow); border-bottom: 1px solid var(--color-border); }
.header-content { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 2rem; }
.header-text { text-align: left; flex: 1; }
.header-controls { flex-shrink: 0; display: flex; align-items: center; }
.visualizer-header h1 { margin: 0 0 0.5rem 0; font-size: 2.5rem; font-weight: 700; letter-spacing: -0.025em; color: var(--color-foreground); }
.visualizer-header p { margin: 0; font-size: 1.125rem; color: var(--color-foreground-muted); max-width: 600px; }
.visualizer-content { max-width: 1400px; margin: 0 auto; padding: 2rem 1rem; display: grid; grid-template-columns: 1fr; gap: 2rem; }
.visualization-section { min-height: 400px; background: var(--color-panel-background); border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px var(--color-shadow-subtle); border: 1px solid var(--color-border); }
@media (min-width: 768px) { .visualizer-content { grid-template-columns: 300px 1fr; } }
@media (min-width: 1024px) { .visualizer-content { grid-template-columns: 350px 1fr 350px; } .explanation-section { grid-column: 3; } }
```

Control Panel and Controls

```css
.control-panel { background: var(--color-panel-background); border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px var(--color-shadow); border: 1px solid var(--color-border); height: 1200px; overflow-y: auto; position: sticky; top: 2rem; display: flex; flex-direction: column; }
.control-section { margin-bottom: 2rem; display: flex; flex-direction: column; }
.control-section h2 { margin: 0 0 1rem 0; font-size: 1.25rem; font-weight: 600; color: var(--color-foreground); border-bottom: 2px solid var(--color-accent); padding-bottom: 0.5rem; }

/* Buttons */
.btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; line-height: 1; min-height: 44px; font-family: inherit; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn:focus { outline: none; box-shadow: 0 0 0 3px var(--color-shadow); }
.btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.btn-soft { background: var(--color-panel-background); color: var(--color-foreground); border: 1px solid var(--color-border); box-shadow: 0 1px 3px var(--color-shadow); }
.btn-soft:hover:not(:disabled) { background: var(--color-hover); border-color: var(--color-border-strong); box-shadow: 0 2px 6px var(--color-shadow-strong); transform: translateY(-1px); }
.btn-solid { background: var(--color-accent); color: var(--color-accent-foreground); box-shadow: 0 1px 3px var(--color-shadow); }
.btn-solid:hover:not(:disabled) { background: var(--color-hover-strong); box-shadow: 0 2px 6px var(--color-shadow-strong); transform: translateY(-1px); }
.btn-green { background: var(--color-success); color: var(--color-success-foreground); box-shadow: 0 1px 3px var(--color-shadow); }
.btn-blue { background: var(--color-info); color: var(--color-info-foreground); box-shadow: 0 1px 3px var(--color-shadow); }
.btn-yellow { background: var(--color-warning); color: var(--color-warning-foreground); box-shadow: 0 1px 3px var(--color-shadow); }
.btn-red { background: var(--color-error); color: var(--color-error-foreground); box-shadow: 0 1px 3px var(--color-shadow); }
.btn-gray { background: var(--color-foreground-muted); color: var(--color-panel-background); box-shadow: 0 1px 3px var(--color-shadow); }

/* Select (Headless UI Listbox) */
.select-trigger { background-color: var(--color-panel-background); color: var(--color-foreground); border: 2px solid var(--color-border); border-radius: 8px; padding: 0.75rem; font-size: 0.875rem; min-height: 44px; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; cursor: pointer; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.select-trigger:hover { border-color: var(--color-border-strong); background-color: var(--color-hover); }
.select-trigger:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-shadow); }
.select-options { background-color: var(--color-overlay-background); border: 1px solid var(--color-border); border-radius: 8px; box-shadow: 0 4px 12px var(--color-shadow-strong); padding: 0.5rem; min-width: 200px; max-height: 300px; overflow-y: auto; z-index: 50; }
.select-option { color: var(--color-foreground); background-color: transparent; border-radius: 6px; padding: 0.75rem 1rem; cursor: pointer; transition: background-color 0.15s ease; font-size: 0.875rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin: 0.125rem 0; width: 100%; text-align: left; border: none; outline: none; }
.select-option:hover, .select-option-active { background-color: var(--color-hover); }
.select-option-selected { background-color: var(--color-accent); color: var(--color-accent-foreground); }

/* Dropdown (Theme switcher) */
.dropdown-container { position: relative; display: inline-block; }
.dropdown-trigger { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 500; transition: all 0.2s ease; background: var(--color-panel-background); color: var(--color-foreground); border: 1px solid var(--color-border); cursor: pointer; }
.dropdown-trigger:hover { background: var(--color-hover); border-color: var(--color-border-strong); transform: translateY(-1px); box-shadow: 0 2px 6px var(--color-shadow-strong); }
.dropdown-trigger:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-shadow); }
.dropdown-items { position: absolute; top: 100%; right: 0; background-color: var(--color-overlay-background); border: 1px solid var(--color-border); border-radius: 8px; box-shadow: 0 4px 12px var(--color-shadow-strong); padding: 0.5rem; min-width: 200px; z-index: 50; margin-top: 0.25rem; }
.dropdown-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border-radius: 6px; cursor: pointer; transition: background-color 0.15s ease; font-size: 0.875rem; margin: 0.125rem 0; border: none; outline: none; width: 100%; text-align: left; background: transparent; color: var(--color-foreground); }
.dropdown-item:hover, .dropdown-item-active { background-color: var(--color-hover); }
.dropdown-item-selected { background-color: var(--color-accent); color: var(--color-accent-foreground); }

/* Sliders */
.speed-slider, .array-size-slider { width: 100%; height: 6px; border-radius: 3px; background: var(--color-border); outline: none; -webkit-appearance: none; appearance: none; transition: background-color 0.3s ease; }
.speed-slider::-webkit-slider-thumb, .array-size-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--color-accent); cursor: pointer; border: 2px solid var(--color-panel-background); box-shadow: 0 2px 4px var(--color-shadow); transition: all 0.2s ease; }
.speed-slider::-moz-range-thumb, .array-size-slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: var(--color-accent); cursor: pointer; border: 2px solid var(--color-panel-background); box-shadow: 0 2px 4px var(--color-shadow); transition: all 0.2s ease; }
.speed-slider:focus, .array-size-slider:focus { outline: none; box-shadow: 0 0 0 3px var(--color-shadow); }
```

Bar Display

```css
.bar-display { width: 100%; height: 1200px; display: flex; flex-direction: column; position: relative; --bar-default-color: var(--color-foreground-muted); --bar-compare-color: var(--color-info); --bar-swap-color: var(--color-error); --bar-select-color: var(--color-warning); --bar-insert-color: var(--color-success); --bar-merge-color: var(--color-accent); --bar-sorted-color: var(--color-success); --bar-active-color: var(--color-info); --bar-border-color: var(--color-foreground); --bar-count-color: var(--color-warning); --bar-collect-color: var(--color-accent); --bar-write-color: var(--color-success); --bar-note-color: var(--color-foreground-subtle); }
.bar-container { flex: 1; display: flex; align-items: flex-end; justify-content: center; padding: 24px; position: relative; overflow: hidden; background: var(--color-panel-background); border: 1px solid var(--color-border); border-radius: 8px; }
.bar { border-radius: 2px 2px 0 0; min-height: 4px; position: relative; cursor: pointer; box-shadow: 0 1px 3px var(--color-shadow); transition: none; }
.bar:hover { transform: scaleY(1.05); box-shadow: 0 2px 6px var(--color-shadow-strong); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.step-indicator { position: absolute; top: 1rem; left: 50%; transform: translateX(-50%); background: var(--color-panel-background); border: 2px solid var(--color-accent); border-radius: 8px; padding: 0.75rem 1rem; box-shadow: 0 4px 6px var(--color-shadow); z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; min-width: 200px; }
.step-type { font-size: 0.75rem; font-weight: 700; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em; }
.step-description { font-size: 0.875rem; color: var(--color-foreground); text-align: center; line-height: 1.3; }
.array-info { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--color-panel-background); border-top: 1px solid var(--color-border); font-size: 0.875rem; color: var(--color-foreground-muted); }
@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px)} 75%{transform:translateX(2px)} }
@keyframes slideIn { 0%{ transform: translateY(-10px); opacity: 0; } 100%{ transform: translateY(0); opacity: 1; } }
@keyframes glow { 0%,100%{ box-shadow: 0 1px 3px var(--color-shadow);} 50%{ box-shadow: 0 0 20px var(--bar-merge-color);} }
.bar.animate-compare { animation: pulse 0.5s ease-in-out; }
.bar.animate-swap { animation: shake 0.3s ease-in-out; }
.bar.animate-insert { animation: slideIn 0.4s ease-out; }
.bar.animate-merge { animation: glow 0.6s ease-in-out; }
```

Algorithm Explanation Panel

```css
.algorithm-explanation { background: var(--color-panel-background); border: 1px solid var(--color-border); border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px var(--color-shadow); height: 1200px; overflow-y: auto; }
.explanation-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid var(--color-accent); }
.algorithm-title { margin: 0 0 8px 0; color: var(--color-foreground); font-size: 1.5rem; font-weight: 600; }
.algorithm-description { margin: 0; color: var(--color-foreground-muted); line-height: 1.6; font-size: 0.95rem; }
.section-title { margin: 0 0 16px 0; color: var(--color-foreground); font-size: 1.1rem; font-weight: 600; }
.pseudo-code { background: var(--color-panel-background); border: 1px solid var(--color-border); border-radius: 8px; padding: 16px; font-family: 'Monaco','Menlo','Ubuntu Mono', monospace; font-size: 0.9rem; line-height: 1.5; }
.code-line { display: flex; align-items: center; padding: 4px 8px; border-radius: 4px; transition: background-color 0.2s ease; }
.code-line:hover { background-color: var(--color-hover); }
.line-number { color: var(--color-foreground-subtle); font-size: 0.8rem; min-width: 30px; margin-right: 12px; user-select: none; }
.line-content { color: var(--color-foreground); flex: 1; }
.highlight-compare { background-color: var(--color-hover); border-left: 3px solid var(--color-warning); }
.highlight-swap { background-color: var(--color-hover); border-left: 3px solid var(--color-error); }
.highlight-select { background-color: var(--color-hover); border-left: 3px solid var(--color-info); }
.highlight-insert { background-color: var(--color-hover); border-left: 3px solid var(--color-success); }
.highlight-merge { background-color: var(--color-hover); border-left: 3px solid var(--color-accent); }
```

---

### Theme Picker (Style Picker)

You can either implement a minimal toggle that sets `data-theme` on `document.documentElement`, or reuse the following React-based provider and switcher.

Theme Context and Provider

```tsx
// ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'

export interface ThemeContextType {
  appearance: 'light' | 'dark' | 'system'
  setAppearance: (appearance: 'light' | 'dark' | 'system') => void
  resolvedAppearance: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | null>(null)
const THEME_STORAGE_KEY = 'sorter-theme-preferences'

type ThemePreferences = { appearance: 'light' | 'dark' | 'system' }
type ThemeProviderProps = { children: (theme: ThemeContextType) => React.ReactNode }

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preferences, setPreferences] = useState<ThemePreferences>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object' && ['light','dark','system'].includes(parsed.appearance)) {
          return parsed
        }
      }
    } catch {}
    return { appearance: 'system' }
  })

  const [resolvedAppearance, setResolvedAppearance] = useState<'light' | 'dark'>(() => {
    try {
      if (preferences.appearance === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return preferences.appearance
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    try { localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences)) } catch {}
  }, [preferences])

  useEffect(() => {
    try { document.documentElement.setAttribute('data-theme', resolvedAppearance) } catch {}
  }, [resolvedAppearance])

  useEffect(() => {
    if (preferences.appearance !== 'system') return
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        const newAppearance = e.matches ? 'dark' : 'light'
        setResolvedAppearance(newAppearance)
        document.documentElement.setAttribute('data-theme', newAppearance)
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } catch {}
  }, [preferences.appearance])

  const value: ThemeContextType = {
    appearance: preferences.appearance,
    setAppearance: (appearance) => {
      try {
        setPreferences(prev => ({ ...prev, appearance }))
        if (appearance !== 'system') setResolvedAppearance(appearance)
        else setResolvedAppearance(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      } catch {}
    },
    resolvedAppearance,
  }

  return <ThemeContext.Provider value={value}>{children(value)}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return { appearance: 'light' as const, setAppearance: () => {}, resolvedAppearance: 'light' as const }
  }
  return context
}
```

Theme Switcher (Headless UI Menu)

```tsx
// ThemeSwitcher.tsx
import { Menu } from '@headlessui/react'
import { useTheme } from './ThemeContext'

interface ThemeSwitcherProps {
  appearance: 'light' | 'dark' | 'system'
  onAppearanceChange: (appearance: 'light' | 'dark' | 'system') => void
}

export function ThemeSwitcher({ appearance, onAppearanceChange }: ThemeSwitcherProps) {
  useTheme() // ensure context is initialized

  const getAppearanceIcon = () => appearance === 'dark' ? '🌙' : appearance === 'system' ? '🖥️' : '☀️'

  return (
    <Menu as="div" className="dropdown-container">
      <Menu.Button className="dropdown-trigger">
        {getAppearanceIcon()}<span style={{ marginInline: 4 }}>Theme</span><span>▼</span>
      </Menu.Button>
      <Menu.Items className="dropdown-items">
        <Menu.Item>{({ active }) => (
          <button className={`dropdown-item ${active ? 'dropdown-item-active' : ''}`} onClick={() => onAppearanceChange('light')}>☀️ Light</button>
        )}</Menu.Item>
        <Menu.Item>{({ active }) => (
          <button className={`dropdown-item ${active ? 'dropdown-item-active' : ''}`} onClick={() => onAppearanceChange('dark')}>🌙 Dark</button>
        )}</Menu.Item>
        <Menu.Item>{({ active }) => (
          <button className={`dropdown-item ${active ? 'dropdown-item-active' : ''}`} onClick={() => onAppearanceChange('system')}>🖥️ System</button>
        )}</Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
```

Usage

```tsx
// Wrap your app
import { ThemeProvider } from './ThemeContext'
import { ThemeSwitcher } from './ThemeSwitcher'

function App() {
  return (
    <ThemeProvider>
      {(theme) => (
        <div data-theme={theme.resolvedAppearance}>
          <header>
            <ThemeSwitcher appearance={theme.appearance} onAppearanceChange={theme.setAppearance} />
          </header>
          {/* rest of app */}
        </div>
      )}
    </ThemeProvider>
  )
}
```

---

### Notes and Gotchas

- The gradient helper uses `--accent-a5` and `--accent-a8` tokens from Radix color scales. If you don’t use Radix, replace them with semi-transparent versions of your `--color-accent`.
- Buttons and surfaces rely on subtle shadows; ensure your background colors provide enough contrast in both themes.
- Focus outlines are intentionally visible for accessibility.
- High-contrast and reduced-motion media queries are supported and recommended to keep.

---

### Checklist for Porting

- Copy Theme Tokens and Global Base Styles
- Copy Component Styles (visualizer layout, control panel, buttons, selects, dropdowns, sliders, bar display, algorithm explanation)
- Reuse DOM structures and class names from Component Recipes
- Add Theme Provider and Theme Switcher (or implement a minimal setter for `data-theme`)
- Load Inter font


