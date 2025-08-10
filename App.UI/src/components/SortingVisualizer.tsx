import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StateMachine } from '../utils/stateMachine';
import { generateRandomArray, getResponsiveArraySize, getScreenDimensions } from '../utils/arrayUtils';
import { AlgorithmType, PerformanceMetrics, SortingStep } from '../types/sorting';
import { ALGORITHMS } from '../data/algorithms';
import ControlPanel from './ControlPanel';
import BarDisplay from './BarDisplay';
import AlgorithmExplanation from './AlgorithmExplanation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';
import './SortingVisualizer.css';

// Step-by-step sorting functions
function* bubbleSortStep(arr: number[]): Generator<SortingStep> {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        type: 'compare',
        indices: [j, j + 1],
        values: [arr[j], arr[j + 1]],
        description: `Comparing elements at positions ${j} and ${j + 1}`,
        timestamp: Date.now()
      };
      
      if (arr[j] > arr[j + 1]) {
        yield {
          type: 'swap',
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
          description: `Swapping elements at positions ${j} and ${j + 1}`,
          timestamp: Date.now()
        };
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}

function* selectionSortStep(arr: number[]): Generator<SortingStep> {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      yield {
        type: 'compare',
        indices: [minIndex, j],
        values: [arr[minIndex], arr[j]],
        description: `Comparing element at position ${minIndex} with element at position ${j}`,
        timestamp: Date.now()
      };
      
      if (arr[minIndex] > arr[j]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      yield {
        type: 'swap',
        indices: [i, minIndex],
        values: [arr[i], arr[minIndex]],
        description: `Swapping minimum element from position ${minIndex} to position ${i}`,
        timestamp: Date.now()
      };
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
}

function* insertionSortStep(arr: number[]): Generator<SortingStep> {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    yield {
      type: 'select',
      indices: [i],
      values: [key],
      description: `Selecting element at position ${i} (value: ${key})`,
      timestamp: Date.now()
    };
    
    while (j >= 0 && arr[j] > key) {
      yield {
        type: 'compare',
        indices: [j, j + 1],
        values: [arr[j], key],
        description: `Comparing element at position ${j} with selected key`,
        timestamp: Date.now()
      };
      
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
    yield {
      type: 'insert',
      indices: [j + 1],
      values: [key],
      description: `Inserting key at position ${j + 1}`,
      timestamp: Date.now()
    };
  }
}

function* mergeSortStep(arr: number[]): Generator<SortingStep> {
  yield* mergeSortHelper(arr, 0, arr.length - 1);
}

function* mergeSortHelper(arr: number[], left: number, right: number): Generator<SortingStep> {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    yield* mergeSortHelper(arr, left, mid);
    yield* mergeSortHelper(arr, mid + 1, right);
    yield* merge(arr, left, mid, right);
  }
}

