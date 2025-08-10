import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
afterEach(() => {
  cleanup();
});

// Polyfill matchMedia for ThemeContext system detection in tests
if (typeof window !== 'undefined' && !window.matchMedia) {
  // @ts-expect-error minimal polyfill for tests
  window.matchMedia = (query: string) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
  };
}

// Polyfill ResizeObserver for Headless UI in jsdom
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  // @ts-expect-error test polyfill
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}


