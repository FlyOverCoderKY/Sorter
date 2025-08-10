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
  },
  
  quick: {
    name: 'Quick Sort',
    type: 'quick',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    description: 'Divide-and-conquer using a pivot to partition elements; typically fast on average.',
    pseudoCode: [
      'function quickSort(lo, hi):',
      '  pivot = arr[hi]  // select pivot',
      '  i = lo',
      '  for j = lo .. hi-1:',
      '    if arr[j] <= pivot: swap(arr[i], arr[j]); i++',
      '  swap(arr[i], arr[hi])  // place pivot',
      '  quickSort(lo, i-1); quickSort(i+1, hi)'
    ]
  },
  
  heap: {
    name: 'Heap Sort',
    type: 'heap',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(1)',
    description: 'Build a max-heap and repeatedly extract the maximum to sort in place.',
    pseudoCode: [
      'buildMaxHeap(arr)',
      'for end = n-1 downto 1:',
      '  swap(arr[0], arr[end])',
      '  heapify(arr, 0, end)'
    ]
  },
  
  shell: {
    name: 'Shell Sort',
    type: 'shell',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'depends on gaps',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'Generalized insertion sort that allows exchanges far apart using gap sequences.',
    pseudoCode: [
      'gaps = [701,301,132,57,23,10,4,1]',
      'for gap in gaps:',
      '  for i = gap .. n-1:',
      '    temp = arr[i]',
      '    j = i',
      '    while j >= gap and arr[j-gap] > temp:',
      '      arr[j] = arr[j-gap]; j -= gap',
      '    arr[j] = temp'
    ]
  },
  
  comb: {
    name: 'Comb Sort',
    type: 'comb',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'Improves bubble sort by comparing elements a certain gap apart with shrinking gap.',
    pseudoCode: [
      'gap = n; shrink = 1.3',
      'while gap > 1 or swapped:',
      '  gap = floor(gap / shrink)',
      '  swapped = false',
      '  for i = 0 .. n-gap-1:',
      '    if arr[i] > arr[i+gap]: swap; swapped = true'
    ]
  },
  
  cocktail: {
    name: 'Cocktail Shaker Sort',
    type: 'cocktail',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'A bidirectional bubble sort that passes in both directions each iteration.',
    pseudoCode: [
      'do:',
      '  swapped = false',
      '  for i = left .. right-1: if arr[i] > arr[i+1]: swap; swapped = true',
      '  right--',
      '  for i = right-1 .. left: if arr[i] > arr[i+1]: swap; swapped = true',
      '  left++',
      'while swapped'
    ]
  },
  
  counting: {
    name: 'Counting Sort',
    type: 'counting',
    timeComplexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n + k)'
    },
    spaceComplexity: 'O(n + k)',
    description: 'Non-comparison sort that counts occurrences and writes out in order; stable when implemented with prefix sums.',
    pseudoCode: [
      'find max value m',
      'count[0..m] = 0',
      'for each x in arr: count[x]++',
      'for i=1..m: count[i]+=count[i-1]  // prefix sums',
      'for i=n-1..0: output[--count[arr[i]]] = arr[i]',
      'copy output back to arr'
    ]
  },
  
  naturalMerge: {
    name: 'Natural Merge Sort',
    type: 'naturalMerge',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    description: 'Detects naturally occurring runs and merges them; stable variant of merge sort.',
    pseudoCode: [
      'while multiple runs exist:',
      '  detect next non-decreasing run',
      '  push run to queue',
      '  merge runs pairwise until one remains'
    ]
  },
  
  intro: {
    name: 'IntroSort',
    type: 'intro',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(log n)',
    description: 'Hybrid of QuickSort, HeapSort, and Insertion Sort using depth limit.',
    pseudoCode: [
      'introsort(A, depthLimit):',
      '  if size < 16: insertionSort(A)',
      '  else if depthLimit == 0: heapSort(A)',
      '  else: quickSortPartition and recurse'
    ]
  },
  
  timsort: {
    name: 'TimSort',
    type: 'timsort',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    description: 'Stable hybrid using run detection and galloping merges; used in Python/Java.',
    pseudoCode: [
      'identify runs; binary insert small runs',
      'push runs to stack; maintain invariants',
      'merge with galloping when beneficial'
    ]
  },
  
  bitonic: {
    name: 'Bitonic Sort',
    type: 'bitonic',
    timeComplexity: {
      best: 'O(n log² n)',
      average: 'O(n log² n)',
      worst: 'O(n log² n)'
    },
    spaceComplexity: 'O(1)',
    description: 'Sorting network style algorithm; good for parallel hardware; educational in bars.',
    pseudoCode: [
      'build bitonic sequence',
      'bitonic merge recursively'
    ]
  },
  
  tree: {
    name: 'Tree Sort',
    type: 'tree',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(n)',
    description: 'Insert into a BST and inorder traverse to collect sorted output.',
    pseudoCode: [
      'for each x: BST.insert(x)',
      'inorder traverse to output'
    ]
  }
  ,
  bogo: {
    name: 'Bogo Sort',
    type: 'bogo',
    timeComplexity: {
      best: 'O(n)',
      average: 'Unbounded',
      worst: 'Unbounded'
    },
    spaceComplexity: 'O(1)',
    description: 'Randomly shuffles until sorted; purely educational and heavily guarded.',
    pseudoCode: [
      'while not sorted:',
      '  shuffle(arr)'
    ]
  },
  bozo: {
    name: 'Bozo Sort',
    type: 'bozo',
    timeComplexity: {
      best: 'O(n)',
      average: 'Unbounded',
      worst: 'Unbounded'
    },
    spaceComplexity: 'O(1)',
    description: 'Randomly swaps two elements until sorted.',
    pseudoCode: [
      'while not sorted:',
      '  i,j = random indices; swap(arr[i], arr[j])'
    ]
  },
  stooge: {
    name: 'Stooge Sort',
    type: 'stooge',
    timeComplexity: {
      best: 'O(n^(log 3 / log 1.5)) ≈ O(n^2.71)',
      average: 'O(n^2.71)',
      worst: 'O(n^2.71)'
    },
    spaceComplexity: 'O(1)',
    description: 'Recursive novelty algorithm swapping first/last thirds.',
    pseudoCode: [
      'if arr[l] > arr[r]: swap',
      'if r-l+1 > 2:',
      '  t = floor((r-l+1)/3)',
      '  stooge(arr, l, r-t)',
      '  stooge(arr, l+t, r)',
      '  stooge(arr, l, r-t)'
    ]
  }
  ,
  gnome: {
    name: 'Gnome Sort',
    type: 'gnome',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Simple comparison sort that swaps backward like insertion with swaps.',
    pseudoCode: ['i=0', 'while i<n:', ' if i==0 or a[i-1] <= a[i]: i++', ' else swap(i-1,i); i--']
  },
  oddEven: {
    name: 'Odd-Even Sort',
    type: 'oddEven',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Alternates odd and even phases of adjacent swaps.',
    pseudoCode: ['repeat until sorted:', ' odd phase swaps', ' even phase swaps']
  },
  stableSelection: {
    name: 'Stable Selection Sort',
    type: 'stableSelection',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(n) (with shifts)',
    description: 'Selection with element shifts to maintain stability.',
    pseudoCode: ['for i:', ' find min index', ' key=a[min]', ' shift right', ' a[i]=key']
  },
  radix: {
    name: 'Radix Sort (LSD)',
    type: 'radix',
    timeComplexity: { best: 'O((n+b)·d)', average: 'O((n+b)·d)', worst: 'O((n+b)·d)' },
    spaceComplexity: 'O(n+b)',
    description: 'Stable digit-wise sorting using counting per digit.',
    pseudoCode: ['for d in digits:', ' counting by digit', ' stable write']
  },
  bucket: {
    name: 'Bucket Sort',
    type: 'bucket',
    timeComplexity: { best: 'O(n)', average: 'O(n+k)', worst: 'O(n²)' },
    spaceComplexity: 'O(n)',
    description: 'Distribute into buckets then sort each bucket (insertion).',
    pseudoCode: ['distribute to buckets', ' insertion in bucket', ' concatenate']
  },
  pigeonhole: {
    name: 'Pigeonhole Sort',
    type: 'pigeonhole',
    timeComplexity: { best: 'O(n+N)', average: 'O(n+N)', worst: 'O(n+N)' },
    spaceComplexity: 'O(N)',
    description: 'Count occurrences by holes over a small integer range and write back.',
    pseudoCode: ['count holes', ' write back in order']
  }
};

export const ALGORITHM_ORDER: string[] = [
  'bubble',
  'selection',
  'insertion',
  'merge',
  'quick',
  'heap',
  'shell',
  'comb',
  'cocktail',
  'counting',
  'naturalMerge',
  'intro',
  'timsort',
  'bitonic',
  'tree',
  'bogo',
  'bozo',
  'stooge'
];

export function getAlgorithm(type: string): AlgorithmConfig | undefined {
  return ALGORITHMS[type];
}

export function getAllAlgorithms(): AlgorithmConfig[] {
  return ALGORITHM_ORDER.map(type => ALGORITHMS[type]);
}

export function getAlgorithmNames(): string[] {
  return ALGORITHM_ORDER.map(type => ALGORITHMS[type].name);
}
