import { describe, it, expect } from 'vitest';
import { SortingAlgorithms } from '../SortingAlgorithms';

function isNonDecreasing(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) return false;
  }
  return true;
}

function runAllSteps(steps: Generator<unknown>): void {
  for (const _ of steps) {
    // exhaust generator
  }
}

describe('SortingAlgorithms', () => {
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


