import React from 'react';
import { AlgorithmConfig, SortingStep, PerformanceMetrics } from '../types/sorting';
import './AlgorithmExplanation.css';

interface AlgorithmExplanationProps {
  algorithm: AlgorithmConfig;
  currentStep: SortingStep | null;
  metrics: PerformanceMetrics;
}

const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({
  algorithm,
  currentStep,
  metrics
}) => {
  const getStepHighlightClass = (): string => {
    if (!currentStep) return '';
    
    // Simple heuristic for highlighting based on step type
    switch (currentStep.type) {
      case 'compare':
        return 'highlight-compare';
      case 'swap':
        return 'highlight-swap';
      case 'select':
        return 'highlight-select';
      case 'insert':
        return 'highlight-insert';
      case 'merge':
        return 'highlight-merge';
      default:
        return '';
    }
  };

  return (
    <div className="algorithm-explanation" role="region" aria-label="Algorithm Explanation">
      <div className="explanation-content">
        {/* Header Section */}
        <div className="explanation-header">
          <h2 className="algorithm-title">{algorithm.name}</h2>
          <p className="algorithm-description">{algorithm.description}</p>
        </div>

        {/* Main Content */}
        <div className="explanation-sections">
          {/* Pseudo-code Section */}
          <div className="pseudo-code-section">
            <h3 className="section-title">Pseudo-code</h3>
            <div className="pseudo-code">
              {algorithm.pseudoCode.map((line, index) => (
                <div
                  key={index}
                  className={`code-line ${getStepHighlightClass()}`}
                  aria-live="polite"
                >
                  <span className="line-number">{index + 1}</span>
                  <span className="line-content">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Operation Section */}
          <div className="current-step-section">
            <h3 className="section-title">Current Operation</h3>
            {currentStep ? (
              <div className="current-step">
                <div className="step-type">
                  <span className="step-label">Type:</span>
                  <span className="step-value">{currentStep.type.toUpperCase()}</span>
                </div>
                <div className="step-indices">
                  <span className="step-label">Positions:</span>
                  <span className="step-value">{currentStep.indices.join(', ')}</span>
                </div>
                <div className="step-values">
                  <span className="step-label">Values:</span>
                  <span className="step-value">{currentStep.values.join(', ')}</span>
                </div>
                <div className="step-description">
                  <span className="step-label">Description:</span>
                  <span className="step-value">{currentStep.description}</span>
                </div>
              </div>
            ) : (
              <div className="no-step">
                <p>No operation in progress</p>
                <p>Click "Start Sort" to begin visualization</p>
              </div>
            )}
          </div>

          {/* Performance Analysis Section */}
          <div className="performance-section">
            <h3 className="section-title">Performance Analysis</h3>
            <div className="complexity-grid">
              <div className="complexity-item">
                <span className="complexity-label">Best Case:</span>
                <span className="complexity-value">{algorithm.timeComplexity.best}</span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">Average Case:</span>
                <span className="complexity-value">{algorithm.timeComplexity.average}</span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">Worst Case:</span>
                <span className="complexity-value">{algorithm.timeComplexity.worst}</span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">Space Complexity:</span>
                <span className="complexity-value">{algorithm.spaceComplexity}</span>
              </div>
            </div>
          </div>

          {/* Current Metrics Section */}
          <div className="metrics-section">
            <h3 className="section-title">Current Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Steps:</span>
                <span className="metric-value" aria-live="polite">{metrics.steps}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Comparisons:</span>
                <span className="metric-value" aria-live="polite">{metrics.comparisons}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Swaps:</span>
                <span className="metric-value" aria-live="polite">{metrics.swaps}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Execution Time:</span>
                <span className="metric-value" aria-live="polite">
                  {metrics.executionTime > 0 ? `${Math.round(metrics.executionTime)}ms` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmExplanation;
