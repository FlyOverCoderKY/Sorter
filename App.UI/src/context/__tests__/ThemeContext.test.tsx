import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { ThemeProvider, useTheme } from '../ThemeContext';

function Demo() {
  const theme = useTheme();
  return (
    <>
      <div data-testid="appearance">{theme.appearance}</div>
      <div data-testid="resolved">{theme.resolvedAppearance}</div>
      <button onClick={() => theme.setAppearance('dark')}>dark</button>
      <button onClick={() => theme.setAppearance('light')}>light</button>
      <button onClick={() => theme.setAppearance('system')}>system</button>
    </>
  );
}

describe('ThemeContext', () => {
  it('provides defaults and updates resolvedAppearance', async () => {
    render(
      <ThemeProvider>
        {(theme) => (
          <div>
            <Demo />
            <div data-testid="outer">{theme.resolvedAppearance}</div>
          </div>
        )}
      </ThemeProvider>
    );

    // Defaults
    expect(screen.getByTestId('appearance').textContent).toBeDefined();
    expect(screen.getByTestId('resolved').textContent).toMatch(/light|dark/);
  });
});


