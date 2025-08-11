import React from 'react';
import { AlgorithmType, PerformanceMetrics } from '../types/sorting';
import { getAllAlgorithms } from '../data/algorithms';
import { formatNumber, formatDuration } from '../utils/arrayUtils';
import { Listbox } from '@headlessui/react';
import './ControlPanel.css';

interface ControlPanelProps {
  currentAlgorithm: AlgorithmType;
  speed: number;
  arraySize: number;
  metrics: PerformanceMetrics;
  isRunning: boolean;
  isPaused: boolean;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onSpeedChange: (speed: number) => void;
  onArraySizeChange: (size: number) => void;
  onGenerateArray: () => void;
  onStartSort: () => void;
  onPauseSort: () => void;
  onResumeSort: () => void;
  onCancelSort: () => void;
  onStepSort: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  currentAlgorithm,
  speed,
  arraySize,
  metrics,
  isRunning,
  isPaused,
  onAlgorithmChange,
  onSpeedChange,
  onArraySizeChange,
  onGenerateArray,
  onStartSort,
  onPauseSort,
  onResumeSort,
  onCancelSort,
  onStepSort
}) => {
  const algorithms = getAllAlgorithms();

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(event.target.value);
    onSpeedChange(newSpeed);
  };

  const handleArraySizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value);
    onArraySizeChange(newSize);
  };

  const getSpeedLabel = (speed: number): string => {
    if (speed <= 50) return 'Very Fast';
    if (speed <= 100) return 'Fast';
    if (speed <= 200) return 'Medium';
    if (speed <= 500) return 'Slow';
    return 'Very Slow';
  };

  return (
    <div className="control-panel" role="region" aria-label="Sorting Controls">
      <div className="control-section">
        <h2>Algorithm Selection</h2>
        <div className="algorithm-selector">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Choose Algorithm:</label>
            <Listbox
              value={currentAlgorithm}
              onChange={(value) => onAlgorithmChange(value as AlgorithmType)}
              disabled={isRunning}
            >
              <Listbox.Button className="select-trigger" aria-label="Select sorting algorithm">
                {algorithms.find(a => a.type === currentAlgorithm)?.name}
              </Listbox.Button>
              <Listbox.Options className="select-options">
                {algorithms.map((algo) => (
                  <Listbox.Option
                    key={algo.type}
                    value={algo.type}
                    className={({ active, selected }) =>
                      `select-option ${active ? 'select-option-active' : ''} ${selected ? 'select-option-selected' : ''}`
                    }
                  >
                    {algo.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
            <p className="text-sm text-gray-500">
              {algorithms.find(a => a.type === currentAlgorithm)?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h2>Speed Control</h2>
        <div className="speed-control">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">
              Animation Speed: {getSpeedLabel(speed)}
            </label>
            <input
              type="range"
              value={speed}
              onChange={handleSpeedChange}
              min={0}
              max={500}
              step={10}
              disabled={isRunning}
              aria-label="Animation speed"
              className="speed-slider"
            />
            <p className="text-sm text-gray-500">
              {speed === 0 ? 'Instant (no animation)' : `${speed}ms delay between steps`}
            </p>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h2>Array Size</h2>
        <div className="array-size-control">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">
              Array Size: {arraySize} elements
            </label>
            <input
              type="range"
              value={arraySize}
              onChange={handleArraySizeChange}
              min={10}
              max={200}
              step={5}
              disabled={isRunning}
              aria-label="Array size"
              className="array-size-slider"
            />
            <p className="text-sm text-gray-500">
              {arraySize} elements (10-200 range)
            </p>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h2>Controls</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onGenerateArray}
            disabled={isRunning}
            className="btn btn-soft btn-gray"
          >
            🎲 Randomize Array
          </button>
          
          {!isRunning && !isPaused && (
            <>
              <button
                onClick={onStartSort}
                className="btn btn-solid btn-green"
              >
                ▶️ Start Sort
              </button>
              <button
                onClick={onStepSort}
                className="btn btn-soft btn-blue"
              >
                ⏭️ Step
              </button>
            </>
          )}
          
          {isRunning && !isPaused && (
            <button
              onClick={onPauseSort}
              className="btn btn-soft btn-yellow"
            >
              ⏸️ Pause
            </button>
          )}
          
          {isPaused && (
            <>
              <button
                onClick={onResumeSort}
                className="btn btn-solid btn-green"
              >
                ▶️ Resume
              </button>
              <button
                onClick={onStepSort}
                className="btn btn-soft btn-blue"
              >
                ⏭️ Step
              </button>
            </>
          )}
          
          {(isRunning || isPaused) && (
            <button
              onClick={onCancelSort}
              className="btn btn-soft btn-red"
            >
              ⏹️ Stop
            </button>
          )}
        </div>
      </div>

      <div className="control-section">
        <h2>Performance Metrics</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Steps:</span>
            <span aria-live="polite">
              {formatNumber(metrics.steps)}
            </span>
          </div>
          
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Comparisons:</span>
            <span aria-live="polite">
              {formatNumber(metrics.comparisons)}
            </span>
          </div>
          
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Swaps:</span>
            <span aria-live="polite">
              {formatNumber(metrics.swaps)}
            </span>
          </div>
          
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Time:</span>
            <span aria-live="polite">
              {formatDuration(metrics.executionTime)}
            </span>
          </div>
          
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Memory:</span>
            <span aria-live="polite">
              {metrics.memoryUsage > 0 ? formatNumber(metrics.memoryUsage) + ' B' : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h2>Algorithm Info</h2>
        <div className="algorithm-info">
          {(() => {
            const algo = algorithms.find(a => a.type === currentAlgorithm);
            if (!algo) return null;
            
            return (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex gap-2 justify-between">
                  <span className="font-semibold">Best Case:</span>
                  <span>{algo.timeComplexity.best}</span>
                </div>
                <div className="flex gap-2 justify-between">
                  <span className="font-semibold">Average Case:</span>
                  <span>{algo.timeComplexity.average}</span>
                </div>
                <div className="flex gap-2 justify-between">
                  <span className="font-semibold">Worst Case:</span>
                  <span>{algo.timeComplexity.worst}</span>
                </div>
                <div className="flex gap-2 justify-between">
                  <span className="font-semibold">Space:</span>
                  <span>{algo.spaceComplexity}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
