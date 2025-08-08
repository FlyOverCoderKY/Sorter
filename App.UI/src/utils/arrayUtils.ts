// Configuration for array generation
const ARRAY_CONFIG = {
  minValue: 10,
  maxValue: 300,
  defaultSize: 100,
  minSize: 10,
  maxSize: 200
};

// Screen size breakpoints for responsive array sizing
const SCREEN_BREAKPOINTS = {
  small: 768,   // Mobile devices
  medium: 1024, // Tablets
  large: 1440   // Desktop
};

/**
 * Generates a random array of numbers for sorting visualization
 * @param size - The size of the array to generate
 * @returns Array of random numbers
 */
export function generateRandomArray(size: number = ARRAY_CONFIG.defaultSize): number[] {
  const array: number[] = [];
  
  for (let i = 0; i < size; i++) {
    const value = Math.floor(
      Math.random() * (ARRAY_CONFIG.maxValue - ARRAY_CONFIG.minValue + 1) + ARRAY_CONFIG.minValue
    );
    array.push(value);
  }
  
  return array;
}

/**
 * Determines the optimal array size based on screen dimensions
 * @param screenWidth - Current screen width
 * @returns Optimal array size
 */
export function getResponsiveArraySize(screenWidth: number): number {
  // Base size on screen width
  if (screenWidth < SCREEN_BREAKPOINTS.small) {
    return ARRAY_CONFIG.minSize;
  } else if (screenWidth < SCREEN_BREAKPOINTS.medium) {
    return ARRAY_CONFIG.defaultSize;
  } else if (screenWidth < SCREEN_BREAKPOINTS.large) {
    return ARRAY_CONFIG.defaultSize;
  } else {
    return ARRAY_CONFIG.maxSize;
  }
}

/**
 * Gets the current screen dimensions
 * @returns Object with width and height
 */
export function getScreenDimensions(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Validates array size constraints
 * @param size - Size to validate
 * @returns Validated size within constraints
 */
export function validateArraySize(size: number): number {
  return Math.max(
    ARRAY_CONFIG.minSize,
    Math.min(size, ARRAY_CONFIG.maxSize)
  );
}

/**
 * Creates a sorted array for testing purposes
 * @param size - Size of the array
 * @param ascending - Whether to sort in ascending order
 * @returns Sorted array
 */
export function generateSortedArray(size: number, ascending: boolean = true): number[] {
  const array = generateRandomArray(size);
  return ascending ? array.sort((a, b) => a - b) : array.sort((a, b) => b - a);
}

/**
 * Creates a nearly sorted array for testing edge cases
 * @param size - Size of the array
 * @param disorderPercentage - Percentage of elements to randomly swap (0-1)
 * @returns Nearly sorted array
 */
export function generateNearlySortedArray(size: number, disorderPercentage: number = 0.1): number[] {
  const array = generateSortedArray(size);
  const swapCount = Math.floor(size * disorderPercentage);
  
  for (let i = 0; i < swapCount; i++) {
    const index1 = Math.floor(Math.random() * size);
    const index2 = Math.floor(Math.random() * size);
    [array[index1], array[index2]] = [array[index2], array[index1]];
  }
  
  return array;
}

/**
 * Creates a reversed array for testing worst-case scenarios
 * @param size - Size of the array
 * @returns Reversed array
 */
export function generateReversedArray(size: number): number[] {
  return generateSortedArray(size, false);
}

/**
 * Calculates the optimal bar width and spacing for visualization
 * @param containerWidth - Width of the visualization container
 * @param arraySize - Number of elements in the array
 * @returns Object with bar width and spacing
 */
export function calculateBarDimensions(containerWidth: number, arraySize: number): {
  barWidth: number;
  spacing: number;
  totalWidth: number;
} {
  const minBarWidth = 2;
  const maxBarWidth = 12;
  const minSpacing = 2; // Increased minimum spacing
  const maxSpacing = 8; // Added maximum spacing to prevent bars from being too far apart
  
  // Calculate available space per element (bar + spacing)
  const availableSpacePerElement = containerWidth / arraySize;
  
  // Determine optimal bar width based on array size
  let barWidth: number;
  let spacing: number;
  
  if (arraySize <= 20) {
    // For very small arrays, use larger bars with good spacing
    barWidth = Math.min(maxBarWidth, Math.max(minBarWidth, availableSpacePerElement * 0.7));
    spacing = Math.max(minSpacing, Math.min(maxSpacing, availableSpacePerElement * 0.3));
  } else if (arraySize <= 50) {
    // For small arrays, use moderate bars with good spacing
    barWidth = Math.min(8, Math.max(minBarWidth, availableSpacePerElement * 0.6));
    spacing = Math.max(minSpacing, Math.min(maxSpacing, availableSpacePerElement * 0.4));
  } else if (arraySize <= 100) {
    // For medium arrays, balance bar width and spacing
    barWidth = Math.min(6, Math.max(minBarWidth, availableSpacePerElement * 0.5));
    spacing = Math.max(minSpacing, Math.min(maxSpacing, availableSpacePerElement * 0.5));
  } else {
    // For large arrays, prioritize spacing over bar width
    barWidth = Math.min(4, Math.max(minBarWidth, availableSpacePerElement * 0.4));
    spacing = Math.max(minSpacing, Math.min(maxSpacing, availableSpacePerElement * 0.6));
  }
  
  // Calculate total width with current dimensions
  const totalBarWidth = barWidth * arraySize;
  const totalSpacing = spacing * (arraySize - 1);
  let totalWidth = totalBarWidth + totalSpacing;
  
  // If we're not filling the container width, adjust to fill it
  if (totalWidth < containerWidth && arraySize > 1) {
    const extraSpace = containerWidth - totalWidth;
    const extraSpacePerElement = extraSpace / arraySize;
    
    // Distribute extra space between bars and spacing
    barWidth += extraSpacePerElement * 0.6; // 60% to bars
    spacing += extraSpacePerElement * 0.4; // 40% to spacing
    
    // Recalculate total width
    totalWidth = (barWidth * arraySize) + (spacing * (arraySize - 1));
  }
  
  // If we exceed container width, adjust bar width and spacing proportionally
  if (totalWidth > containerWidth) {
    const scaleFactor = containerWidth / totalWidth;
    barWidth = Math.max(minBarWidth, Math.floor(barWidth * scaleFactor));
    spacing = Math.max(minSpacing, Math.floor(spacing * scaleFactor));
    totalWidth = containerWidth;
  }
  
  return {
    barWidth: Math.floor(barWidth),
    spacing: Math.floor(spacing),
    totalWidth: Math.floor(totalWidth)
  };
}

/**
 * Formats a number for display in the UI
 * @param value - Number to format
 * @returns Formatted string
 */
export function formatNumber(value: number): string {
  if (value < 1000) {
    return value.toString();
  } else if (value < 1000000) {
    return (value / 1000).toFixed(1) + 'K';
  } else {
    return (value / 1000000).toFixed(1) + 'M';
  }
}

/**
 * Formats time duration for display
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
}
