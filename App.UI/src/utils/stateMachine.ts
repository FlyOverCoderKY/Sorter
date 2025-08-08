import { AppState } from '../types/sorting';

export interface StateTransition {
  from: AppState;
  to: AppState;
  action: string;
  guard?: () => boolean;
}

export class StateMachine {
  private currentState: AppState = 'IDLE';
  private transitions: StateTransition[] = [];
  private listeners: Map<AppState, (() => void)[]> = new Map();

  constructor() {
    this.initializeTransitions();
  }

  private initializeTransitions(): void {
    this.transitions = [
      // From IDLE state
      { from: 'IDLE', to: 'GENERATING', action: 'GENERATE_ARRAY' },
      { from: 'IDLE', to: 'SORTING', action: 'START_SORT' },
      
      // From GENERATING state
      { from: 'GENERATING', to: 'IDLE', action: 'ARRAY_GENERATED' },
      { from: 'GENERATING', to: 'SORTING', action: 'START_SORT' },
      
      // From SORTING state
      { from: 'SORTING', to: 'PAUSED', action: 'PAUSE_SORT' },
      { from: 'SORTING', to: 'COMPLETED', action: 'SORT_COMPLETE' },
      { from: 'SORTING', to: 'IDLE', action: 'CANCEL_SORT' },
      
      // From PAUSED state
      { from: 'PAUSED', to: 'SORTING', action: 'RESUME_SORT' },
      { from: 'PAUSED', to: 'IDLE', action: 'CANCEL_SORT' },
      
      // From COMPLETED state
      { from: 'COMPLETED', to: 'IDLE', action: 'RESET' },
      { from: 'COMPLETED', to: 'GENERATING', action: 'GENERATE_ARRAY' },
      { from: 'COMPLETED', to: 'SORTING', action: 'START_SORT' }
    ];
  }

  getCurrentState(): AppState {
    return this.currentState;
  }

  canTransition(action: string): boolean {
    return this.transitions.some(
      transition => transition.from === this.currentState && transition.action === action
    );
  }

  transition(action: string): boolean {
    const transition = this.transitions.find(
      t => t.from === this.currentState && t.action === action
    );

    if (!transition) {
      console.warn(`Invalid transition: ${action} from state ${this.currentState}`);
      return false;
    }

    if (transition.guard && !transition.guard()) {
      console.warn(`Transition guard failed for: ${action}`);
      return false;
    }

    const previousState = this.currentState;
    this.currentState = transition.to;
    
    console.log(`State transition: ${previousState} -> ${this.currentState} (${action})`);
    
    // Notify listeners
    this.notifyListeners(this.currentState);
    
    return true;
  }

  onStateChange(state: AppState, callback: () => void): () => void {
    if (!this.listeners.has(state)) {
      this.listeners.set(state, []);
    }
    
    this.listeners.get(state)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(state);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifyListeners(state: AppState): void {
    const callbacks = this.listeners.get(state);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }

  // Helper methods for common state checks
  isIdle(): boolean {
    return this.currentState === 'IDLE';
  }

  isGenerating(): boolean {
    return this.currentState === 'GENERATING';
  }

  isSorting(): boolean {
    return this.currentState === 'SORTING';
  }

  isPaused(): boolean {
    return this.currentState === 'PAUSED';
  }

  isCompleted(): boolean {
    return this.currentState === 'COMPLETED';
  }

  canStartSort(): boolean {
    return ['IDLE', 'GENERATING', 'COMPLETED'].includes(this.currentState);
  }

  canPause(): boolean {
    return this.currentState === 'SORTING';
  }

  canResume(): boolean {
    return this.currentState === 'PAUSED';
  }

  canCancel(): boolean {
    return ['SORTING', 'PAUSED'].includes(this.currentState);
  }

  canGenerate(): boolean {
    return ['IDLE', 'COMPLETED'].includes(this.currentState);
  }
}
