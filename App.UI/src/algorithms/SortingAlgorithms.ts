import { SortingStep, PerformanceMetrics } from '../types/sorting';

/**
 * SortingAlgorithms encapsulates step-generating implementations for all
 * supported algorithms. It is framework and environment agnostic so it can be
 * reused by both the Web Worker and unit tests.
 */
export class SortingAlgorithms {
  private metrics: PerformanceMetrics = {
    steps: 0,
    comparisons: 0,
    swaps: 0,
    executionTime: 0,
    memoryUsage: 0,
  };

  private startTime: number = 0;

  setStartTime(time: number): void {
    this.startTime = time;
  }

  getStartTime(): number {
    return this.startTime;
  }

  resetMetrics(): void {
    this.metrics = {
      steps: 0,
      comparisons: 0,
      executionTime: 0,
      swaps: 0,
      memoryUsage: 0,
    };
  }

  private updateMemoryUsage(): void {
    // performance.memory is Chromium-only; guard for cross-env tests
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const used = (performance as any).memory?.usedJSHeapSize;
      if (typeof used === 'number') {
        this.metrics.memoryUsage = used;
      }
    }
  }

  private addStep(
    type: SortingStep['type'],
    indices: number[],
    values: number[],
    description: string,
  ): SortingStep {
    this.metrics.steps += 1;
    this.updateMemoryUsage();
    return {
      type,
      indices,
      values,
      description,
      timestamp: Date.now(),
    };
  }

  private compare(a: number, b: number): boolean {
    this.metrics.comparisons += 1;
    return a > b;
  }

  private swap(arr: number[], i: number, j: number): void {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    this.metrics.swaps += 1;
  }

  // Bubble Sort
  *bubbleSort(arr: number[]): Generator<SortingStep> {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        yield this.addStep(
          'compare',
          [j, j + 1],
          [arr[j], arr[j + 1]],
          `Comparing elements at positions ${j} and ${j + 1}`,
        );
        if (this.compare(arr[j], arr[j + 1])) {
          yield this.addStep(
            'swap',
            [j, j + 1],
            [arr[j], arr[j + 1]],
            `Swapping elements at positions ${j} and ${j + 1}`,
          );
          this.swap(arr, j, j + 1);
        }
      }
    }
  }

  // Selection Sort
  *selectionSort(arr: number[]): Generator<SortingStep> {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        yield this.addStep(
          'compare',
          [minIndex, j],
          [arr[minIndex], arr[j]],
          `Comparing element at position ${minIndex} with element at position ${j}`,
        );
        if (this.compare(arr[minIndex], arr[j])) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        yield this.addStep(
          'swap',
          [i, minIndex],
          [arr[i], arr[minIndex]],
          `Swapping minimum element from position ${minIndex} to position ${i}`,
        );
        this.swap(arr, i, minIndex);
      }
    }
  }

  // Insertion Sort
  *insertionSort(arr: number[]): Generator<SortingStep> {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      yield this.addStep('select', [i], [key], `Selecting element at position ${i} (value: ${key})`);
      while (j >= 0 && this.compare(arr[j], key)) {
        yield this.addStep('compare', [j, j + 1], [arr[j], key], `Comparing element at position ${j} with selected key`);
        arr[j + 1] = arr[j];
        j -= 1;
      }
      arr[j + 1] = key;
      yield this.addStep('insert', [j + 1], [key], `Inserting key at position ${j + 1}`);
    }
  }

  // Merge Sort
  *mergeSort(arr: number[]): Generator<SortingStep> {
    yield* this.mergeSortHelper(arr, 0, arr.length - 1);
  }

  private *mergeSortHelper(arr: number[], left: number, right: number): Generator<SortingStep> {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      yield* this.mergeSortHelper(arr, left, mid);
      yield* this.mergeSortHelper(arr, mid + 1, right);
      yield* this.merge(arr, left, mid, right);
    }
  }

  private *merge(arr: number[], left: number, mid: number, right: number): Generator<SortingStep> {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;
    while (i < leftArray.length && j < rightArray.length) {
      yield this.addStep(
        'compare',
        [left + i, mid + 1 + j],
        [leftArray[i], rightArray[j]],
        `Comparing elements from left and right subarrays`,
      );
      // Maintain ascending order: choose the smaller of the two
      if (this.compare(rightArray[j], leftArray[i])) {
        arr[k] = leftArray[i];
        i += 1;
      } else {
        arr[k] = rightArray[j];
        j += 1;
      }
      k += 1;
    }
    while (i < leftArray.length) {
      arr[k] = leftArray[i];
      i += 1;
      k += 1;
    }
    while (j < rightArray.length) {
      arr[k] = rightArray[j];
      j += 1;
      k += 1;
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}


