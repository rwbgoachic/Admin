import { logger } from './logger';

interface CircuitBreakerOptions {
  maxFailures?: number;
  resetTimeout?: number;
  halfOpenRetries?: number;
}

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private state = CircuitState.CLOSED;
  private successfulHalfOpenCalls = 0;

  constructor(private options: CircuitBreakerOptions = {}) {
    this.options = {
      maxFailures: 5,
      resetTimeout: 60000, // 1 minute
      halfOpenRetries: 3,
      ...options,
    };
  }

  async execute<T>(fn: () => Promise<T>, context: string): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
        this.successfulHalfOpenCalls = 0;
      } else {
        await logger.warn('Circuit breaker is open', {
          context,
          failures: this.failures,
          lastFailure: this.lastFailureTime,
        });
        throw new Error('Service is temporarily unavailable');
      }
    }

    try {
      const result = await fn();

      if (this.state === CircuitState.HALF_OPEN) {
        this.successfulHalfOpenCalls++;
        if (this.successfulHalfOpenCalls >= (this.options.halfOpenRetries || 3)) {
          this.reset();
        }
      }

      return result;
    } catch (error) {
      this.recordFailure();

      await logger.error('Circuit breaker recorded failure', {
        context,
        error: error instanceof Error ? error.message : 'Unknown error',
        state: this.state,
        failures: this.failures,
      });

      throw error;
    }
  }

  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= (this.options.maxFailures || 5)) {
      this.state = CircuitState.OPEN;
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true;
    return Date.now() - this.lastFailureTime > (this.options.resetTimeout || 60000);
  }

  private reset() {
    this.failures = 0;
    this.lastFailureTime = undefined;
    this.state = CircuitState.CLOSED;
    this.successfulHalfOpenCalls = 0;
  }

  getState(): CircuitState {
    return this.state;
  }
}