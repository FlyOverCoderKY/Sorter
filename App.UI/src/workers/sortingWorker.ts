import { AlgorithmType, WorkerMessage, WorkerResponse } from '../types/sorting';
import { SortingAlgorithms } from '../algorithms/SortingAlgorithms';

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
  // NOTE: Always include currentArray in step messages to ensure visible updates in UI
  
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
        currentArray: [...array],
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
    case 'counting':
      return sortingAlgorithms.countingSort(array);
    case 'naturalMerge':
      return sortingAlgorithms.naturalMergeSort(array);
    case 'intro':
      return sortingAlgorithms.introSort(array);
    case 'timsort':
      return sortingAlgorithms.timSort(array);
    case 'bitonic':
      return sortingAlgorithms.bitonicSort(array);
    case 'tree':
      return sortingAlgorithms.treeSort(array);
    case 'bogo':
      return sortingAlgorithms.bogoSort(array);
    case 'bozo':
      return sortingAlgorithms.bozoSort(array);
    case 'stooge':
      return sortingAlgorithms.stoogeSort(array);
    case 'gnome':
      return sortingAlgorithms.gnomeSort(array);
    case 'oddEven':
      return sortingAlgorithms.oddEvenSort(array);
    case 'stableSelection':
      return sortingAlgorithms.stableSelectionSort(array);
    case 'radix':
      return sortingAlgorithms.radixSort(array);
    case 'bucket':
      return sortingAlgorithms.bucketSort(array);
    case 'pigeonhole':
      return sortingAlgorithms.pigeonholeSort(array);
    case 'quick':
      return sortingAlgorithms.quickSort(array);
    case 'heap':
      return sortingAlgorithms.heapSort(array);
    case 'shell':
      return sortingAlgorithms.shellSort(array);
    case 'comb':
      return sortingAlgorithms.combSort(array);
    case 'cocktail':
      return sortingAlgorithms.cocktailSort(array);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}
