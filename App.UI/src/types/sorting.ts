// Sorting algorithm types
export type AlgorithmType = 'bubble' | 'selection' | 'insertion' | 'merge';

// State machine states
export type AppState = 'IDLE' | 'GENERATING' | 'SORTING' | 'PAUSED' | 'COMPLETED';

// Performance metrics
export interface PerformanceMetrics {
  steps: number;
  comparisons: number;
  swaps: number;
  executionTime: number;
  memoryUsage: number;
}

// Sorting step for visualization
export interface SortingStep {
  type: 'compare' | 'swap' | 'merge' | 'select' | 'insert';
  indices: number[];
  values: number[];
  description: string;
  timestamp: number;
}

// Web Worker message types
export interface WorkerMessage {
  type: 'SORT_REQUEST' | 'PAUSE_REQUEST' | 'RESUME_REQUEST' | 'CANCEL_REQUEST';
  algorithm: AlgorithmType;
  array: number[];
  speed: number;
  id: string;
}

export interface WorkerResponse {
  type: 'SORT_STEP' | 'SORT_COMPLETE' | 'SORT_PAUSED' | 'SORT_CANCELLED' | 'ERROR';
  step?: SortingStep;
  metrics?: PerformanceMetrics;
  sortedArray?: number[];
  currentArray?: number[];
  error?: string;
  id: string;
}

// Algorithm configuration
export interface AlgorithmConfig {
  name: string;
  type: AlgorithmType;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  pseudoCode: string[];
}

// App configuration
export interface AppConfig {
  defaultArraySize: number;
  minArraySize: number;
  maxArraySize: number;
  defaultSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  animationDuration: number;
}
