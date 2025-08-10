import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BarDisplay from '../BarDisplay';
import { SortingStep } from '../../types/sorting';

const baseArray = [10, 20, 30, 40, 25, 15];

function makeStep(type: SortingStep['type'], indices: number[], values: number[], description: string): SortingStep {
  return { type, indices, values, description, timestamp: 0 };
}

describe('BarDisplay snapshots', () => {
  it('renders idle state', () => {
    const { container } = render(
      <BarDisplay array={baseArray} currentStep={null} isRunning={false} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders compare state', () => {
    const step = makeStep('compare', [1, 2], [baseArray[1], baseArray[2]], 'Comparing');
    const { container } = render(
      <BarDisplay array={baseArray} currentStep={step} isRunning={true} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders swap state', () => {
    const step = makeStep('swap', [2, 3], [baseArray[2], baseArray[3]], 'Swapping');
    const { container } = render(
      <BarDisplay array={baseArray} currentStep={step} isRunning={true} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders insert state', () => {
    const step = makeStep('insert', [1], [baseArray[1]], 'Inserting');
    const { container } = render(
      <BarDisplay array={baseArray} currentStep={step} isRunning={true} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders merge state', () => {
    const step = makeStep('merge', [0, 1], [baseArray[0], baseArray[1]], 'Merging');
    const { container } = render(
      <BarDisplay array={baseArray} currentStep={step} isRunning={true} />
    );
    expect(container).toMatchSnapshot();
  });
});


