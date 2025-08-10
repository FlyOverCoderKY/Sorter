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

  // Quick Sort (Lomuto partition)
  *quickSort(arr: number[]): Generator<SortingStep> {
    function* qs(this: SortingAlgorithms, a: number[], lo: number, hi: number): Generator<SortingStep> {
      if (lo >= hi) return;
      const pivot = a[hi];
      yield this.addStep('select', [hi], [pivot], `Selecting pivot at position ${hi} (value: ${pivot})`);
      let i = lo;
      for (let j = lo; j < hi; j++) {
        yield this.addStep('compare', [j, hi], [a[j], pivot], `Comparing element at ${j} with pivot at ${hi}`);
        if (!this.compare(a[j], pivot)) { // a[j] <= pivot
          if (i !== j) {
            yield this.addStep('swap', [i, j], [a[i], a[j]], `Swapping elements at ${i} and ${j}`);
            this.swap(a, i, j);
          }
          i += 1;
        }
      }
      if (i !== hi) {
        yield this.addStep('swap', [i, hi], [a[i], a[hi]], `Placing pivot from ${hi} to ${i}`);
        this.swap(a, i, hi);
      }
      yield* qs.call(this, a, lo, i - 1);
      yield* qs.call(this, a, i + 1, hi);
    }
    yield* qs.call(this, arr, 0, arr.length - 1);
  }

  // Heap Sort
  *heapSort(arr: number[]): Generator<SortingStep> {
    const n = arr.length;
    const heapify = function* (this: SortingAlgorithms, a: number[], length: number, i: number): Generator<SortingStep> {
      while (true) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < length) {
          yield this.addStep('compare', [left, largest], [a[left], a[largest]], `Compare left child ${left} with node ${largest}`);
          if (this.compare(a[left], a[largest])) largest = left; // left > largest
        }
        if (right < length) {
          yield this.addStep('compare', [right, largest], [a[right], a[largest]], `Compare right child ${right} with node ${largest}`);
          if (this.compare(a[right], a[largest])) largest = right; // right > largest
        }
        if (largest !== i) {
          yield this.addStep('swap', [i, largest], [a[i], a[largest]], `Swap node ${i} with child ${largest}`);
          this.swap(a, i, largest);
          i = largest;
        } else {
          break;
        }
      }
    };
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      yield* heapify.call(this, arr, n, i);
    }
    // Extract elements
    for (let end = n - 1; end > 0; end--) {
      yield this.addStep('swap', [0, end], [arr[0], arr[end]], `Swap max at 0 with end ${end}`);
      this.swap(arr, 0, end);
      yield* heapify.call(this, arr, end, 0);
    }
  }

  // Shell Sort (Ciura-like sequence up to n)
  *shellSort(arr: number[]): Generator<SortingStep> {
    // Common Ciura sequence extended
    const gapsBase = [701, 301, 132, 57, 23, 10, 4, 1];
    const gaps = gapsBase.filter(g => g < arr.length);
    for (const gap of gaps) {
      for (let i = gap; i < arr.length; i++) {
        const temp = arr[i];
        let j = i;
        yield this.addStep('select', [i], [temp], `Select element ${i} for gapped insertion (gap ${gap})`);
        while (j >= gap) {
          yield this.addStep('compare', [j - gap, j], [arr[j - gap], temp], `Compare positions ${j - gap} and ${j} (gap ${gap})`);
          if (!this.compare(arr[j - gap], temp)) break; // arr[j-gap] <= temp
          arr[j] = arr[j - gap];
          j -= gap;
        }
        arr[j] = temp;
        yield this.addStep('insert', [j], [temp], `Insert at position ${j} (gap ${gap})`);
      }
    }
  }

  // Comb Sort
  *combSort(arr: number[]): Generator<SortingStep> {
    const shrink = 1.3;
    let gap = arr.length;
    let sorted = false;
    while (!sorted) {
      gap = Math.floor(gap / shrink);
      if (gap <= 1) {
        gap = 1;
        sorted = true;
      }
      let i = 0;
      while (i + gap < arr.length) {
        const j = i + gap;
        yield this.addStep('compare', [i, j], [arr[i], arr[j]], `Compare ${i} and ${j} (gap ${gap})`);
        if (this.compare(arr[i], arr[j])) {
          yield this.addStep('swap', [i, j], [arr[i], arr[j]], `Swap ${i} and ${j}`);
          this.swap(arr, i, j);
          sorted = false;
        }
        i += 1;
      }
    }
  }

  // Cocktail Shaker Sort
  *cocktailSort(arr: number[]): Generator<SortingStep> {
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;
    while (swapped) {
      swapped = false;
      for (let i = start; i < end; i++) {
        yield this.addStep('compare', [i, i + 1], [arr[i], arr[i + 1]], `Forward compare ${i} and ${i + 1}`);
        if (this.compare(arr[i], arr[i + 1])) {
          yield this.addStep('swap', [i, i + 1], [arr[i], arr[i + 1]], `Swap ${i} and ${i + 1}`);
          this.swap(arr, i, i + 1);
          swapped = true;
        }
      }
      if (!swapped) break;
      swapped = false;
      end -= 1;
      for (let i = end - 1; i >= start; i--) {
        yield this.addStep('compare', [i, i + 1], [arr[i], arr[i + 1]], `Backward compare ${i} and ${i + 1}`);
        if (this.compare(arr[i], arr[i + 1])) {
          yield this.addStep('swap', [i, i + 1], [arr[i], arr[i + 1]], `Swap ${i} and ${i + 1}`);
          this.swap(arr, i, i + 1);
          swapped = true;
        }
      }
      start += 1;
    }
  }

  // Gnome Sort
  *gnomeSort(arr: number[]): Generator<SortingStep> {
    let i = 0;
    while (i < arr.length) {
      if (i === 0 || !this.compare(arr[i - 1], arr[i])) {
        i += 1;
      } else {
        yield this.addStep('compare', [i - 1, i], [arr[i - 1], arr[i]], 'Gnome compare');
        yield this.addStep('swap', [i - 1, i], [arr[i - 1], arr[i]], 'Gnome swap');
        this.swap(arr, i - 1, i);
        i -= 1;
      }
    }
  }

  // Odd-Even (Brick) Sort
  *oddEvenSort(arr: number[]): Generator<SortingStep> {
    let swapped = true;
    while (swapped) {
      swapped = false;
      // odd phase
      for (let i = 1; i + 1 < arr.length; i += 2) {
        yield this.addStep('compare', [i, i + 1], [arr[i], arr[i + 1]], 'Odd phase compare');
        if (this.compare(arr[i], arr[i + 1])) {
          yield this.addStep('swap', [i, i + 1], [arr[i], arr[i + 1]], 'Odd phase swap');
          this.swap(arr, i, i + 1);
          swapped = true;
        }
      }
      // even phase
      for (let i = 0; i + 1 < arr.length; i += 2) {
        yield this.addStep('compare', [i, i + 1], [arr[i], arr[i + 1]], 'Even phase compare');
        if (this.compare(arr[i], arr[i + 1])) {
          yield this.addStep('swap', [i, i + 1], [arr[i], arr[i + 1]], 'Even phase swap');
          this.swap(arr, i, i + 1);
          swapped = true;
        }
      }
    }
  }

  // Stable Selection Sort (with shifts)
  *stableSelectionSort(arr: number[]): Generator<SortingStep> {
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        yield this.addStep('compare', [minIndex, j], [arr[minIndex], arr[j]], 'Find minimum');
        if (this.compare(arr[minIndex], arr[j])) minIndex = j;
      }
      const key = arr[minIndex];
      while (minIndex > i) {
        arr[minIndex] = arr[minIndex - 1];
        minIndex--;
      }
      arr[i] = key;
      yield this.addStep('insert', [i], [key], `Stable insert at ${i}`);
    }
  }

  // Radix Sort (LSD base-10)
  *radixSort(arr: number[]): Generator<SortingStep> {
    const getDigit = (num: number, place: number) => Math.floor(num / Math.pow(10, place)) % 10;
    const maxVal = Math.max(...arr, 0);
    const maxDigits = Math.max(1, Math.floor(Math.log10(Math.max(1, maxVal))) + 1);
    const base = 10;
    const output = new Array(arr.length);
    for (let d = 0; d < maxDigits; d++) {
      const count = new Array(base).fill(0);
      for (let i = 0; i < arr.length; i++) {
        const b = getDigit(arr[i], d);
        count[b]++;
        yield this.addStep('bucket', [i], [b], `Bucket by digit ${d}: ${b}`);
      }
      for (let i = 1; i < base; i++) {
        count[i] += count[i - 1];
        yield this.addStep('collect', [i], [count[i]], `Prefix ${i}: ${count[i]}`);
      }
      for (let i = arr.length - 1; i >= 0; i--) {
        const b = getDigit(arr[i], d);
        output[--count[b]] = arr[i];
        yield this.addStep('write', [count[b]], [arr[i]], `Write by digit ${d}`);
      }
      for (let i = 0; i < arr.length; i++) arr[i] = output[i];
    }
  }

  // Bucket Sort (simple: k buckets with insertion per bucket)
  *bucketSort(arr: number[]): Generator<SortingStep> {
    if (arr.length === 0) return;
    const numBuckets = Math.max(5, Math.floor(Math.sqrt(arr.length)));
    const minV = Math.min(...arr);
    const maxV = Math.max(...arr);
    const range = Math.max(1, maxV - minV + 1);
    const buckets: number[][] = Array.from({ length: numBuckets }, () => []);
    for (let i = 0; i < arr.length; i++) {
      const idx = Math.min(numBuckets - 1, Math.floor(((arr[i] - minV) / range) * numBuckets));
      buckets[idx].push(arr[i]);
      yield this.addStep('bucket', [i], [idx], `Assign to bucket ${idx}`);
    }
    // insertion sort per bucket
    let k = 0;
    for (let b = 0; b < numBuckets; b++) {
      const bucket = buckets[b];
      for (let i = 1; i < bucket.length; i++) {
        const key = bucket[i];
        let j = i - 1;
        while (j >= 0 && bucket[j] > key) j--;
        bucket.splice(j + 1, 0, key);
        bucket.splice(i + 1, 1);
        yield this.addStep('insert', [k + j + 1], [key], `Insert within bucket ${b}`);
      }
      for (let i = 0; i < bucket.length; i++) arr[k++] = bucket[i];
    }
  }

  // Pigeonhole Sort
  *pigeonholeSort(arr: number[]): Generator<SortingStep> {
    if (arr.length === 0) return;
    const minV = Math.min(...arr);
    const maxV = Math.max(...arr);
    const size = maxV - minV + 1;
    if (size > 1000) { yield this.addStep('note', [], [], 'Value range too large; abort'); return; }
    const holes: number[] = new Array(size).fill(0);
    for (let i = 0; i < arr.length; i++) { holes[arr[i] - minV]++; yield this.addStep('count', [i], [arr[i]], 'Hole count'); }
    let index = 0;
    for (let i = 0; i < size; i++) {
      while (holes[i]-- > 0) { arr[index++] = i + minV; yield this.addStep('write', [index - 1], [i + minV], 'Write from hole'); }
    }
  }

  // Counting Sort (values assumed within known range 0..maxVal); we derive max from input up to a safe cap
  *countingSort(arr: number[]): Generator<SortingStep> {
    if (arr.length === 0) return;
    const maxVal = Math.max(...arr);
    const cap = Math.max(0, Math.min(maxVal, 1000)); // cap to avoid pathological memory
    const counts = new Array(cap + 1).fill(0);
    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
      const v = Math.min(arr[i], cap);
      counts[v] += 1;
      yield this.addStep('count', [i], [v], `Tally value ${v} (index ${i})`);
    }
    // Prefix sums
    for (let i = 1; i < counts.length; i++) {
      counts[i] += counts[i - 1];
      yield this.addStep('collect', [i], [counts[i]], `Prefix sum at ${i}: ${counts[i]}`);
    }
    // Output array stable write
    const output = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
      const v = Math.min(arr[i], cap);
      const pos = --counts[v];
      output[pos] = v;
      yield this.addStep('write', [pos], [v], `Write value ${v} to output position ${pos}`);
    }
    // Copy back
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
    }
  }

  // Natural Merge Sort (run detection + merging)
  *naturalMergeSort(arr: number[]): Generator<SortingStep> {
    const runs: Array<[number, number]> = [];
    // Detect non-decreasing runs
    let i = 0;
    while (i < arr.length) {
      let j = i + 1;
      while (j < arr.length && arr[j - 1] <= arr[j]) {
        j += 1;
      }
      runs.push([i, j - 1]);
      i = j;
    }
    if (runs.length <= 1) return; // already sorted
    // Merge runs pairwise
    while (runs.length > 1) {
      const newRuns: Array<[number, number]> = [];
      for (let r = 0; r < runs.length; r += 2) {
        if (r + 1 >= runs.length) { newRuns.push(runs[r]); break; }
        const [l1, r1] = runs[r];
        const [, r2] = runs[r + 1];
        yield* this.merge(arr, l1, r1, r2);
        newRuns.push([l1, r2]);
      }
      runs.splice(0, runs.length, ...newRuns);
    }
  }

  // IntroSort: quick sort with depth limit; fall back to heap sort; insertion for small arrays
  *introSort(arr: number[]): Generator<SortingStep> {
    const maxDepth = Math.floor(Math.log2(Math.max(1, arr.length))) * 2;
    const cutoff = 16;
    function* insertion(this: SortingAlgorithms, a: number[], lo: number, hi: number): Generator<SortingStep> {
      for (let i = lo + 1; i <= hi; i++) {
        const key = a[i];
        yield this.addStep('select', [i], [key], `Select for insertion`);
        let j = i - 1;
        while (j >= lo && this.compare(a[j], key)) {
          yield this.addStep('compare', [j, j + 1], [a[j], key], 'Compare for insertion');
          a[j + 1] = a[j];
          j -= 1;
        }
        a[j + 1] = key;
        yield this.addStep('insert', [j + 1], [key], `Insert at ${j + 1}`);
      }
    }
    function* intro(this: SortingAlgorithms, a: number[], lo: number, hi: number, depth: number): Generator<SortingStep> {
      const size = hi - lo + 1;
      if (size <= 1) return;
      if (size < cutoff) { yield* insertion.call(this, a, lo, hi); return; }
      if (depth === 0) { yield* this.heapSort(a); return; }
      // Quick partition (Lomuto on subrange)
      const pivot = a[hi];
      yield this.addStep('select', [hi], [pivot], `Pivot for introsort`);
      let i = lo;
      for (let j = lo; j < hi; j++) {
        yield this.addStep('compare', [j, hi], [a[j], pivot], 'Compare with pivot');
        if (!this.compare(a[j], pivot)) {
          if (i !== j) {
            yield this.addStep('swap', [i, j], [a[i], a[j]], 'Swap for partition');
            this.swap(a, i, j);
          }
          i++;
        }
      }
      if (i !== hi) {
        yield this.addStep('swap', [i, hi], [a[i], a[hi]], 'Place pivot');
        this.swap(a, i, hi);
      }
      yield* intro.call(this, a, lo, i - 1, depth - 1);
      yield* intro.call(this, a, i + 1, hi, depth - 1);
    }
    yield* intro.call(this, arr, 0, arr.length - 1, maxDepth);
  }

  // TimSort (simplified): detect runs, insertion sort small runs, then merge runs
  *timSort(arr: number[]): Generator<SortingStep> {
    const RUN = 32;
    // Binary insertion for small runs
    const binInsert = function* (this: SortingAlgorithms, a: number[], start: number, end: number): Generator<SortingStep> {
      for (let i = start + 1; i <= end; i++) {
        const key = a[i];
        yield this.addStep('select', [i], [key], 'Select for run insertion');
        let j = i - 1;
        while (j >= start && this.compare(a[j], key)) {
          yield this.addStep('compare', [j, j + 1], [a[j], key], 'Compare for insertion');
          a[j + 1] = a[j];
          j--;
        }
        a[j + 1] = key;
        yield this.addStep('insert', [j + 1], [key], 'Insert into run');
      }
    };
    // Identify runs and insert-sort them to at least RUN length
    let i = 0;
    const runs: Array<[number, number]> = [];
    while (i < arr.length) {
      let j = i + 1;
      while (j < arr.length && arr[j - 1] <= arr[j]) j++;
      const end = Math.min(arr.length - 1, Math.max(j - 1, i + RUN - 1));
      yield* binInsert.call(this, arr, i, end);
      runs.push([i, end]);
      i = end + 1;
    }
    // Merge runs sequentially (no full TimSort stack invariants for brevity)
    while (runs.length > 1) {
      const [l1, r1] = runs.shift() as [number, number];
      const [, r2] = runs.shift() as [number, number];
      yield* this.merge(arr, l1, r1, r2);
      runs.unshift([l1, r2]);
    }
  }

  // Bitonic Sort (simplified for power-of-two length portions): emulate with compare/swap network on current array length
  *bitonicSort(arr: number[]): Generator<SortingStep> {
    const n = arr.length;
    const up = true;
    const compareAndSwap = function* (this: SortingAlgorithms, a: number[], i: number, j: number, dir: boolean): Generator<SortingStep> {
      yield this.addStep('compare', [i, j], [a[i], a[j]], 'Network compare');
      if ((dir && this.compare(a[i], a[j])) || (!dir && this.compare(a[j], a[i]))) {
        yield this.addStep('swap', [i, j], [a[i], a[j]], 'Network swap');
        this.swap(a, i, j);
      }
    };
    function* bitonicMerge(this: SortingAlgorithms, a: number[], low: number, cnt: number, dir: boolean): Generator<SortingStep> {
      if (cnt <= 1) return;
      const k = Math.floor(cnt / 2);
      for (let i = low; i < low + k; i++) {
        yield* compareAndSwap.call(this, a, i, i + k, dir);
      }
      yield* bitonicMerge.call(this, a, low, k, dir);
      yield* bitonicMerge.call(this, a, low + k, cnt - k, dir);
    }
    function* bitonicSortRec(this: SortingAlgorithms, a: number[], low: number, cnt: number, dir: boolean): Generator<SortingStep> {
      if (cnt <= 1) return;
      const k = Math.floor(cnt / 2);
      yield* bitonicSortRec.call(this, a, low, k, true);
      yield* bitonicSortRec.call(this, a, low + k, cnt - k, false);
      yield* bitonicMerge.call(this, a, low, cnt, dir);
    }
    yield* bitonicSortRec.call(this, arr, 0, n, up);
    // Finalize with a stable insertion pass to guarantee total order for non-power-of-two lengths
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      yield this.addStep('select', [i], [key], 'Finalize: select for insertion');
      let j = i - 1;
      while (j >= 0 && this.compare(arr[j], key)) {
        yield this.addStep('compare', [j, j + 1], [arr[j], key], 'Finalize: compare for insertion');
        arr[j + 1] = arr[j];
        j -= 1;
      }
      arr[j + 1] = key;
      yield this.addStep('insert', [j + 1], [key], 'Finalize: insert');
    }
  }

  // Tree Sort: build a BST (as arrays of nodes) and in-order traverse
  *treeSort(arr: number[]): Generator<SortingStep> {
    type Node = { v: number; l: number; r: number };
    const nodes: Node[] = [];
    let root = -1;
    const insert = function* (this: SortingAlgorithms, value: number): Generator<SortingStep> {
      if (root === -1) { nodes.push({ v: value, l: -1, r: -1 }); root = 0; yield this.addStep('insert', [0], [value], 'Insert root'); return; }
      let idx = root;
      while (true) {
        yield this.addStep('compare', [idx], [nodes[idx].v], 'Compare for tree insert');
        if (this.compare(nodes[idx].v, value)) { // node > value -> go left
          if (nodes[idx].l === -1) { nodes[idx].l = nodes.push({ v: value, l: -1, r: -1 }) - 1; yield this.addStep('insert', [nodes[idx].l], [value], 'Insert left'); return; }
          idx = nodes[idx].l;
        } else { // value >= node -> go right
          if (nodes[idx].r === -1) { nodes[idx].r = nodes.push({ v: value, l: -1, r: -1 }) - 1; yield this.addStep('insert', [nodes[idx].r], [value], 'Insert right'); return; }
          idx = nodes[idx].r;
        }
      }
    };
    for (const v of arr) { yield* insert.call(this, v); }
    // In-order traversal collect to output
    const output: number[] = [];
    const traverse = (i: number) => { if (i === -1) return; traverse(nodes[i].l); output.push(nodes[i].v); traverse(nodes[i].r); };
    traverse(root);
    for (let i = 0; i < arr.length; i++) { arr[i] = output[i]; yield this.addStep('write', [i], [arr[i]], 'Write inorder value'); }
  }

  // Group D novelty algorithms with safeguards
  private isSortedAscending(a: number[]): boolean {
    for (let i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false;
    return true;
  }

  *bogoSort(arr: number[]): Generator<SortingStep> {
    const maxSteps = Math.min(2000, arr.length * 200); // guard
    let steps = 0;
    while (!this.isSortedAscending(arr) && steps < maxSteps) {
      // Fisher-Yates shuffle one pass
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        yield this.addStep('swap', [i, j], [arr[i], arr[j]], `Shuffle swap ${i}<->${j}`);
        this.swap(arr, i, j);
      }
      steps++;
    }
    if (!this.isSortedAscending(arr)) {
      yield this.addStep('note', [], [], 'Stopped early by guard');
    }
  }

  *bozoSort(arr: number[]): Generator<SortingStep> {
    const maxSteps = Math.min(5000, arr.length * 400); // guard
    let steps = 0;
    while (!this.isSortedAscending(arr) && steps < maxSteps) {
      const i = Math.floor(Math.random() * arr.length);
      const j = Math.floor(Math.random() * arr.length);
      yield this.addStep('swap', [i, j], [arr[i], arr[j]], `Random swap ${i}<->${j}`);
      this.swap(arr, i, j);
      steps++;
    }
    if (!this.isSortedAscending(arr)) {
      yield this.addStep('note', [], [], 'Stopped early by guard');
    }
  }

  *stoogeSort(arr: number[]): Generator<SortingStep> {
    const maxDepth = Math.ceil(Math.log2(Math.max(1, arr.length))) + 8; // guard-ish
    function* stooge(this: SortingAlgorithms, a: number[], l: number, r: number, depth: number): Generator<SortingStep> {
      if (l >= r) return;
      yield this.addStep('compare', [l, r], [a[l], a[r]], 'Stooge compare ends');
      if (this.compare(a[l], a[r])) {
        yield this.addStep('swap', [l, r], [a[l], a[r]], 'Swap ends');
        this.swap(a, l, r);
      }
      if (r - l + 1 > 2) {
        if (depth <= 0) { yield this.addStep('note', [], [], 'Depth guard reached'); return; }
        const t = Math.floor((r - l + 1) / 3);
        yield* stooge.call(this, a, l, r - t, depth - 1);
        yield* stooge.call(this, a, l + t, r, depth - 1);
        yield* stooge.call(this, a, l, r - t, depth - 1);
      }
    }
    yield* stooge.call(this, arr, 0, arr.length - 1, maxDepth);
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}


