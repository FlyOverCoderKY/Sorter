import { AlgorithmConfig } from '../types/sorting';

export const ALGORITHMS: Record<string, AlgorithmConfig> = {
  bubble: {
    name: 'Bubble Sort',
    type: 'bubble',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    pseudoCode: [
      'for i = 0 to n-1',
      '  for j = 0 to n-i-1',
      '    if arr[j] > arr[j+1]',
      '      swap(arr[j], arr[j+1])'
    ]
  },
  
  selection: {
    name: 'Selection Sort',
    type: 'selection',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist.',
    pseudoCode: [
      'for i = 0 to n-1',
      '  minIndex = i',
      '  for j = i+1 to n',
      '    if arr[j] < arr[minIndex]',
      '      minIndex = j',
      '  if minIndex != i',
      '    swap(arr[i], arr[minIndex])'
    ]
  },
  
  insertion: {
    name: 'Insertion Sort',
    type: 'insertion',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'A simple sorting algorithm that builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.',
    pseudoCode: [
      'for i = 1 to n-1',
      '  key = arr[i]',
      '  j = i-1',
      '  while j >= 0 and arr[j] > key',
      '    arr[j+1] = arr[j]',
      '    j = j-1',
      '  arr[j+1] = key'
    ]
  },
  
  merge: {
    name: 'Merge Sort',
    type: 'merge',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    description: 'A divide-and-conquer algorithm that recursively breaks down a problem into two or more sub-problems until they become simple enough to solve directly.',
    pseudoCode: [
      'function mergeSort(arr, left, right)',
      '  if left < right',
      '    mid = (left + right) / 2',
      '    mergeSort(arr, left, mid)',
      '    mergeSort(arr, mid+1, right)',
      '    merge(arr, left, mid, right)',
      '',
      'function merge(arr, left, mid, right)',
      '  // Merge two sorted subarrays'
    ]
  }
};

export const ALGORITHM_ORDER: string[] = ['bubble', 'selection', 'insertion', 'merge'];

export function getAlgorithm(type: string): AlgorithmConfig | undefined {
  return ALGORITHMS[type];
}

export function getAllAlgorithms(): AlgorithmConfig[] {
  return ALGORITHM_ORDER.map(type => ALGORITHMS[type]);
}

export function getAlgorithmNames(): string[] {
  return ALGORITHM_ORDER.map(type => ALGORITHMS[type].name);
}
