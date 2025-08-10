import { describe, it, expect } from 'vitest';
import { SortingAlgorithms } from '../../algorithms/SortingAlgorithms';

function consume<T>(gen: Generator<T>): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const __ of gen) { /* no-op */ }
}

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 1000));
}

describe('Algorithm micro-benchmarks (sanity)', () => {
  it('runs bubble/selection/insertion/merge quickly on small arrays', () => {
    const algo = new SortingAlgorithms();
    const sizes = [10, 50, 100];
    const limitsMs: Record<number, number> = { 10: 10, 50: 50, 100: 200 };

    for (const size of sizes) {
      const arr = randomArray(size);
      const cases = [
        () => consume(algo.bubbleSort([...arr])),
        () => consume(algo.selectionSort([...arr])),
        () => consume(algo.insertionSort([...arr])),
        () => consume(algo.mergeSort([...arr])),
      ];
      for (const run of cases) {
        const start = performance.now();
        run();
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(limitsMs[size]);
      }
    }
  });
});


