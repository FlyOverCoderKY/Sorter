import { AlgorithmType, WorkerMessage, WorkerResponse, SortingStep, PerformanceMetrics } from '../types/sorting';

// Sorting algorithms implementation
class SortingAlgorithms {
  private metrics: PerformanceMetrics = {
    steps: 0,
    comparisons: 0,
    swaps: 0,
    executionTime: 0,
    memoryUsage: 0
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
      memoryUsage: 0
    };
  }

  private updateMemoryUsage(): void {
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as Performance & { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize;
    }
  }

  private addStep(type: SortingStep['type'], indices: number[], values: number[], description: string): SortingStep {
    this.metrics.steps++;
    this.updateMemoryUsage();
    
    return {
      type,
      indices,
      values,
      description,
      timestamp: Date.now()
    };
  }

  private compare(a: number, b: number): boolean {
    this.metrics.comparisons++;
    return a > b;
  }

  private swap(arr: number[], i: number, j: number): void {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    this.metrics.swaps++;
  }

  // Bubble Sort
  *bubbleSort(arr: number[]): Generator<SortingStep> {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        yield this.addStep('compare', [j, j + 1], [arr[j], arr[j + 1]], 
          `Comparing elements at positions ${j} and ${j + 1}`);
        
        if (this.compare(arr[j], arr[j + 1])) {
          yield this.addStep('swap', [j, j + 1], [arr[j], arr[j + 1]], 
            `Swapping elements at positions ${j} and ${j + 1}`);
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
        yield this.addStep('compare', [minIndex, j], [arr[minIndex], arr[j]], 
          `Comparing element at position ${minIndex} with element at position ${j}`);
        
        if (this.compare(arr[minIndex], arr[j])) {
          minIndex = j;
        }
      }
      
      if (minIndex !== i) {
        yield this.addStep('swap', [i, minIndex], [arr[i], arr[minIndex]], 
          `Swapping minimum element from position ${minIndex} to position ${i}`);
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
      
      yield this.addStep('select', [i], [key], 
        `Selecting element at position ${i} (value: ${key})`);
      
      while (j >= 0 && this.compare(arr[j], key)) {
        yield this.addStep('compare', [j, j + 1], [arr[j], key], 
          `Comparing element at position ${j} with selected key`);
        
        arr[j + 1] = arr[j];
        j--;
      }
      
      arr[j + 1] = key;
      yield this.addStep('insert', [j + 1], [key], 
        `Inserting key at position ${j + 1}`);
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
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArray.length && j < rightArray.length) {
      yield this.addStep('compare', [left + i, mid + 1 + j], [leftArray[i], rightArray[j]], 
        `Comparing elements from left and right subarrays`);
      
      if (this.compare(rightArray[j], leftArray[i])) {
        arr[k] = leftArray[i];
        i++;
      } else {
        arr[k] = rightArray[j];
        j++;
      }
      k++;
    }
    
    while (i < leftArray.length) {
      arr[k] = leftArray[i];
      i++;
      k++;
    }
    
    while (j < rightArray.length) {
      arr[k] = rightArray[j];
      j++;
      k++;
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}

// Worker message handling
const sortingAlgorithms = new SortingAlgorithms();

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, algorithm, array, speed, id } = event.data;
  
  try {
    switch (type) {
      case 'SORT_REQUEST':
        handleSortRequest(algorithm, array, speed, id);
        break;
      case 'PAUSE_REQUEST':
        // Pause logic will be implemented with cancellation token
        break;
      case 'RESUME_REQUEST':
        // Resume logic will be implemented with cancellation token
        break;
      case 'CANCEL_REQUEST':
        // Cancel logic will be implemented with cancellation token
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    const errorResponse: WorkerResponse = {
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    };
    self.postMessage(errorResponse);
  }
};

async function handleSortRequest(algorithm: AlgorithmType, array: number[], speed: number, id: string) {
  sortingAlgorithms.resetMetrics();
  sortingAlgorithms.setStartTime(performance.now());
  
  const generator = getSortingGenerator(algorithm, array);
  let isPaused = false;
  let isCancelled = false;
  
  // Set up message listener for pause/resume/cancel
  const messageHandler = (event: MessageEvent<WorkerMessage>) => {
    if (event.data.id !== id) return;
    
    switch (event.data.type) {
      case 'PAUSE_REQUEST':
        isPaused = true;
        break;
      case 'RESUME_REQUEST':
        isPaused = false;
        break;
      case 'CANCEL_REQUEST':
        isCancelled = true;
        break;
    }
  };
  
  self.addEventListener('message', messageHandler);
  
  try {
    for (const step of generator) {
      // Check for cancellation
      if (isCancelled) {
        const cancelResponse: WorkerResponse = {
          type: 'SORT_CANCELLED',
          id
        };
        self.postMessage(cancelResponse);
        return;
      }
      
      // Wait if paused
      while (isPaused && !isCancelled) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Check for cancellation again after pause
      if (isCancelled) {
        const cancelResponse: WorkerResponse = {
          type: 'SORT_CANCELLED',
          id
        };
        self.postMessage(cancelResponse);
        return;
      }
      
                   const response: WorkerResponse = {
        type: 'SORT_STEP',
        step,
        currentArray: [...array], // Send the current state of the array
        id
      };
       
       self.postMessage(response);
      
      // Add delay based on speed
      if (speed > 0) {
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }
    
    const metrics = sortingAlgorithms.getMetrics();
    metrics.executionTime = performance.now() - sortingAlgorithms.getStartTime();
    
    const completeResponse: WorkerResponse = {
      type: 'SORT_COMPLETE',
      metrics,
      sortedArray: [...array], // Send the final sorted array
      id
    };
    
    self.postMessage(completeResponse);
  } finally {
    // Clean up message listener
    self.removeEventListener('message', messageHandler);
  }
}

function getSortingGenerator(algorithm: AlgorithmType, array: number[]) {
  switch (algorithm) {
    case 'bubble':
      return sortingAlgorithms.bubbleSort(array);
    case 'selection':
      return sortingAlgorithms.selectionSort(array);
    case 'insertion':
      return sortingAlgorithms.insertionSort(array);
    case 'merge':
      return sortingAlgorithms.mergeSort(array);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}