function* merge(arr: number[], left: number, mid: number, right: number): Generator<SortingStep> {
  const leftArray = arr.slice(left, mid + 1);
  const rightArray = arr.slice(mid + 1, right + 1);
  
  let i = 0, j = 0, k = left;
  
  while (i < leftArray.length && j < rightArray.length) {
    yield {
      type: 'compare',
      indices: [left + i, mid + 1 + j],
      values: [leftArray[i], rightArray[j]],
      description: `Comparing elements from left and right subarrays`,
      timestamp: Date.now()
    };
    
    if (rightArray[j] > leftArray[i]) {
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

const SortingVisualizer: React.FC = () => {
  // Theme management
  const theme = useTheme();
  
  // State management
  const [array, setArray] = useState<number[]>([]);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmType>('bubble');
  const [speed, setSpeed] = useState<number>(100);
  const [arraySize, setArraySize] = useState<number>(100);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    steps: 0,
    comparisons: 0,
    swaps: 0,
    executionTime: 0,
    memoryUsage: 0
  });
  const [currentStep, setCurrentStep] = useState<SortingStep | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sortCompleted, setSortCompleted] = useState<boolean>(false);

  // Refs and state machine
  const stateMachine = useRef(new StateMachine());
  const workerRef = useRef<Worker | null>(null);
  const currentRequestId = useRef<string>('');
  const stepGeneratorRef = useRef<Generator<SortingStep> | null>(null);
  const sortedArrayRef = useRef<number[]>([]);

  // Initialize array on component mount
  useEffect(() => {
    const { width } = getScreenDimensions();
    const responsiveSize = getResponsiveArraySize(width);
    setArraySize(responsiveSize);
    const initialArray = generateRandomArray(responsiveSize);
    setArray(initialArray);
  }, []);

  // Handle window resize for responsive array sizing
  useEffect(() => {
    const handleResize = () => {
      // Removed automatic array size changes on window resize
      // Users should have full control over array size
      // The bar dimensions will still adjust automatically via calculateBarDimensions
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Web Worker
  useEffect(() => {
    // Initialize global completion flag on document element for deterministic e2e signaling
    try {
      document.documentElement.setAttribute('data-sort-complete', 'false');
    } catch {}

    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker(
        new URL('../workers/sortingWorker.ts', import.meta.url),
        { type: 'module' }
      );
      
      workerRef.current.onmessage = (event) => {
        const { type, step, metrics: workerMetrics, sortedArray, currentArray, error } = event.data;
        
        switch (type) {
          case 'SORT_STEP':
            if (step) {
              setCurrentStep(step);
              setMetrics(prev => ({
                ...prev,
                steps: prev.steps + 1,
                comparisons: step.type === 'compare' ? prev.comparisons + 1 : prev.comparisons,
                swaps: step.type === 'swap' ? prev.swaps + 1 : prev.swaps
              }));
            }
            if (currentArray) {
              setArray(currentArray);
            }
            break;
            
          case 'SORT_COMPLETE':
            if (workerMetrics) {
              setMetrics(workerMetrics);
            }
            if (sortedArray) {
              setArray(sortedArray);
            }
            setIsRunning(false);
            setIsPaused(false);
            setSortCompleted(true);
            stateMachine.current.transition('SORT_COMPLETE');
            // Reset step generator
            stepGeneratorRef.current = null;
            break;
            
          case 'ERROR':
            console.error('Worker error:', error);
            setIsRunning(false);
            setIsPaused(false);
            stateMachine.current.transition('CANCEL_SORT');
            // Reset step generator
            stepGeneratorRef.current = null;
            setCurrentStep(null);
            break;
        }
      };

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
        }
      };
    }
  }, []);

  // Reflect completion flag globally for tests
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-sort-complete', sortCompleted ? 'true' : 'false');
    } catch {}
  }, [sortCompleted]);

  // Generate new random array
  const handleGenerateArray = useCallback(() => {
    if (!stateMachine.current.canGenerate()) return;
    
    stateMachine.current.transition('GENERATE_ARRAY');
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setCurrentStep(null);
    setSortCompleted(false);
    setMetrics({
      steps: 0,
      comparisons: 0,
      swaps: 0,
      executionTime: 0,
      memoryUsage: 0
    });
    // Reset step generator
    stepGeneratorRef.current = null;
    stateMachine.current.transition('ARRAY_GENERATED');
  }, [arraySize]);

  // Start sorting
  const handleStartSort = useCallback(() => {
    if (!stateMachine.current.canStartSort() || !workerRef.current) return;
    
    setIsRunning(true);
    setIsPaused(false);
    setSortCompleted(false);
    stateMachine.current.transition('START_SORT');
    
    const requestId = Date.now().toString();
    currentRequestId.current = requestId;
    
    workerRef.current.postMessage({
      type: 'SORT_REQUEST',
      algorithm: currentAlgorithm,
      array: [...array],
      speed,
      id: requestId
    });
  }, [currentAlgorithm, array, speed]);

  // Step through sorting
  const handleStepSort = useCallback(() => {
    if (!stateMachine.current.canStartSort()) return;
    
    // Create a step generator for the current algorithm
    const algorithms = new Map([
      ['bubble', bubbleSortStep],
      ['selection', selectionSortStep],
      ['insertion', insertionSortStep],
      ['merge', mergeSortStep]
    ]);
    
    const stepFunction = algorithms.get(currentAlgorithm);
    if (!stepFunction) return;
    
    // Initialize or get next step
    if (!stepGeneratorRef.current) {
      // Create a copy of the array for the step function to work on
      const arrayCopy = [...array];
      sortedArrayRef.current = arrayCopy;
      stepGeneratorRef.current = stepFunction(sortedArrayRef.current);
      setMetrics(prev => ({
        ...prev,
        steps: 0,
        comparisons: 0,
        swaps: 0,
        executionTime: 0,
        memoryUsage: 0
      }));
    }
    
    const nextStep = stepGeneratorRef.current.next();
    if (!nextStep.done && nextStep.value) {
      const step = nextStep.value;
      setCurrentStep(step);
      setMetrics(prev => ({
        ...prev,
        steps: prev.steps + 1,
        comparisons: step.type === 'compare' ? prev.comparisons + 1 : prev.comparisons,
        swaps: step.type === 'swap' ? prev.swaps + 1 : prev.swaps
      }));
      // Update the array state after each step
      setArray([...sortedArrayRef.current]);
    } else {
      // Sorting complete - update the array with the sorted result
      setArray(sortedArrayRef.current);
      setCurrentStep(null);
      setIsRunning(false);
      stateMachine.current.transition('SORT_COMPLETE');
      stepGeneratorRef.current = null;
    }
  }, [currentAlgorithm, array]);

  // Pause sorting
  const handlePauseSort = useCallback(() => {
    if (!stateMachine.current.canPause()) return;
    
    setIsPaused(true);
    stateMachine.current.transition('PAUSE_SORT');
    
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'PAUSE_REQUEST',
        id: currentRequestId.current
      });
    }
  }, []);

  // Resume sorting
  const handleResumeSort = useCallback(() => {
    if (!stateMachine.current.canResume()) return;
    
    setIsPaused(false);
    stateMachine.current.transition('RESUME_SORT');
    
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'RESUME_REQUEST',
        id: currentRequestId.current
      });
    }
  }, []);

  // Cancel sorting
  const handleCancelSort = useCallback(() => {
    if (!stateMachine.current.canCancel()) return;
    
    setIsRunning(false);
    setIsPaused(false);
    setSortCompleted(false);
    stateMachine.current.transition('CANCEL_SORT');
    
    // Reset step generator
    stepGeneratorRef.current = null;
    setCurrentStep(null);
    
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'CANCEL_REQUEST',
        id: currentRequestId.current
      });
    }
  }, []);

  // Handle algorithm change
  const handleAlgorithmChange = useCallback((algorithm: AlgorithmType) => {
    if (isRunning) return;
    setCurrentAlgorithm(algorithm);
    // Reset step generator when changing algorithms
    stepGeneratorRef.current = null;
    setCurrentStep(null);
    setMetrics({
      steps: 0,
      comparisons: 0,
      swaps: 0,
      executionTime: 0,
      memoryUsage: 0
    });

    // If a previous run has finished, randomize the array on algorithm change
    if (stateMachine.current.isCompleted()) {
      if (stateMachine.current.canGenerate()) {
        stateMachine.current.transition('GENERATE_ARRAY');
      }
      const newArray = generateRandomArray(arraySize);
      setArray(newArray);
      setSortCompleted(false);
      // Ensure generator is reset after new data
      stepGeneratorRef.current = null;
      stateMachine.current.transition('ARRAY_GENERATED');
    }
  }, [isRunning, arraySize]);

  // Handle speed change
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  // Handle array size change
  const handleArraySizeChange = useCallback((newSize: number) => {
    if (isRunning) return;
    setArraySize(newSize);

    // Only generate new array if size actually changed
    if (array.length !== newSize) {
      // Transition to generating when allowed (IDLE or COMPLETED)
      if (stateMachine.current.canGenerate()) {
        stateMachine.current.transition('GENERATE_ARRAY');
      }

      const newArray = generateRandomArray(newSize);
      setArray(newArray);
      setCurrentStep(null);
      setMetrics({
        steps: 0,
        comparisons: 0,
        swaps: 0,
        executionTime: 0,
        memoryUsage: 0
      });
      // Reset step generator
      stepGeneratorRef.current = null;

      // Clear completed state if we were previously completed
      if (stateMachine.current.isCompleted() || sortCompleted) {
        setSortCompleted(false);
      }

      // Finalize generation transition back to idle
      if (stateMachine.current.getCurrentState() === 'GENERATING') {
        stateMachine.current.transition('ARRAY_GENERATED');
      }
    }
  }, [isRunning, array.length, sortCompleted]);

  return (
    <div className="sorting-visualizer" role="main" aria-label="Sorting Algorithm Visualizer">
      <header className="visualizer-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Sorting Algorithm Visualizer</h1>
            <p>Watch different sorting algorithms in action and learn how they work</p>
          </div>
          <div className="header-controls">
            <ThemeSwitcher
              appearance={theme.appearance}
              onAppearanceChange={theme.setAppearance}
            />
          </div>
        </div>
      </header>
      
      <div className="visualizer-content">
        {/* Deterministic completion marker for tests */}
        <div id="sort-status" data-complete={sortCompleted ? 'true' : 'false'} style={{ display: 'none' }} />
        <div className="control-section">
          <ControlPanel
            currentAlgorithm={currentAlgorithm}
            speed={speed}
            arraySize={arraySize}
            metrics={metrics}
            isRunning={isRunning}
            isPaused={isPaused}
            onAlgorithmChange={handleAlgorithmChange}
            onSpeedChange={handleSpeedChange}
            onArraySizeChange={handleArraySizeChange}
            onGenerateArray={handleGenerateArray}
            onStartSort={handleStartSort}
            onPauseSort={handlePauseSort}
            onResumeSort={handleResumeSort}
            onCancelSort={handleCancelSort}
            onStepSort={handleStepSort}
          />
        </div>
        
        <div className="visualization-section">
          <BarDisplay
            array={array}
            currentStep={currentStep}
            isRunning={isRunning}
          />
        </div>
        
        <div className="explanation-section">
          <AlgorithmExplanation
            algorithm={ALGORITHMS[currentAlgorithm]}
            currentStep={currentStep}
            metrics={metrics}
          />
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
