import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { SortingStep } from '../types/sorting';
import { calculateBarDimensions } from '../utils/arrayUtils';
import './BarDisplay.css';

interface BarDisplayProps {
  array: number[];
  currentStep: SortingStep | null;
  isRunning: boolean;
}

// Memoized individual bar component to prevent unnecessary re-renders
const Bar = React.memo<{
  value: number;
  index: number;
  maxValue: number;
  barWidth: number;
  spacing: number;
  isLast: boolean;
  currentStep: SortingStep | null;
  isRunning: boolean;
  isSizeChanging: boolean;
}>(({ value, index, maxValue, barWidth, spacing, isLast, currentStep, isRunning, isSizeChanging }) => {
  // Memoized color calculation
  const backgroundColor = useMemo(() => {
    if (!currentStep || !isRunning) {
      return 'var(--bar-default-color)';
    }

    const { type, indices } = currentStep;

    // Highlight bars involved in current operation
    if (indices.includes(index)) {
      switch (type) {
        case 'compare':
          return 'var(--bar-compare-color)';
        case 'swap':
          return 'var(--bar-swap-color)';
        case 'select':
          return 'var(--bar-select-color)';
        case 'insert':
          return 'var(--bar-insert-color)';
        case 'merge':
          return 'var(--bar-merge-color)';
        default:
          return 'var(--bar-active-color)';
      }
    }

    // Highlight sorted portions (for algorithms like insertion sort)
    if (type === 'insert' && index < indices[0]) {
      return 'var(--bar-sorted-color)';
    }

    return 'var(--bar-default-color)';
  }, [currentStep, isRunning, index]);

  // Memoized border calculation
  const border = useMemo(() => {
    if (!currentStep || !isRunning) return 'none';
    
    const { indices } = currentStep;
    
    if (indices.includes(index)) {
      return '2px solid var(--bar-border-color)';
    }
    
    return 'none';
  }, [currentStep, isRunning, index]);

  // Memoized tooltip content
  const tooltip = useMemo(() => {
    let tooltipText = `Position ${index + 1}, Value: ${value}`;
    
    if (currentStep && isRunning) {
      const { indices, description } = currentStep;
      if (indices.includes(index)) {
        tooltipText += ` - ${description}`;
      }
    }
    
    return tooltipText;
  }, [currentStep, isRunning, index, value]);

  // Only apply transitions when size is changing, not during sorting
  const transition = isSizeChanging ? 'width 0.3s ease, margin-right 0.3s ease' : 'none';

  return (
    <div
      className="bar"
      style={{
        height: `${(value / maxValue) * 100}%`,
        width: `${barWidth}px`,
        marginRight: isLast ? '0px' : `${spacing}px`,
        backgroundColor,
        border,
        opacity: 1,
        transition
      }}
      role="img"
      aria-label={tooltip}
      title={tooltip}
      data-index={index}
      data-value={value}
    />
  );
});

Bar.displayName = 'Bar';

const BarDisplay = React.memo<BarDisplayProps>(({ array, currentStep, isRunning }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxValue = Math.max(...array, 1);
  const [isSizeChanging, setIsSizeChanging] = useState(false);
  const [prevArraySize, setPrevArraySize] = useState(array.length);

  // Calculate bar dimensions based on container width and array size
  const barDimensions = useMemo(() => {
    if (!containerRef.current) return { barWidth: 4, spacing: 2, totalWidth: 0 };
    
    const containerWidth = containerRef.current.clientWidth;
    return calculateBarDimensions(containerWidth, array.length);
  }, [array.length]);

  // Track array size changes for smooth transitions
  useEffect(() => {
    if (prevArraySize !== array.length) {
      setIsSizeChanging(true);
      setPrevArraySize(array.length);
      
      // Reset the size changing flag after transition completes
      const timer = setTimeout(() => {
        setIsSizeChanging(false);
      }, 300); // Match the transition duration
      
      return () => clearTimeout(timer);
    }
  }, [array.length, prevArraySize]);

  // Update bar dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render by updating a state or ref
      if (containerRef.current) {
        containerRef.current.style.width = containerRef.current.clientWidth + 'px';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (array.length === 0) {
    return (
      <div className="bar-display empty" ref={containerRef}>
        <div className="flex flex-col items-center gap-2 empty-message">
          <span className="text-lg">No data to display</span>
          <span className="text-sm text-gray-500">Generate an array to get started</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bar-display" ref={containerRef}>
      <div 
        className="bar-container"
        style={{
          maxWidth: '100%'
        }}
      >
        {array.map((value, index) => (
          <Bar
            key={index}
            value={value}
            index={index}
            maxValue={maxValue}
            barWidth={barDimensions.barWidth}
            spacing={barDimensions.spacing}
            isLast={index === array.length - 1}
            currentStep={currentStep}
            isRunning={isRunning}
            isSizeChanging={isSizeChanging}
          />
        ))}
      </div>
      
      {/* Current step indicator */}
      {currentStep && isRunning && (
        <div className="flex flex-col gap-1 step-indicator" role="status" aria-live="polite">
          <span className="font-semibold text-sm">{currentStep.type.toUpperCase()}</span>
          <span className="text-sm">{currentStep.description}</span>
        </div>
      )}
      
      {/* Array info */}
      <div className="flex gap-4 array-info">
        <span className="text-sm">Array Size: {array.length}</span>
        <span className="text-sm">Range: {Math.min(...array)} - {Math.max(...array)}</span>
      </div>
    </div>
  );
});

BarDisplay.displayName = 'BarDisplay';

export default BarDisplay;
