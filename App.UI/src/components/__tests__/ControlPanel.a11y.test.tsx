import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'jest-axe';
import ControlPanel from '../ControlPanel';
import SortingVisualizer from '../../components/SortingVisualizer';
import { ThemeProvider } from '../../context/ThemeContext';

// Note: This is a lightweight static render a11y test to catch obvious issues in markup.
// Full axe audits via Playwright are suggested for end-to-end coverage.

describe('ControlPanel accessibility (static render)', () => {
  it('has no detectable a11y violations in static markup', async () => {
    const { container } = render(
      <ControlPanel
        currentAlgorithm={'bubble'}
        speed={100}
        arraySize={50}
        metrics={{ steps: 0, comparisons: 0, swaps: 0, executionTime: 0, memoryUsage: 0 }}
        isRunning={false}
        isPaused={false}
        onAlgorithmChange={() => {}}
        onSpeedChange={() => {}}
        onArraySizeChange={() => {}}
        onGenerateArray={() => {}}
        onStartSort={() => {}}
        onPauseSort={() => {}}
        onResumeSort={() => {}}
        onCancelSort={() => {}}
        onStepSort={() => {}}
      />
    );

    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });

  it('main view has no critical a11y violations (static render)', async () => {
    const { container } = render(
      <ThemeProvider>
        {() => <SortingVisualizer />}
      </ThemeProvider>
    );

    const results = await axe(container);
    // Allow non-critical findings but ensure none are marked as serious/critical
    const serious = results.violations.filter(v => ['serious', 'critical'].includes(v.impact || ''));
    expect(serious.length).toBe(0);
  });
});


