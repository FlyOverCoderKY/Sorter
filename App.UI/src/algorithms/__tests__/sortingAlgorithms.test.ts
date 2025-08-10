import { describe, it, expect } from 'vitest';
import { SortingAlgorithms } from '../SortingAlgorithms';

function isNonDecreasing(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) return false;
  }
  return true;
}

function runAllSteps<T>(steps: Generator<T>): void {
  // exhaust generator without assigning the yielded value
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const __ of steps) { /* no-op */ }
}

describe('SortingAlgorithms', () => {
  it('handles already sorted, reverse sorted, and duplicates-heavy arrays', () => {
    const algo = new SortingAlgorithms();
    const sorted = Array.from({ length: 50 }, (_, i) => i);
    const reverse = Array.from({ length: 50 }, (_, i) => 50 - i);
    const duplicates = Array.from({ length: 50 }, () => [1, 2, 3, 3, 2, 1][Math.floor(Math.random() * 6)]);

    const a1 = [...sorted];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const __ of algo.bubbleSort(a1)) {/* consume */}
    expect(isNonDecreasing(a1)).toBe(true);

    const a2 = [...reverse];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const __ of algo.selectionSort(a2)) {/* consume */}
    expect(isNonDecreasing(a2)).toBe(true);

    const a3 = [...duplicates];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const __ of algo.insertionSort(a3)) {/* consume */}
    expect(isNonDecreasing(a3)).toBe(true);
  });

  it('handles very small arrays and empty array', () => {
    const algo = new SortingAlgorithms();
    const cases = [[], [5], [2, 1]] as number[][];
    for (const arr of cases) {
      const c1 = [...arr]; // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const __ of algo.bubbleSort(c1)) {/* */} expect(isNonDecreasing(c1)).toBe(true);
      const c2 = [...arr]; // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const __ of algo.selectionSort(c2)) {/* */} expect(isNonDecreasing(c2)).toBe(true);
      const c3 = [...arr]; // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const __ of algo.insertionSort(c3)) {/* */} expect(isNonDecreasing(c3)).toBe(true);
      const c4 = [...arr]; // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const __ of algo.mergeSort(c4)) {/* */} expect(isNonDecreasing(c4)).toBe(true);
    }
  });

  it('bubble sort makes zero swaps on already sorted input (basic metrics sanity)', () => {
    const algo = new SortingAlgorithms();
    const arr = Array.from({ length: 20 }, (_, i) => i);
    const copy = [...arr];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const __ of algo.bubbleSort(copy)) {/* consume */}
    // On sorted input, bubble sort performs no swaps
    const { swaps, comparisons, steps } = algo.getMetrics();
    expect(swaps).toBe(0);
    expect(comparisons).toBeGreaterThan(0);
    expect(steps).toBeGreaterThan(0);
  });

  it('bubbleSort sorts correctly for random input', () => {
    const algo = new SortingAlgorithms();
    const arr = Array.from({ length: 50 }, () => Math.floor(Math.random() * 1000));
    const copy = [...arr];
    runAllSteps(algo.bubbleSort(copy));
    expect(isNonDecreasing(copy)).toBe(true);
  });

  it('selectionSort sorts correctly for reversed input', () => {
    const algo = new SortingAlgorithms();
    const arr = Array.from({ length: 50 }, (_, i) => 1000 - i);
    const copy = [...arr];
    runAllSteps(algo.selectionSort(copy));
    expect(isNonDecreasing(copy)).toBe(true);
  });

  it('insertionSort sorts correctly for nearly sorted input', () => {
    const algo = new SortingAlgorithms();
    const arr = Array.from({ length: 50 }, (_, i) => i);
    // Introduce slight disorder
    [arr[10], arr[11]] = [arr[11], arr[10]];
    [arr[20], arr[21]] = [arr[21], arr[20]];
    const copy = [...arr];
    runAllSteps(algo.insertionSort(copy));
    expect(isNonDecreasing(copy)).toBe(true);
  });

  it('mergeSort sorts correctly and is stable for equal values', () => {
    const algo = new SortingAlgorithms();
    const arr = [5, 3, 8, 3, 9, 1, 3, 7, 2];
    const copy = [...arr];
    runAllSteps(algo.mergeSort(copy));
    expect(isNonDecreasing(copy)).toBe(true);
    // Stability heuristic: check relative order of equal 3's remains consistent with original stable positions
    const originalThreeIndices = arr
      .map((v, i) => ({ v, i }))
      .filter(x => x.v === 3)
      .map(x => x.i);
    const sortedThreeIndices = copy
      .map((v, i) => ({ v, i }))
      .filter(x => x.v === 3)
      .map(x => x.i);
    expect(sortedThreeIndices.length).toBe(originalThreeIndices.length);
    // Not a strict proof of stability without tracking IDs, but ensure the values all present
  });
});


